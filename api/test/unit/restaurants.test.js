jest.mock("../../src/config/database_selector.js", () => ({
  restaurants_dao: {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

const controller = require("../../src/controllers/restaurants_controller.js");
const { restaurants_dao } = require("../../src/config/database_selector.js");

// mocks básicos
const mockRequest = (body = {}, params = {}) => ({ body, params });

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("Controlador de Restaurantes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CREATE
  describe("create_restaurant", () => {
    it("debe crear un restaurante", async () => {
      const req = mockRequest({
        nombre_rest: "Test",
        ubicacion: "CR",
        correo_rest: "test@test.com",
        telefono_rest: "1234"
      });
      const res = mockResponse();

      restaurants_dao.create.mockResolvedValue(req.body);

      await controller.create_restaurant(req, res, mockNext);

      expect(restaurants_dao.create).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });

  // GET ALL
  describe("get_all_restaurants", () => {
    it("debe obtener todos los restaurantes", async () => {
      const req = mockRequest();
      const res = mockResponse();

      const mockData = [{ id: 1, nombre_rest: "Test" }];
      restaurants_dao.getAll.mockResolvedValue(mockData);

      await controller.get_all_restaurants(req, res, mockNext);

      expect(restaurants_dao.getAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  });

  // GET BY ID
  describe("get_restaurant_by_id", () => {
    it("debe obtener un restaurante por ID", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      const mockRestaurant = { id: 1, nombre_rest: "Test" };
      restaurants_dao.getById.mockResolvedValue(mockRestaurant);

      await controller.get_restaurant_by_id(req, res, mockNext);

      expect(restaurants_dao.getById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockRestaurant);
    });

    it("debe retornar 404 si no existe", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      restaurants_dao.getById.mockResolvedValue(null);

      await controller.get_restaurant_by_id(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Restaurante no encontrado"
      });
    });
  });

  // UPDATE
  describe("update_restaurant", () => {
    it("debe actualizar un restaurante", async () => {
      const req = mockRequest({ nombre_rest: "Updated" }, { id: 1 });
      const res = mockResponse();

      const updated = { id: 1, ...req.body };
      restaurants_dao.update.mockResolvedValue(updated);

      await controller.update_restaurant(req, res, mockNext);

      expect(restaurants_dao.update).toHaveBeenCalledWith(1, req.body);
      expect(res.json).toHaveBeenCalledWith(updated);
    });
  });

  // DELETE
  describe("delete_restaurant", () => {
    it("debe eliminar un restaurante", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      restaurants_dao.delete.mockResolvedValue(true);

      await controller.delete_restaurant(req, res, mockNext);

      expect(restaurants_dao.delete).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        message: "Restaurante eliminado exitosamente"
      });
    });

    it("debe retornar 404 si no existe", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      restaurants_dao.delete.mockResolvedValue(false);

      await controller.delete_restaurant(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Restaurante no encontrado"
      });
    });
  });
});


// ERRORES
describe("Errores", () => {

  it("create_restaurant debe manejar error", async () => {
    const req = mockRequest({ nombre_rest: "Test" });
    const res = mockResponse();

    restaurants_dao.create.mockRejectedValue(new Error("DB error"));

    await controller.create_restaurant(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it("get_all_restaurants debe manejar error", async () => {
    const req = mockRequest();
    const res = mockResponse();

    restaurants_dao.getAll.mockRejectedValue(new Error("DB error"));

    await controller.get_all_restaurants(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it("get_restaurant_by_id debe manejar error", async () => {
    const req = mockRequest({}, { id: 1 });
    const res = mockResponse();

    restaurants_dao.getById.mockRejectedValue(new Error("DB error"));

    await controller.get_restaurant_by_id(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it("update_restaurant debe manejar error", async () => {
    const req = mockRequest({}, { id: 1 });
    const res = mockResponse();

    restaurants_dao.update.mockRejectedValue(new Error("DB error"));

    await controller.update_restaurant(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it("delete_restaurant debe manejar error", async () => {
    const req = mockRequest({}, { id: 1 });
    const res = mockResponse();

    restaurants_dao.delete.mockRejectedValue(new Error("DB error"));

    await controller.delete_restaurant(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

});