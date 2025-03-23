const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Continúa al siguiente middleware o controlador
  } catch (err) {
    res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

module.exports = authMiddleware;
