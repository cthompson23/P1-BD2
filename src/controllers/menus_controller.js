const { menus_dao } = require("../config/database_selector.js");
const menu_dto = require("../dto/menus_dto.js");

exports.get_all_menus = async (req, res, next) => {
  try {
    const menus = await menus_dao.getAll();
    res.json(menus);
  } catch (error) {
    next(error);
  }
};

exports.get_menus_by_restaurant = async (req, res, next) => {
  try {
    const { rest_id } = req.params;
    const menus = await menu_dao.getByRestaurant(rest_id);
    res.json(menus);
  } catch (error) {
    next(error);
  }
};

exports.get_menu_by_id = async (req, res, next) => {
  try {
    const { id } = req.params;
    const menu = await menus_dao.getById(id);

    if (!menu) {
      return res.status(404).json({ message: "Menú no encontrado" });
    }

    res.json(menu);
  } catch (error) {
    next(error);
  }
};

exports.create_menu = async (req, res, next) => {
  try {
    const dto = new menu_dto(req.body);

    const exists = await menus_dao.restaurantExists?.(dto.rest_id);

    if (exists === false) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    const menu = await menus_dao.create(dto);

    res.status(201).json(menu);
  } catch (error) {
    next(error);
  }
};

exports.update_menu = async (req, res, next) => {
  try {
    
    const dto = new menu_dto(req.body);

    if (dto.rest_id && typeof menus_dao.restaurantExists === "function") {
      const exists = await menus_dao.restaurantExists(dto.rest_id);

      if (!exists) {
        return res.status(404).json({
          message: "Restaurante no encontrado"
        });
      }
    }
    
    const updated = await menus_dao.update(req.params.id, req.body);

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.delete_menu = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await menus_dao.delete(req.params.id);

      if (!deleted || deleted.rowCount === 0 || deleted === false) {
      return res.status(404).json({ message: "Menú no encontrado" });
    }

    return res.status(200).json({
      message: "Menú eliminado correctamente"
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error al eliminar el menú"
    });
  }
};
