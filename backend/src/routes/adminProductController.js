const { poolPromise, sql } = require('../config/database');

const createProduct = async (req, res) => {
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
      .query(`
        INSERT INTO dbo.Productos (Nombre, Descripcion, Precio, Precio_Original, Imagen_Url, Stock)
        VALUES (@nombre, @descripcion, @precio, @precio_original, @imagen_url, @stock)
      `);

    res.status(201).json({ message: 'Producto creado correctamente' });
  } catch (err) {
    console.error('❌ Error al crear producto:', err.message);
    res.status(500).json({ error: 'Error en el servidor al crear producto' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, precio_original, imagen_url, stock } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.VarChar, nombre)
      .input('descripcion', sql.Text, descripcion)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('precio_original', sql.Decimal(10, 2), precio_original || null)
      .input('imagen_url', sql.VarChar, imagen_url)
      .input('stock', sql.Int, stock)
      .query(`
        UPDATE dbo.Productos 
        SET Nombre = @nombre, Descripcion = @descripcion, Precio = @precio, 
            Precio_Original = @precio_original, Imagen_Url = @imagen_url, Stock = @stock 
        WHERE Id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar producto:', err.message);
    res.status(500).json({ error: 'Error en el servidor al actualizar producto' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM dbo.Productos WHERE Id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar producto:', err.message);
    res.status(500).json({ error: 'Error en el servidor al eliminar producto' });
  }
};

module.exports = { createProduct, updateProduct, deleteProduct };