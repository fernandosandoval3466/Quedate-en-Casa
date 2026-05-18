const { poolPromise, sql } = require('../config/database');

const addProduct = async (req, res) => {
  const { nombre, descripcion, precio, precioOriginal, imagenUrl, stock } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('descripcion', sql.Text, descripcion)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('precioOriginal', sql.Decimal(10, 2), precioOriginal)
      .input('imagenUrl', sql.VarChar, imagenUrl)
      .input('stock', sql.Int, stock || 0)
      .query(`
        INSERT INTO dbo.Productos (Nombre, Descripcion, Precio, Precio_Original, Imagen_Url, Stock)
        VALUES (@nombre, @descripcion, @precio, @precioOriginal, @imagenUrl, @stock)
      `);

    res.status(201).json({ message: 'Producto agregado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar el producto: ' + err.message });
  }
};

module.exports = { addProduct };