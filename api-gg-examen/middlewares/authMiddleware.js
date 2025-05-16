// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next(); // Continúa al siguiente middleware o controlador
//   } catch (err) {
//     res.status(403).json({ error: 'Token inválido o expirado.' });
//   }
// };

// module.exports = authMiddleware;

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const rawHeader = req.header('Authorization');
  console.log('Authorization header:', rawHeader);

  const token = rawHeader?.replace('Bearer ', '');
  console.log('Token extraído:', token);

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Error al verificar token:', err.message);
    res.status(403).json({ error: 'Token inválido o expirado....' });
  }
};

module.exports = authMiddleware;

