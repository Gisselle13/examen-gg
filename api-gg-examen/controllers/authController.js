const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // El token expirará en 1 hora
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (err) {
    res.status(500).json({ error: 'Error al procesar la solicitud.' });
  }
};

module.exports = { loginUser };
