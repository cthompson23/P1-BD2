const { orderDAO } = require("../config/database_selector.js");
const OrderDTO = require("../dto/orders_dto.js");

// Obtener todos
exports.get_all_orders = async (req, res, next) => {
  try {
    const user = req.kauth.grant.access_token.content;
    const roles = user.realm_access.roles || [];
    const isAdmin = roles.includes("admin");

    const orders = await orderDAO.getAll({
      userId: user.sub,
      isAdmin
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Obtener por ID
exports.get_order_by_id = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = req.kauth.grant.access_token.content;
    const roles = user.realm_access?.roles || [];
    const isAdmin = roles.includes("admin");

    const order = await orderDAO.getById(id, {
      userId: user.sub,
      isAdmin
    });

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Crear pedido
exports.create_order = async (req, res, next) => {
  try {
    const user = req.kauth.grant.access_token.content;

    const dto = new OrderDTO(req.body);

    const result = await orderDAO.create({
      usuario_id: user.sub,
      ...dto
    });

    res.status(201).json(result);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar estado
exports.update_order_status = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const updated = await orderDAO.updateStatus(id, estado);

    if (!updated) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json(updated);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar pedido
exports.delete_order = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await orderDAO.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json({ message: "Pedido eliminado exitosamente" });

  } catch (error) {
    next(error);
  }
};