const express = require("express");
const router = express.Router();

const { keycloak } = require("../config/keycloak.js");
const { hasRole } = require("../middleware/auth.js");

const {
  // Endpoints propios del usuario
  get_user,
  update_user,
  delete_user,
  // Endpoints de administración
  get_all_users,
  get_user_by_id,
  update_user_by_id,
  delete_user_by_id
} = require("../controllers/users_controller.js");

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *       401:
 *         description: No autenticado
 */
router.get("/user/me", keycloak.protect(), get_user);

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Actualizar información del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "User"
 *               last_name:
 *                 type: string
 *                 example: "Updated"
 *               email:
 *                 type: string
 *                 example: "user@email.com"
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       401:
 *         description: No autenticado
 */
router.put("/user", keycloak.protect(), update_user);

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Eliminar usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       401:
 *         description: No autenticado
 */
router.delete("/user", keycloak.protect(), delete_user);


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   apellido:
 *                     type: string
 *                   email:
 *                     type: string
 *                   enabled:
 *                     type: boolean
 *       403:
 *         description: Requiere rol admin
 */
router.get("/users", keycloak.protect(), hasRole("admin"), get_all_users);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario en Keycloak
 *     responses:
 *       200:
 *         description: Información del usuario
 *       403:
 *         description: Requiere rol admin
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/users/:id", keycloak.protect(), hasRole("admin"), get_user_by_id);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar cualquier usuario (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario en Keycloak
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "Nuevo Nombre"
 *               last_name:
 *                 type: string
 *                 example: "Nuevo Apellido"
 *               email:
 *                 type: string
 *                 example: "nuevo@email.com"
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       403:
 *         description: Requiere rol admin
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/users/:id", keycloak.protect(), hasRole("admin"), update_user_by_id);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar cualquier usuario (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario en Keycloak
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       403:
 *         description: Requiere rol admin
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/users/:id", keycloak.protect(), hasRole("admin"), delete_user_by_id);

module.exports = router;