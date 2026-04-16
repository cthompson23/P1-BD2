const { dishDAO } = require("../config/database_selector.js");
const DishDTO = require("../dto/dishes_dto.js");

// Obtener todos los platos
exports.get_all_dishes = async (req, res, next) => {
  try {
    const dishes = await dishDAO.getAll();
    res.json(dishes);
  } catch (error) {
    next(error);
  }
};

// Obtener platos por menú
exports.get_dishes_by_menu = async (req, res, next) => {
  try {
    const { menu_id } = req.params;

    const dishes = await dishDAO.getByMenu(menu_id);
    res.json(dishes);
  } catch (error) {
    next(error);
  }
};

// Obtener plato por ID
exports.get_dish_by_id = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dish = await dishDAO.getById(id);

    if (!dish) {
      return res.status(404).json({
        message: "Plato no encontrado"
      });
    }

    res.json(dish);
  } catch (error) {
    next(error);
  }
};

// Crear plato
exports.create_dish = async (req, res, next) => {
  try {
    const dto = new DishDTO(req.body);

    // Validación obligatoria
    if (!dto.nombre_plato || dto.precio === undefined || !dto.menu_id) {
      return res.status(400).json({
        message: "nombre_plato, precio y menu_id son requeridos"
      });
    }

    // Validar menú si el DAO lo soporta
    if (typeof dishDAO.menuExists === "function") {
      const exists = await dishDAO.menuExists(dto.menu_id);

      if (!exists) {
        return res.status(404).json({
          message: "Menú no encontrado"
        });
      }
    }

    const newDish = await dishDAO.create(dto);

    res.status(201).json(newDish);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Actualizar plato
exports.update_dish = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await dishDAO.getById(id);

    if (!existing) {
      return res.status(404).json({
        message: "Plato no encontrado"
      });
    }

    const dto = new DishDTO(req.body);

    // Validar menú si viene
    if (dto.menu_id && typeof dishDAO.menuExists === "function") {
      const exists = await dishDAO.menuExists(dto.menu_id);

      if (!exists) {
        return res.status(404).json({
          message: "Menú no encontrado"
        });
      }
    }

    const updated = await dishDAO.update(id, dto);

    res.json(updated);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Eliminar plato
exports.delete_dish = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await dishDAO.delete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Plato no encontrado"
      });
    }

    res.json({
      message: "Plato eliminado exitosamente"
    });
  } catch (error) {
    next(error);
  }
};