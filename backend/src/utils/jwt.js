const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ CRÍTICO: La variable JWT_SECRET no está definida en el archivo .env');
  process.exit(1); // Termina la aplicación si no hay secreto JWT
}

const generateToken = (userId, email, role = 'cliente') => {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };