const express = require("express");
const { keycloak } = require("../config/keycloak.js");
const { hasRole } = require("../middleware/auth.js");
const router = express.Router();

const {
    create_restaurant,
    get_all_restaurants,
    get_restaurant_by_id,
    update_restaurant,
    delete_restaurant
} = require("../controllers/restaurants_controller.js");

/**
 * @swagger
 * tags:
 *   name: Restaurantes
 *   description: Gestión de restaurantes
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar estado de la API
 *     tags: [Restaurantes]
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 */
router.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "API funcionando correctamente",
        timestamp: new Date().toISOString()
    });
});

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Obtener todos los restaurantes
 *     tags: [Restaurantes]
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 */
router.get("/restaurants", get_all_restaurants);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Obtener un restaurante por ID
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurante encontrado
 *       404:
 *         description: Restaurante no encontrado
 */
router.get("/restaurants/:id", get_restaurant_by_id);

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Crear un restaurante (solo admin)
 *     tags: [Restaurantes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_rest
 *               - ubicacion
 *             properties:
 *               nombre_rest:
 *                 type: string
 *                 example: "Restaurante El Buen Sabor"
 *               ubicacion:
 *                 type: string
 *                 example: "Calle Falsa 123, Ciudad"
 *               correo_rest:
 *                 type: string
 *                 example: "info@restaurante.com"
 *               telefono_rest:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       201:
 *         description: Restaurante creado correctamente
 *       403:
 *         description: Requiere rol admin
 */
router.post("/restaurants", keycloak.protect(), hasRole("admin"), create_restaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     summary: Actualizar un restaurante (solo admin)
 *     tags: [Restaurantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_rest:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               correo_rest:
 *                 type: string
 *               telefono_rest:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurante actualizado
 *       403:
 *         description: Requiere rol admin
 *       404:
 *         description: Restaurante no encontrado
 */
router.put("/restaurants/:id", keycloak.protect(), hasRole("admin"), update_restaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Eliminar un restaurante (solo admin)
 *     tags: [Restaurantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurante eliminado
 *       403:
 *         description: Requiere rol admin
 *       404:
 *         description: Restaurante no encontrado
 */
router.delete("/restaurants/:id", keycloak.protect(), hasRole("admin"), delete_restaurant);

module.exports = router;