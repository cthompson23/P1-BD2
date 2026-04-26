jest.mock("../../src/config/database_selector.js", () => ({
  tables_dao: {
    getAll: jest.fn(),
    getByRestaurant: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    checkAvailability: jest.fn()
  }
}));

const controller = require("../../src/controllers/tables_controller.js");
const { tables_dao } = require("../../src/config/database_selector.js");

const mockRequest = (body = {}, params = {}, query = {}) => ({ body, params, query });

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("Controlador de Mesas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("get_all_tables", () => {
    it("debe obtener todas las mesas", async () => {
      const req = mockRequest();
      const res = mockResponse();

      const mockTables = [{ id: 1, numero_mesa: 5 }];
      tables_dao.getAll.mockResolvedValue(mockTables);

      await controller.get_all_tables(req, res, mockNext);

      expect(tables_dao.getAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockTables);
    });
  });

  it("get_all_tables maneja error global", async () => {
  const req = mockRequest();
  const res = mockResponse();

  tables_dao.getAll.mockRejectedValue(new Error("fail"));

  await controller.get_all_tables(req, res, mockNext);

  expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
});


  describe("get_tables_by_restaurant", () => {
    it("debe obtener mesas por restaurante", async () => {
      const req = mockRequest({}, { rest_id: 1 });
      const res = mockResponse();

      const mockTables = [{ id: 1, rest_id: 1 }];
      tables_dao.getByRestaurant.mockResolvedValue(mockTables);

      await controller.get_tables_by_restaurant(req, res, mockNext);

      expect(tables_dao.getByRestaurant).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockTables);
    });
    
    it("get_tables_by_restaurant maneja error", async () => {
      const req = mockRequest({}, { rest_id: 1 });
      const res = mockResponse();

      tables_dao.getByRestaurant.mockRejectedValue(new Error("DB error"));

      await controller.get_tables_by_restaurant(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("get_table_by_id", () => {
    it("debe obtener una mesa por ID", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      const mockTable = { id: 1 };
      tables_dao.getById.mockResolvedValue(mockTable);

      await controller.get_table_by_id(req, res, mockNext);

      expect(tables_dao.getById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockTable);
    });

    it("debe retornar 404 si no existe", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      tables_dao.getById.mockResolvedValue(null);

      await controller.get_table_by_id(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Mesa no encontrada" });
    });

    it("get_table_by_id maneja error", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      tables_dao.getById.mockRejectedValue(new Error("DB error"));

      await controller.get_table_by_id(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("create_table", () => {
    it("debe crear una mesa", async () => {
      const req = mockRequest({ rest_id: 1, numero_mesa: 10, capacidad: 4 });
      const res = mockResponse();

      const created = { id: 1, ...req.body, disponible: true };

      tables_dao.create.mockResolvedValue(created);

      await controller.create_table(req, res, mockNext);

      expect(tables_dao.create).toHaveBeenCalledWith({...req.body, disponible: true });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });
        
    it("create_table maneja error", async () => {
      const req = mockRequest({
        rest_id: 1,
        numero_mesa: 10,
        capacidad: 4
      });
      const res = mockResponse();

      tables_dao.create.mockRejectedValue(new Error("DB error"));

      await controller.create_table(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

  it("create_table retorna 400 si faltan datos", async () => {
      const req = mockRequest({ rest_id: 1 }); // incompleto
      const res = mockResponse();

      await controller.create_table(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
    });

  it("create_table maneja error en DAO", async () => {
    const req = mockRequest({
      rest_id: 1,
      numero_mesa: 10,
      capacidad: 4
    });

    const res = mockResponse();

    tables_dao.create.mockRejectedValue(new Error("DB error"));

    await controller.create_table(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
  });

  describe("update_table", () => {
    it("debe actualizar una mesa", async () => {
      const req = mockRequest({ capacidad: 6 }, { id: 1 });
      const res = mockResponse();
      tables_dao.getById.mockResolvedValue({ id: 1 });

      const updated = { id: 1, capacidad: 6 };
      tables_dao.update.mockResolvedValue(updated);

      await controller.update_table(req, res, mockNext);

      expect(tables_dao.update).toHaveBeenCalledWith(1, req.body);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it("debe retornar 404 si no existe", async () => {
      const req = mockRequest(
        { capacidad: 4 }, // 👈 body válido
        { id: 1 }
      );
      const res = mockResponse();

      tables_dao.getById.mockResolvedValue(null);

      await controller.update_table(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("update_table maneja error", async () => {
      const req = mockRequest({ capacidad: 4 }, { id: 1 });
      const res = mockResponse();

      tables_dao.getById.mockResolvedValue({ id: 1 });
      tables_dao.update.mockRejectedValue(new Error("DB error"));

      await controller.update_table(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("update_table retorna 400 si body vacío", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      await controller.update_table(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("delete_table", () => {
    it("debe eliminar una mesa", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      tables_dao.delete.mockResolvedValue(true);

      await controller.delete_table(req, res, mockNext);

      expect(tables_dao.delete).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        message: "Mesa eliminada exitosamente"
      });
    });

    it("debe retornar 404 si no existe", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      tables_dao.delete.mockResolvedValue(false);

      await controller.delete_table(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("delete_table maneja error", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      tables_dao.delete.mockRejectedValue(new Error("DB error"));

      await controller.delete_table(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("delete_table maneja error DAO", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      tables_dao.delete.mockRejectedValue(new Error("fail"));

      await controller.delete_table(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("check_availability", () => {
    it("debe obtener mesas disponibles", async () => {
      const req = mockRequest({}, {}, { rest_id: 1 });
      const res = mockResponse();

      const mockTables = [{ id: 1 }];
      tables_dao.checkAvailability.mockResolvedValue(mockTables);

      await controller.check_availability(req, res, mockNext);

      expect(tables_dao.checkAvailability).toHaveBeenCalledWith(req.query);
      expect(res.json).toHaveBeenCalledWith(mockTables);
    });

    it("check_availability maneja error", async () => {
      const req = mockRequest({}, {}, { rest_id: 1 });
      const res = mockResponse();

      tables_dao.checkAvailability.mockRejectedValue(new Error("DB fail"));

      await controller.check_availability(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("sin filtros", async () => {
      const req = mockRequest();
      const res = mockResponse();

      tables_dao.checkAvailability.mockResolvedValue([]);

      await controller.check_availability(req, res, mockNext);

      expect(tables_dao.checkAvailability).toHaveBeenCalledWith({});
    });

    it("con todos los filtros", async () => {
      const req = mockRequest({}, {}, {
        rest_id: 1,
        capacidad: 4,
        fecha: "2026-01-01",
        hora: "18:00"
      });

      const res = mockResponse();

      tables_dao.checkAvailability.mockResolvedValue([]);

      await controller.check_availability(req, res, mockNext);

      expect(tables_dao.checkAvailability).toHaveBeenCalledWith(req.query);
    });
  });
});

describe("Errores", () => {

  it("maneja errores correctamente", async () => {
    const req = mockRequest();
    const res = mockResponse();

    tables_dao.getAll.mockRejectedValue(new Error("DB error"));

    await controller.get_all_tables(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});