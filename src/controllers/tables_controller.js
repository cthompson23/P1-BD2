const { tables_dao } = require("../config/database_selector.js");
const tables_dto = require("../dto/tables_dto.js");

// Obtener todas las mesas
exports.get_all_tables = async (req, res, next) => {
  try {
    const tables = await tables_dao.getAll();
    res.json(tables);
  } catch (error) {
    next(error);
  }
};

// Obtener mesas por restaurante
exports.get_tables_by_restaurant = async (req, res, next) => {
  try {
    const { rest_id } = req.params;
    const tables = await tables_dao.getByRestaurant(rest_id);
    res.json(tables);
  } catch (error) {
    next(error);
  }
};

// Obtener mesa por ID
exports.get_table_by_id = async (req, res, next) => {
  try {
    const { id } = req.params;

    const table = await tables_dao.getById(id);

    if (!table) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    res.json(table);
  } catch (error) {
    next(error);
  }
};

// Crear mesa
exports.create_table = async (req, res, next) => {
  try {
    const dto = new tables_dto(req.body);

    if (!dto.rest_id || dto.numero_mesa === undefined || dto.capacidad === undefined) {
      return res.status(400).json({
        message: "rest_id, numero_mesa y capacidad son requeridos"
      });
    }

    if (typeof tables_dao.restaurantExists === "function") {
      const exists = await tables_dao.restaurantExists(dto.rest_id);

      if (!exists) {
        return res.status(404).json({
          message: "Restaurante no encontrado"
        });
      }
    }

    const newTable = await tables_dao.create({
      ...dto,
      disponible: dto.disponible !== undefined ? dto.disponible : true
    });

    res.status(201).json(newTable);
  } catch (error) {
    next(error);
  }
};

// Actualizar mesa
exports.update_table = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Body vacío" });
    }

    const { id } = req.params;

    const existing = await tables_dao.getById(id);

    if (!existing) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    const dto = new tables_dto(req.body);

    if (dto.rest_id && typeof tables_dao.restaurantExists === "function") {
      const exists = await tables_dao.restaurantExists(dto.rest_id);

      if (!exists) {
        return res.status(404).json({
          message: "Restaurante no encontrado"
        });
      }
    }

    const updated = await tables_dao.update(id, dto);

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// Eliminar mesa
exports.delete_table = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await tables_dao.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    res.json({ message: "Mesa eliminada exitosamente" });
  } catch (error) {
    next(error);
  }
};

// Verificar disponibilidad
exports.check_availability = async (req, res, next) => {
  try {
    const { rest_id, fecha, hora, capacidad } = req.query;

    const available = await tables_dao.checkAvailability({
      rest_id,
      fecha,
      hora,
      capacidad
    });

    res.json(available);
  } catch (error) {
    next(error);
  }
};
