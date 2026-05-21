const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Acceso denegado: No se proporcionó token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // Aseguramos que el ID sea un número entero para evitar errores EPARAM en SQL Server
    const rawId = decoded.userId || decoded.id || decoded.sub;
    
    if (!rawId) return res.status(401).json({ error: 'Token no contiene identificación de usuario' });

    const parsedId = parseInt(rawId, 10);
    if (isNaN(parsedId)) return res.status(400).json({ error: 'Identificador de usuario inválido en el token' });
    
    req.userId = parsedId;
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