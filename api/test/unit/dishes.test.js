jest.mock("../../src/config/database_selector.js", () => ({
  dishes_dao: {
    getAll: jest.fn(),
    getByMenu: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    menuExists: jest.fn()
  }
}));

const controller = require("../../src/controllers/dishes_controller.js");
const { dishes_dao } = require("../../src/config/database_selector.js");

const mockRequest = (body = {}, params = {}) => ({ body, params });

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("Controlador de Platos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ======================
  // GET ALL
  // ======================
  describe("get_all_dishes", () => {
    it("retorna platos", async () => {
      const req = mockRequest();
      const res = mockResponse();

      dishes_dao.getAll.mockResolvedValue([{ id: 1 }]);

      await controller.get_all_dishes(req, res, mockNext);

      expect(res.json).toHaveBeenCalled();
    });

    it("maneja error", async () => {
      const req = mockRequest();
      const res = mockResponse();

      dishes_dao.getAll.mockRejectedValue(new Error("fail"));

      await controller.get_all_dishes(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  // ======================
  // GET BY MENU
  // ======================
  describe("get_dishes_by_menu", () => {
    it("retorna lista", async () => {
      const req = mockRequest({}, { menu_id: 1 });
      const res = mockResponse();

      dishes_dao.getByMenu.mockResolvedValue([{ id: 1 }]);

      await controller.get_dishes_by_menu(req, res, mockNext);

      expect(dishes_dao.getByMenu).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalled();
    });

    it("maneja error", async () => {
      const req = mockRequest({}, { menu_id: 1 });
      const res = mockResponse();

      dishes_dao.getByMenu.mockRejectedValue(new Error("fail"));

      await controller.get_dishes_by_menu(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  // ======================
  // GET BY ID
  // ======================
  describe("get_dish_by_id", () => {
    it("retorna plato", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      dishes_dao.getById.mockResolvedValue({ id: 1 });

      await controller.get_dish_by_id(req, res, mockNext);

      expect(res.json).toHaveBeenCalled();
    });

    it("404 si no existe", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      dishes_dao.getById.mockResolvedValue(null);

      await controller.get_dish_by_id(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("maneja error", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      dishes_dao.getById.mockRejectedValue(new Error("fail"));

      await controller.get_dish_by_id(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  // ======================
  // CREATE
  // ======================
  describe("create_dish", () => {
    it("crea plato", async () => {
      const req = mockRequest({
      nombre_plato: "Pizza",
      precio: 5000,
      menu_id: 1
    });
      const res = mockResponse();

      dishes_dao.menuExists.mockResolvedValue(true);
      dishes_dao.create.mockResolvedValue({ id: 1 });

      await controller.create_dish(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("menu no existe -> 404", async () => {
      const req = mockRequest({
        nombre_plato: "Pizza",
        precio: 5000,
        menu_id: 1
      });
      const res = mockResponse();

      dishes_dao.menuExists.mockResolvedValue(false);

      await controller.create_dish(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("error en create", async () => {
      const req = mockRequest({
        nombre_plato: "Pizza",
        precio: 5000,
        menu_id: 1
      });
      const res = mockResponse();

      dishes_dao.menuExists.mockResolvedValue(true);
      dishes_dao.create.mockRejectedValue(new Error("fail"));

      await controller.create_dish(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  // ======================
  // UPDATE
  // ======================
  describe("update_dish", () => {
    it("actualiza", async () => {
      const req = mockRequest({ name: "x" }, { id: 1 });
      const res = mockResponse();

      dishes_dao.getById.mockResolvedValue({ id: 1 });
      dishes_dao.update.mockResolvedValue({ id: 1 });

      await controller.update_dish(req, res, mockNext);

      expect(res.json).toHaveBeenCalled();
    });

    it("no existe -> 404", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      dishes_dao.getById.mockResolvedValue(null);

      await controller.update_dish(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("error update", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      dishes_dao.getById.mockResolvedValue({ id: 1 });
      dishes_dao.update.mockRejectedValue(new Error("fail"));

      await controller.update_dish(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  // ======================
  // DELETE
  // ======================
  describe("delete_dish", () => {
    it("elimina", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      dishes_dao.delete.mockResolvedValue(true);

      await controller.delete_dish(req, res, mockNext);

      expect(res.json).toHaveBeenCalled();
    });

    it("404 si no existe", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      dishes_dao.delete.mockResolvedValue(false);

      await controller.delete_dish(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("error delete", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      dishes_dao.delete.mockRejectedValue(new Error("fail"));

      await controller.delete_dish(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});