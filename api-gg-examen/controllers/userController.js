const User = require('../models/userModel');

const getUsers = async (req, res) => {
    try {
      // Obtener los parámetros de consulta
      const { nombre, correo, fecha, page = 1, limit = 10, sort = 'name' } = req.query;
  
      // Construir el filtro dinámicamente
      const filter = {};
      if (nombre) filter.name = new RegExp(nombre, 'i'); // Búsqueda insensible a mayúsculas/minúsculas
      if (correo) filter.email = correo; // Búsqueda exacta por correo
      if (fecha) filter.createdAt = { $gte: new Date(fecha) }; // Usuarios creados después de cierta fecha
  
      // Calcular el desplazamiento para la paginación
      const skip = (page - 1) * limit;
  
      // Obtener los usuarios con los filtros, paginación y ordenamiento
      const users = await User.find(filter)
        .sort(sort) // Ordenar por el campo especificado
        .skip(skip) // Saltar los primeros resultados según la página
        .limit(parseInt(limit)); // Limitar el número de resultados
  
      // Obtener el número total de usuarios que cumplen con los filtros
      const totalUsers = await User.countDocuments(filter);
  
      // Enviar la respuesta con los usuarios y datos de paginación
      res.status(200).json({
        total: totalUsers,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalUsers / limit),
        data: users,
      });
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  };

const createUser = async (req, res) => {
    try {
      // const { name, email, password } = req.body;
  
      // // Crear usuario
      // const newUser = await User.create({ name, email, password });

      const { name, email, password, role } = req.body;

// Crear usuario incluyendo el rol si se envía
const newUser = await User.create({ name, email, password, role });

      res.status(201).json(newUser);
    } catch (err) {
      if (err.code === 11000) {
        // Error de unicidad (email duplicado)
        return res.status(400).json({ error: 'El correo ya está en uso' });
      }
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  };


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

const updatePartialUser = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(400).json({ error: 'Error al actualizar usuario' });
    }
  };

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser, updatePartialUser };