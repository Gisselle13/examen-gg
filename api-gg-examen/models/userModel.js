const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: [true, 'El nombre es obligatorio'] 
    },
    email: { 
      type: String, 
      required: [true, 'El correo es obligatorio'], 
      unique: true, 
      match: [/.+@.+\..+/, 'Por favor ingresa un correo válido'] 
    },
    password: { 
      type: String, 
      required: [true, 'La contraseña es obligatoria'], 
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      validate: {
        validator: function(value) {
          return /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[@$!%*?&]/.test(value);
        },
        message: 'La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial'
      }
    },
    role: { 
      type: String, 
      enum: ['admin', 'user'], 
      default: 'user' 
    }
  }, { timestamps: true });

// Hash de la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);