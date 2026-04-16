const { reservationDAO } = require("../config/database_selector.js");
const ReservationDTO = require("../dto/reservation_dto.js");

// Obtener todas
exports.get_all_reservations = async (req, res, next) => {
  try {
    const reservations = await reservationDAO.getAll();
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

// Obtener por ID
exports.get_reservation_by_id = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reservation = await reservationDAO.getById(id);

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
    const dto = new ReservationDTO(req.body);

    const reservation = await reservationDAO.create({
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

    const result = await reservationDAO.cancel(id);

    if (!result) {
      return res.status(404).json({
        message: "Reservación no encontrada"
      });
    }

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

    const result = await reservationDAO.delete(id);

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