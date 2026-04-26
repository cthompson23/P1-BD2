jest.mock("../../src/config/database_selector.js", () => ({
  reservations_dao: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    cancel: jest.fn(),
    delete: jest.fn()
  }
}));

const controller = require("../../src/controllers/reservations_controller.js");
const { reservations_dao } = require("../../src/config/database_selector.js");

const mockRequest = (body = {}, params = {}, user = "user123") => ({
  body,
  params,
  kauth: {
    grant: {
      access_token: {
        content: { sub: user }
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

describe("Controlador de Reservaciones", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ======================
  // GET ALL
  // ======================
  it("get_all_reservations", async () => {
    const req = mockRequest();
    const res = mockResponse();

    const data = [{ id: 1 }];
    reservations_dao.getAll.mockResolvedValue(data);

    await controller.get_all_reservations(req, res, mockNext);

    expect(reservations_dao.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(data);
  });

  // ======================
  // GET BY ID
  // ======================
  it("get_reservation_by_id retorna reservación", async () => {
    const req = mockRequest({}, { id: 1 });
    const res = mockResponse();

    const data = { id: 1 };
    reservations_dao.getById.mockResolvedValue(data);

    await controller.get_reservation_by_id(req, res, mockNext);

    expect(reservations_dao.getById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(data);
  });

  it("get_reservation_by_id retorna 404", async () => {
    const req = mockRequest({}, { id: 1 });
    const res = mockResponse();

    reservations_dao.getById.mockResolvedValue(null);

    await controller.get_reservation_by_id(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ======================
  // CREATE
  // ======================
  it("create_reservation crea correctamente", async () => {
    const req = mockRequest({
      mesa_id: 1,
      dia_reservacion: "2026-03-26",
      hora_reservacion: "12:00"
    });

    const res = mockResponse();

    const created = { id: 1 };

    reservations_dao.create.mockResolvedValue(created);

    await controller.create_reservation(req, res, mockNext);

    expect(reservations_dao.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("create_reservation retorna 400 si mesa ocupada", async () => {
    const req = mockRequest({ mesa_id: 1 });
    const res = mockResponse();

    reservations_dao.create.mockResolvedValue(null); 

    await controller.create_reservation(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ======================
  // CANCEL
  // ======================
  it("cancel_reservation funciona", async () => {
    reservations_dao.getById.mockResolvedValue({
      id: 1,
      estado: "activa"
    });

    const req = mockRequest({}, { id: 1 });
    const res = mockResponse();

    reservations_dao.cancel.mockResolvedValue(true);

    await controller.cancel_reservation(req, res, mockNext);

    expect(reservations_dao.cancel).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({
      message: "Reservación cancelada exitosamente"
    });
  });

  it("cancel_reservation retorna 400 si ya cancelada", async () => {
    const req = mockRequest({}, { id: 1 });
    const res = mockResponse();

    reservations_dao.getById.mockResolvedValue({
      id: 1,
      estado: "cancelada"
    });

    await controller.cancel_reservation(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ======================
  // DELETE
  // ======================
  it("delete_reservation elimina", async () => {
    const req = mockRequest({}, { id: 1 });
    const res = mockResponse();

    reservations_dao.delete.mockResolvedValue({
      id: 1,
      estado: "cancelada"
    });
    await controller.delete_reservation(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith({
      message: "Reservación eliminada correctamente"
    });
  });

  it("delete_reservation retorna 404", async () => {
    const req = mockRequest({}, { id: 1 });
    const res = mockResponse();

    reservations_dao.delete.mockResolvedValue(false);

    await controller.delete_reservation(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ======================
  // ERRORES
  // ======================
  it("maneja errores", async () => {
    const req = mockRequest();
    const res = mockResponse();

    reservations_dao.getAll.mockRejectedValue(new Error("DB error"));

    await controller.get_all_reservations(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

});