jest.mock("../../src/config/database_selector.js", () => ({
  orders_dao: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn()
  }
}));

const controller = require("../../src/controllers/orders_controller.js");
const { orders_dao } = require("../../src/config/database_selector.js");

// Helpers
const mockRequestWithAuth = (body = {}, params = {}, user = null) => ({
  body,
  params,
  kauth: {
    grant: {
      access_token: {
        content: user || { sub: "user-123", realm_access: { roles: ["admin"] } }
      }
    }
  }
});

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("Controlador de Pedidos", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ======================
  // GET ALL
  // ======================
  it("get_all_orders retorna pedidos", async () => {
    const req = mockRequestWithAuth();
    const res = mockResponse();

    const data = [{ id: 1 }];
    orders_dao.getAll.mockResolvedValue(data);

    await controller.get_all_orders(req, res, mockNext);

    expect(orders_dao.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(data);
  });

  // ======================
  // GET BY ID
  // ======================
  it("get_order_by_id retorna pedido", async () => {
    const req = mockRequestWithAuth({}, { id: 1 });
    const res = mockResponse();

    const order = { id: 1 };
    orders_dao.getById.mockResolvedValue(order);

    await controller.get_order_by_id(req, res, mockNext);

    expect(orders_dao.getById).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        userId: "user-123",
        isAdmin: true
      })
    );
    expect(res.json).toHaveBeenCalledWith(order);
  });

  it("get_order_by_id retorna 404 si no existe", async () => {
    const req = mockRequestWithAuth({}, { id: 1 });
    const res = mockResponse();

    orders_dao.getById.mockResolvedValue(null);

    await controller.get_order_by_id(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ======================
  // CREATE
  // ======================
  it("create_order crea correctamente", async () => {
    const req = mockRequestWithAuth({
      reservacion_id: 1,
      tipo_pedido: "mesa",
      items: [{ plato_id: 1, cantidad: 2 }]
    });

    const res = mockResponse();

    orders_dao.create.mockResolvedValue({
      id: 1,
      message: "Pedido creado exitosamente"
    });

    await controller.create_order(req, res, mockNext);

    expect(orders_dao.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("create_order retorna 400 si no hay items", async () => {
    const req = mockRequestWithAuth({
      reservacion_id: 1,
      tipo_pedido: "mesa",
      items: []
    });

    const res = mockResponse();

    await controller.create_order(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ======================
  // UPDATE STATUS
  // ======================
  it("update_order_status actualiza", async () => {
    const req = mockRequestWithAuth({ estado: "confirmado" }, { id: 1 });
    const res = mockResponse();

    const updated = { id: 1, estado: "confirmado" };

    orders_dao.updateStatus.mockResolvedValue(updated);

    await controller.update_order_status(req, res, mockNext);

    expect(orders_dao.updateStatus).toHaveBeenCalledWith(1, "confirmado");
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it("update_order_status retorna 400 si estado inválido", async () => {
    const req = mockRequestWithAuth({ estado: "invalido" }, { id: 1 });
    const res = mockResponse();

    await controller.update_order_status(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("update_order_status retorna 404 si no existe", async () => {
    const req = mockRequestWithAuth({ estado: "confirmado" }, { id: 1 });
    const res = mockResponse();

    orders_dao.updateStatus.mockResolvedValue(null);

    await controller.update_order_status(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ======================
  // DELETE
  // ======================
  it("delete_order elimina", async () => {
    const req = mockRequestWithAuth({}, { id: 1 });
    const res = mockResponse();

    orders_dao.delete.mockResolvedValue(true);

    await controller.delete_order(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith({
      message: "Pedido eliminado exitosamente"
    });
  });

  it("delete_order retorna 404 si no existe", async () => {
    const req = mockRequestWithAuth({}, { id: 1 });
    const res = mockResponse();

    orders_dao.delete.mockResolvedValue(false);

    await controller.delete_order(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ======================
  // ERRORES
  // ======================
  it("maneja errores", async () => {
    const req = mockRequestWithAuth();
    const res = mockResponse();

    orders_dao.getAll.mockRejectedValue(new Error("DB error"));

    await controller.get_all_orders(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

});