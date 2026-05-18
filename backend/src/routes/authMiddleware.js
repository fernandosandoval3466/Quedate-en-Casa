const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Acceso denegado: No se proporcionó token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // Seteamos estos valores para que coincidan con la firma generada en utils/jwt.js
    req.userId = decoded.userId || decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token no válido o expirado' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role?.toLowerCase() === 'administrador') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado: Se requieren permisos de administrador' });
  }
};

module.exports = { verifyToken, isAdmin };