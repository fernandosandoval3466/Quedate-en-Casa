const { poolPromise, sql } = require('../config/database');

const getProductReviews = async (req, res) => {
  const { productId } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('productId', sql.Int, productId)
      .query(`
        SELECT r.Id, r.Calificacion, r.Comentario, r.Fecha, u.Nombre as Usuario
        FROM dbo.Reseñas r
        JOIN dbo.Usuarios u ON r.Usuario_Id = u.Id
        WHERE r.Producto_Id = @productId
        ORDER BY r.Fecha DESC
      `);
    res.json({ data: result.recordset });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
};

const addReview = async (req, res) => {
  const { userId } = req;
  const { productId, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Calificación inválida (1-5)' });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('productId', sql.Int, productId)
      .input('userId', sql.Int, userId)
      .input('rating', sql.Int, rating)
      .input('comment', sql.Text, comment)
      .query(`
        INSERT INTO dbo.Reseñas (Producto_Id, Usuario_Id, Calificacion, Comentario)
        VALUES (@productId, @userId, @rating, @comment)
      `);
    res.status(201).json({ message: 'Reseña agregada con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar la reseña' });
  }
};

module.exports = { getProductReviews, addReview };