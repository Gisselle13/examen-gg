const express = require('express');
const { getUsers, createUser, updateUser, deleteUser, updatePartialUser } = require('../controllers/userController');
const { loginUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateUser } = require('../middlewares/validationMiddleware');
const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica a un usuario con su correo y contraseña para generar un token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "juan.perez@example.com"
 *               password:
 *                 type: string
 *                 example: "Contraseña123!"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Devuelve el token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciales incorrectas.
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Listar todos los usuarios
 *     description: Devuelve una lista de todos los usuarios registrados.
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64123abcdef1234567890123"
 *                   name:
 *                     type: string
 *                     example: "Juan Pérez"
 *                   email:
 *                     type: string
 *                     example: "juan.perez@example.com"
 *       401:
 *         description: No autorizado. Token no proporcionado o inválido.
 */
router.get('/', authMiddleware, getUsers);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Registra un nuevo usuario en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 example: "juan.perez@example.com"
 *               password:
 *                 type: string
 *                 example: "Contraseña123!"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64123abcdef1234567890123"
 *       400:
 *         description: Error en la validación de los datos enviados.
 */
router.post('/', validateUser, createUser);
// router.post('/', authMiddleware, validateUser, createUser);
// Comentamos la autenticación solamente para poder crear un primer usuario sin problemas

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     description: Modifica completamente los datos de un usuario registrado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del usuario.
 *         schema:
 *           type: string
 *           example: "64123abcdef1234567890123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Pérez Actualizado"
 *               email:
 *                 type: string
 *                 example: "juan.actualizado@example.com"
 *               password:
 *                 type: string
 *                 example: "NuevaContraseña123!"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 *       400:
 *         description: Error en la validación de los datos enviados.
 */
router.put('/:id', authMiddleware, validateUser, updateUser);

/**
 * @swagger
 * /{id}:
 *   patch:
 *     summary: Actualización parcial de un usuario
 *     description: Modifica parcialmente los datos de un usuario registrado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del usuario.
 *         schema:
 *           type: string
 *           example: "64123abcdef1234567890123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Parcial"
 *               email:
 *                 type: string
 *                 example: "parcial@example.com"
 *     responses:
 *       200:
 *         description: Datos del usuario actualizados parcialmente.
 *       400:
 *         description: Error en la validación de los datos enviados.
 */
router.patch('/:id', authMiddleware, updatePartialUser);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario del sistema mediante su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del usuario.
 *         schema:
 *           type: string
 *           example: "64123abcdef1234567890123"
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 */
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
