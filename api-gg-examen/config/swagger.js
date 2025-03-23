const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gestión de Usuarios API',
      version: '1.0.0',
      description: 'API para gestionar usuarios',
    },
  },
  apis: ['./routes/*.js'], // Archivos donde documentaste los endpoints
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
