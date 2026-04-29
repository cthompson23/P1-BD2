const { reservations_dao } = require("../config/database_selector.js");
const reservation_dto = require("../dto/reservation_dto.js");

// Obtener todas
exports.get_all_reservations = async (req, res, next) => {
  try {
    const reservations = await reservations_dao.getAll();
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

// Obtener por ID
exports.get_reservation_by_id = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reservation = await reservations_dao.getById(id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservación no encontrada"
      });
    }

    res.json(reservation);
  } catch (error) {
    next(error);
  }
};

// Crear reservación
exports.create_reservation = async (req, res, next) => {
  try {
    const user = req.kauth.grant.access_token.content;
    const dto = new reservation_dto(req.body);

    const available = await tables_dao.checkAvailability({
      mesa_id: dto.mesa_id,
      fecha: dto.dia_reservacion,
      hora: dto.hora_reservacion
    });

    if (!available) {
      return res.status(400).json({
        message: "Mesa no disponible"
      });
    }

    const reservation = await reservations_dao.create({
      ...dto,
      usuario_id: user.sub
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Cancelar reservación
exports.cancel_reservation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reservation = await reservations_dao.getById(id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservación no encontrada"
      });
    }

    if (reservation.estado === "cancelada") {
      return res.status(400).json({
        message: "Reservación ya cancelada"
      });
    }

    await reservations_dao.cancel(id);

    res.json({
      message: "Reservación cancelada exitosamente"
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar reservación
exports.delete_reservation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await reservations_dao.delete(id);

    if (!result) {
      return res.status(404).json({
        message: "Reservación no encontrada"
      });
    }

    res.json({
      message: "Reservación eliminada correctamente"
    });
  } catch (error) {
    next(error);
  }
};