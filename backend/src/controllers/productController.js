const { poolPromise, sql } = require('../config/database');

const getAllProducts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT Id, Nombre, Descripcion, Precio, Precio_Original, Imagen_Url, Stock, Rating, Categoria FROM dbo.Productos');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error al obtener todos los productos:', err.message);
    res.status(500).json({ error: 'Error en el servidor al obtener productos' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }

    const result = await pool.request()
      .input('id', sql.Int, numericId)
      .query('SELECT Id, Nombre, Descripcion, Precio, Precio_Original, Imagen_Url, Stock, Rating, Categoria FROM dbo.Productos WHERE Id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error('Error al obtener producto por ID:', err.message);
    res.status(500).json({ error: 'Error en el servidor al obtener el producto' });
  }
};

module.exports = { getAllProducts, getProductById };