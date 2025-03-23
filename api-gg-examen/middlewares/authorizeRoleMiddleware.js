const authorizeRole = (role) => {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).json({ error: 'Acceso denegado. Permisos insuficientes.' });
      }
      next();
    };
  };
  
  // Ejemplo de uso en rutas
  router.delete('/:id', authMiddleware, authorizeRole('admin'), deleteUser);
  