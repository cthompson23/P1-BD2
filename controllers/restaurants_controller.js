const { restaurants_dao  } = require("../config/database_selector.js");
const restaurant_dto = require("../dto/restaurant_dto.js");


exports.create_restaurant = async (req, res, next) => {
  try {
    const dto = new restaurant_dto(req.body);
    const restaurant = await restaurants_dao.create(dto);

    res.status(201).json(restaurant);
  } catch (error) {
    next(error);
  }
};

exports.get_all_restaurants = async (req, res, next) => {
  try {
    const restaurants = await restaurants_dao.getAll();
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
};

exports.get_restaurant_by_id = async (req, res, next) => {
  try {
    const restaurant = await restaurants_dao.getById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    res.json(restaurant);
  } catch (error) {
    next(error);
  }
};

exports.update_restaurant = async (req, res, next) => {
  try {
    const updated = await restaurants_dao.update(req.params.id, req.body);

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.delete_restaurant = async (req, res, next) => {
  try {
    const deleted = await restaurants_dao.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    res.json({ message: "Restaurante eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
};
