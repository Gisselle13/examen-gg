const { check, validationResult } = require('express-validator');

const validateUser = [
  check('name').notEmpty().withMessage('El nombre es obligatorio'),
  check('email').isEmail().withMessage('El correo debe ser válido'),
  check('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una letra mayúscula')
    .matches(/[a-z]/).withMessage('La contraseña debe incluir al menos una letra minúscula')
    .matches(/\d/).withMessage('La contraseña debe incluir al menos un número')
    .matches(/[@$!%*?&]/).withMessage('La contraseña debe incluir al menos un carácter especial'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateUser };
