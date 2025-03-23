const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

const generateRandomEmail = () => `user${Date.now()}@example.com`;

let token;

describe('Pruebas de Endpoints de Usuarios', () => {
  beforeAll(async () => {
    const email = generateRandomEmail();

    await request(app).post('/usuarios').send({
      name: 'Usuario Admin',
      email: email,
      password: 'Contraseña123!',
      role: 'admin',
    });

    const response = await request(app).post('/usuarios/login').send({
      email: email,
      password: 'Contraseña123!',
    });

    token = response.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('Debe crear un usuario exitosamente', async () => {
    const response = await request(app)
      .post('/usuarios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Nuevo Usuario',
        email: generateRandomEmail(),
        password: 'NuevaContraseña123!',
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
  });

  it('Debe devolver un error 400 si los datos son inválidos', async () => {
    const response = await request(app)
      .post('/usuarios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '',
        email: 'correo_invalido',
        password: '1234',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  it('Debe obtener la lista de usuarios', async () => {
    console.log('Test: Debe obtener la lista de usuarios');
    console.log(`Bearer ${token}`);
    const response = await request(app)
    .get('/usuarios')
    .set('Authorization', `Bearer ${token}`);  
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Debe devolver un error 404 si un usuario no existe', async () => {
    const response = await request(app)
      .get('/usuarios/64123abcdef1234567890123')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  });
});
