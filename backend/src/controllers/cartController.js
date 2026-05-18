const { poolPromise, sql } = require('../config/database');

const getCart = async (req, res) => {
  const { userId } = req;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID not found in token.' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT 
          c.Id AS CartItemId, 
          c.Producto_Id AS ProductId, 
          c.Cantidad, 
          p.Nombre, 
          p.Precio, 
          p.Imagen_Url,
          p.Descripcion,
          p.Precio_Original,
          p.Rating,
          p.Stock
        FROM dbo.Carrito c
        JOIN dbo.Productos p ON c.Producto_Id = p.Id
        WHERE c.Usuario_Id = @userId
      `);

    const cartItems = result.recordset.map(item => ({
      cartItemId: item.CartItemId,
      productId: item.ProductId,
      quantity: item.Cantidad,
      name: item.Nombre,
      price: item.Precio,
      image: item.Imagen_Url,
      description: item.Descripcion,
      originalPrice: item.Precio_Original,
      rating: item.Rating,
      stock: item.Stock
    }));

    res.status(200).json({ data: cartItems });
  } catch (err) {
    console.error('Error al obtener el carrito:', err);
    res.status(500).json({ error: 'Error interno del servidor al obtener el carrito.' });
  }
};

const addToCart = async (req, res) => {
  const { userId } = req;
  const { productId, quantity = 1 } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID not found in token.' });
  }
  if (!productId || quantity <= 0) {
    return res.status(400).json({ error: 'Product ID and valid quantity are required.' });
  }

  try {
    const pool = await poolPromise;

    // Verificar si el producto existe
    const productCheck = await pool.request()
      .input('productId', sql.Int, productId)
      .query('SELECT Id, Stock FROM dbo.Productos WHERE Id = @productId');

    if (productCheck.recordset.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    const productStock = productCheck.recordset[0].Stock;

    // Verificar si el item ya está en el carrito del usuario
    const existingCartItem = await pool.request()
      .input('userId', sql.Int, userId)
      .input('productId', sql.Int, productId)
      .query('SELECT Cantidad FROM dbo.Carrito WHERE Usuario_Id = @userId AND Producto_Id = @productId');

    if (existingCartItem.recordset.length > 0) {
      const currentQuantity = existingCartItem.recordset[0].Cantidad;
      const newQuantity = currentQuantity + quantity;
      if (newQuantity > productStock) {
        return res.status(400).json({ error: `No hay suficiente stock para añadir ${quantity} unidades más. Stock disponible: ${productStock - currentQuantity}` });
      }
      // Actualizar cantidad
      await pool.request()
        .input('userId', sql.Int, userId)
        .input('productId', sql.Int, productId)
        .input('quantity', sql.Int, newQuantity)
        .query('UPDATE dbo.Carrito SET Cantidad = @quantity WHERE Usuario_Id = @userId AND Producto_Id = @productId');
    } else {
      if (quantity > productStock) {
        return res.status(400).json({ error: `No hay suficiente stock para añadir ${quantity} unidades. Stock disponible: ${productStock}` });
      }
      // Añadir nuevo item
      await pool.request()
        .input('userId', sql.Int, userId)
        .input('productId', sql.Int, productId)
        .input('quantity', sql.Int, quantity)
        .query('INSERT INTO dbo.Carrito (Usuario_Id, Producto_Id, Cantidad) VALUES (@userId, @productId, @quantity)');
    }

    res.status(200).json({ message: 'Producto añadido al carrito.' });
  } catch (err) {
    console.error('Error al añadir producto al carrito:', err);
    res.status(500).json({ error: 'Error interno del servidor al añadir al carrito.' });
  }
};

const removeFromCart = async (req, res) => {
  const { userId } = req;
  const { productId } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID not found in token.' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('productId', sql.Int, productId)
      .query('DELETE FROM dbo.Carrito WHERE Usuario_Id = @userId AND Producto_Id = @productId');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito o carrito vacío.' });
    }

    res.status(200).json({ message: 'Producto eliminado del carrito.' });
  } catch (err) {
    console.error('Error al eliminar producto del carrito:', err);
    res.status(500).json({ error: 'Error interno del servidor al eliminar del carrito.' });
  }
};

const updateCart = async (req, res) => {
  const { userId } = req;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID not found in token.' });
  }
  if (!productId || quantity === undefined) {
    return res.status(400).json({ error: 'Product ID and quantity are required.' });
  }

  try {
    const pool = await poolPromise;

    if (quantity <= 0) {
      // Si la cantidad es 0 o menos, eliminar el producto del carrito
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('productId', sql.Int, productId)
        .query('DELETE FROM dbo.Carrito WHERE Usuario_Id = @userId AND Producto_Id = @productId');

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: 'Item no encontrado en el carrito.' });
      }
      return res.status(200).json({ message: 'Producto eliminado del carrito.' });
    } else {
      // Actualizar la cantidad
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('productId', sql.Int, productId)
        .input('quantity', sql.Int, quantity)
        .query('UPDATE dbo.Carrito SET Cantidad = @quantity WHERE Usuario_Id = @userId AND Producto_Id = @productId');

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: 'Item no encontrado en el carrito.' });
      }
      return res.status(200).json({ message: 'Carrito actualizado.' });
    }
  } catch (err) {
    console.error('Error al actualizar el carrito:', err);
    res.status(500).json({ error: 'Error interno del servidor al actualizar el carrito.' });
  }
};

const clearCart = async (req, res) => {
  const { userId } = req;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID not found in token.' });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('userId', sql.Int, userId)
      .query('DELETE FROM dbo.Carrito WHERE Usuario_Id = @userId');

    res.status(200).json({ message: 'Carrito vaciado.' });
  } catch (err) {
    console.error('Error al vaciar el carrito:', err);
    res.status(500).json({ error: 'Error interno del servidor al vaciar el carrito.' });
  }
};

module.exports = { getCart, addToCart, removeFromCart, updateCart, clearCart };
