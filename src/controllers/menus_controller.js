const { menuDAO } = require("../config/database_selector.js");
const MenuDTO = require("../dto/menus_dto.js");

exports.get_all_menus = async (req, res, next) => {
  try {
    const menus = await menuDAO.getAll();
    res.json(menus);
  } catch (error) {
    next(error);
  }
};

exports.get_menus_by_restaurant = async (req, res, next) => {
  try {
    const { rest_id } = req.params;
    const menus = await menuDAO.getByRestaurant(rest_id);
    res.json(menus);
  } catch (error) {
    next(error);
  }
};

exports.get_menu_by_id = async (req, res, next) => {
  try {
    const { id } = req.params;
    const menu = await menuDAO.getById(id);

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
    const dto = new MenuDTO(req.body);

    const exists = await menuDAO.restaurantExists?.(dto.rest_id);

    if (exists === false) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    const menu = await menuDAO.create(dto);

    res.status(201).json(menu);
  } catch (error) {
    next(error);
  }
};

exports.update_menu = async (req, res, next) => {
  try {
    
    const dto = new MenuDTO(req.body);

    if (dto.rest_id && typeof menuDAO.restaurantExists === "function") {
      const exists = await menuDAO.restaurantExists(dto.rest_id);

      if (!exists) {
        return res.status(404).json({
          message: "Restaurante no encontrado"
        });
      }
    }
    
    const updated = await menuDAO.update(req.params.id, req.body);

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.delete_menu = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await menuDAO.delete(req.params.id);

    return res.status(200).json({
      message: "Menú eliminado correctamente"
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error al eliminar el menú"
    });
  }
};