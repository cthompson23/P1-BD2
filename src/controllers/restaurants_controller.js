const { restaurantDAO  } = require("../config/database_selector.js");
const RestaurantDTO = require("../dto/restaurant_dto.js");


exports.create_restaurant = async (req, res, next) => {
  try {
    const dto = new RestaurantDTO(req.body);
    const restaurant = await restaurantDAO.create(dto);

    res.status(201).json(restaurant);
  } catch (error) {
    next(error);
  }
};

exports.get_all_restaurants = async (req, res, next) => {
  try {
    const restaurants = await restaurantDAO.getAll();
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
};

exports.get_restaurant_by_id = async (req, res, next) => {
  try {
    const restaurant = await restaurantDAO.getById(req.params.id);

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
    const updated = await restaurantDAO.update(req.params.id, req.body);

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.delete_restaurant = async (req, res, next) => {
  try {
    const deleted = await restaurantDAO.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    res.json({ message: "Restaurante eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
};
