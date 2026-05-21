const { poolPromise, sql } = require('../config/database');

const addProduct = async (req, res) => {
  const { nombre, descripcion, precio, precio_original, imagen_url, stock, categoria } = req.body;
  
  if (!nombre || !descripcion || !precio || !imagen_url || stock === undefined) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados' });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('descripcion', sql.Text, descripcion)
      .input('precio', sql.Decimal(10, 2), parseFloat(precio))
      .input('precio_original', sql.Decimal(10, 2), precio_original ? parseFloat(precio_original) : null)
      .input('imagen_url', sql.VarChar, imagen_url)
      .input('stock', sql.Int, parseInt(stock, 10))
      .input('categoria', sql.VarChar, categoria || 'General')
      .query('INSERT INTO dbo.Productos (Nombre, Descripcion, Precio, Precio_Original, Imagen_Url, Stock, Categoria) VALUES (@nombre, @descripcion, @precio, @precio_original, @imagen_url, @stock, @categoria)');
    
    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (err) {
    console.error('Error al agregar producto:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, precio_original, imagen_url, stock, categoria } = req.body;

  if (!nombre || !descripcion || !precio || !imagen_url || stock === undefined) {
    return res.status(400).json({ error: 'Datos incompletos para actualizar' });
  }

  try {
    const pool = await poolPromise;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return res.status(400).json({ error: 'ID de producto inválido' });

    const result = await pool.request()
      .input('id', sql.Int, numericId)
      .input('nombre', sql.VarChar, nombre)
      .input('descripcion', sql.Text, descripcion)
      .input('precio', sql.Decimal(10, 2), parseFloat(precio))
      .input('precio_original', sql.Decimal(10, 2), precio_original ? parseFloat(precio_original) : null)
      .input('imagen_url', sql.VarChar, imagen_url)
      .input('stock', sql.Int, parseInt(stock, 10))
      .input('categoria', sql.VarChar, categoria || 'General')
      .query('UPDATE dbo.Productos SET Nombre = @nombre, Descripcion = @descripcion, Precio = @precio, Precio_Original = @precio_original, Imagen_Url = @imagen_url, Stock = @stock, Categoria = @categoria WHERE Id = @id');
    
    res.status(200).json({ 
      message: 'Producto actualizado exitosamente',
      updatedId: id 
    });
  } catch (err) {
    console.error('❌ Error detallado al actualizar producto:', {
      message: err.message,
      productId: id,
      stack: err.stack
    });
    res.status(500).json({ error: 'Error en el servidor al actualizar el producto. Verifique los tipos de datos en la DB.' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return res.status(400).json({ error: 'ID de producto inválido' });

    const result = await pool.request()
      .input('id', sql.Int, numericId)
      .query('DELETE FROM dbo.Productos WHERE Id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar producto:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { addProduct, updateProduct, deleteProduct };