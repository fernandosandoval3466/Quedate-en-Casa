const { poolPromise, sql } = require('../config/database');

const addProduct = async (req, res) => {
  const { nombre, descripcion, precio, precio_original, imagen_url, stock } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('descripcion', sql.Text, descripcion)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('precio_original', sql.Decimal(10, 2), precio_original || null)
      .input('imagen_url', sql.VarChar, imagen_url)
      .input('stock', sql.Int, stock)
      .query('INSERT INTO dbo.Productos (Nombre, Descripcion, Precio, Precio_Original, Imagen_Url, Stock) VALUES (@nombre, @descripcion, @precio, @precio_original, @imagen_url, @stock)');
    
    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (err) {
    console.error('Error al agregar producto:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, precio_original, imagen_url, stock } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, parseInt(id, 10))
      .input('nombre', sql.VarChar, nombre)
      .input('descripcion', sql.Text, descripcion)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('precio_original', sql.Decimal(10, 2), precio_original || null)
      .input('imagen_url', sql.VarChar, imagen_url)
      .input('stock', sql.Int, stock)
      .query('UPDATE dbo.Productos SET Nombre = @nombre, Descripcion = @descripcion, Precio = @precio, Precio_Original = @precio_original, Imagen_Url = @imagen_url, Stock = @stock WHERE Id = @id');
    
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
    await pool.request()
      .input('id', sql.Int, parseInt(id, 10))
      .query('DELETE FROM dbo.Productos WHERE Id = @id');
    
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar producto:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { addProduct, updateProduct, deleteProduct };