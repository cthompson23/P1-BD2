const express = require("express");
const { keycloak } = require("../config/keycloak.js");
const { hasRole } = require("../middleware/auth.js");
const router = express.Router();

const {
    get_all_reservations,
    get_reservation_by_id,
    create_reservation,
    cancel_reservation,
    delete_reservation
} = require("../controllers/reservations_controller.js");

/**
 * @swagger
 * tags:
 *   name: Reservaciones
 *   description: Gestión de reservas de mesas
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Obtener todas las reservaciones
 *     tags: [Reservaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservaciones
 *       401:
 *         description: No autenticado
 */
router.get("/reservations", keycloak.protect(), get_all_reservations);

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Obtener una reservación por ID
 *     tags: [Reservaciones]
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
 *         description: Reservación encontrada
 *       404:
 *         description: Reservación no encontrada
 */
router.get("/reservations/:id", keycloak.protect(), get_reservation_by_id);

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Crear una reservación
 *     tags: [Reservaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mesa_id
 *               - dia_reservacion
 *               - hora_reservacion
 *             properties:
 *               mesa_id:
 *                 type: integer
 *                 example: 1
 *               dia_reservacion:
 *                 type: string
 *                 example: "2026-03-30"
 *               hora_reservacion:
 *                 type: string
 *                 example: "19:00:00"
 *     responses:
 *       201:
 *         description: Reservación creada correctamente
 *       400:
 *         description: Mesa no disponible o conflicto de horario
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Mesa no encontrada
 */
router.post("/reservations", keycloak.protect(), create_reservation);

/**
 * @swagger
 * /reservations/{id}/cancel:
 *   patch:
 *     summary: Cancelar una reservación
 *     tags: [Reservaciones]
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
 *         description: Reservación cancelada exitosamente
 *       400:
 *         description: Reservación ya cancelada
 *       404:
 *         description: Reservación no encontrada
 */
router.patch("/reservations/:id/cancel", keycloak.protect(), cancel_reservation);

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Eliminar una reservación (solo admin)
 *     tags: [Reservaciones]
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
 *         description: Reservación eliminada físicamente
 *       403:
 *         description: Requiere rol admin
 *       404:
 *         description: Reservación no encontrada
 */
router.delete("/reservations/:id", keycloak.protect(), hasRole("admin"), delete_reservation);

module.exports = router;