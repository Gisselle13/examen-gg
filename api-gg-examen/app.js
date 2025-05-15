require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const xss = require('xss-clean');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const app = express();

const swaggerConfig = require('./config/swagger');
swaggerConfig(app);

// Middleware global
app.use(cors());
// //Restringe orígenes no autorizados con cors
//app.use(cors({ origin: 'http://tudominio.com' }));
app.use(helmet());
app.use(express.json());
app.use(errorHandler);
app.use(morgan('dev')); // Registra las solicitudes en la consola

// Conexión a la base de datos
// mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Conexión a la base de datos exitosa'))
//   .catch(err => {
//     console.error('Error al conectar a la base de datos:', err);
//     console.log('URL de la base de datos:', process.env.DB_URL);
//   }
// );

mongoose.connect('mongodb://127.0.0.1:27017/user_management')
  .then(() => console.log('Conexión a la base de datos exitosa'))
  .catch((err) => console.error('Error al conectar a la base de datos:', err));


app.use(xss());

// Rutas
app.use('/usuarios', userRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


module.exports = app;
