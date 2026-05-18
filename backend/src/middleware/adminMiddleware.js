const adminMiddleware = (req, res, next) => {
    // El authMiddleware previo debe haber decodificado el token en req.user
    if (req.user && req.user.role === 'administrador') {
        next();
    } else {
        return res.status(403).json({ 
            error: 'Acceso denegado: Se requieren permisos de administrador' 
        });
    }
};

module.exports = adminMiddleware;