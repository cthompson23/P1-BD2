jest.mock("../../src/config/database_selector.js", () => ({
  menus_dao: {
    getAll: jest.fn(),
    getByRestaurant: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    restaurantExists: jest.fn()
  }
}));

const controller = require("../../src/controllers/menus_controller.js");
const { menus_dao } = require("../../src/config/database_selector.js");

const mockRequest = (body = {}, params = {}) => ({ body, params });

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("Controlador de Menús", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ======================
  // GET ALL
  // ======================
  describe("get_all_menus", () => {
    it("debe retornar todos los menús", async () => {
      const req = mockRequest();
      const res = mockResponse();

      const mockMenus = [{ id: 1, nombre_menu: "Menu 1" }];
      menus_dao.getAll.mockResolvedValue(mockMenus);

      await controller.get_all_menus(req, res, mockNext);

      expect(menus_dao.getAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockMenus);
    });
  });

  // ======================
  // GET BY RESTAURANT
  // ======================
  describe("get_menus_by_restaurant", () => {
    it("debe retornar menús por restaurante", async () => {
      const req ={ params: { id: 1 }};
      const res = mockResponse();

      const mockMenus = [{ id: 1, rest_id: 1 }];
      menus_dao.getByRestaurant.mockResolvedValue(mockMenus);

      await controller.get_menus_by_restaurant(req, res, mockNext);

      expect(menus_dao.getByRestaurant).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockMenus);
    });
  });

  // ======================
  // GET BY ID
  // ======================
  describe("get_menu_by_id", () => {
    it("debe retornar un menú si existe", async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();

      const mockMenu = [{ id: 1, rest_id: 1 }];
      menus_dao.getById.mockResolvedValue(mockMenu);

      await controller.get_menu_by_id(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(mockMenu);
    });

    it("debe retornar 404 si no existe", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      menus_dao.getById.mockResolvedValue(null);

      await controller.get_menu_by_id(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Menú no encontrado" });
    });
  });

  // ======================
  // CREATE
  // ======================
  describe("create_menu", () => {
    it("debe crear un menú correctamente", async () => {
      const req = mockRequest({ nombre_menu: "Nuevo", rest_id: 1 });
      const res = mockResponse();

      const created = { id: 1, ...req.body };

      menus_dao.restaurantExists.mockResolvedValue(true);
      menus_dao.create.mockResolvedValue(created);

      await controller.create_menu(req, res, mockNext);

      expect(menus_dao.create).toHaveBeenCalledWith(expect.objectContaining(req.body));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });

    it("debe retornar 404 si restaurante no existe", async () => {
      const req = mockRequest({ nombre_menu: "Menu", rest_id: 1 });
      const res = mockResponse();

      menus_dao.restaurantExists.mockResolvedValue(false);

      await controller.create_menu(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ======================
  // UPDATE
  // ======================
  describe("update_menu", () => {
    it("debe actualizar correctamente", async () => {
      const req = mockRequest({ nombre_menu: "Updated" }, { id: 1 });
      const res = mockResponse();

      const updated = { id: 1, nombre_menu: "Updated" };

      menus_dao.update.mockResolvedValue(updated);

      await controller.update_menu(req, res, mockNext);

      expect(menus_dao.update).toHaveBeenCalledWith(1, req.body);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it("debe retornar 404 si restaurante no existe al actualizar", async () => {
      const req = mockRequest({ rest_id: 1 }, { id: 1 });
      const res = mockResponse();

      menus_dao.restaurantExists.mockResolvedValue(false);

      await controller.update_menu(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ======================
  // DELETE
  // ======================
  describe("delete_menu", () => {
    it("debe eliminar correctamente", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      menus_dao.delete.mockResolvedValue(true);

      await controller.delete_menu(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Menú eliminado correctamente"
      });
    });

    it("maneja error interno", async () => {
      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      menus_dao.delete.mockRejectedValue(new Error("DB error"));

      await controller.delete_menu(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});

describe("Errores", () => {
  it("get_all_menus maneja error", async () => {
    const req = mockRequest();
    const res = mockResponse();

    menus_dao.getAll.mockRejectedValue(new Error("DB error"));

    await controller.get_all_menus(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it("get_menu_by_id maneja error", async () => {
    const req = mockRequest({}, { id: 1 });
    const res = mockResponse();

    menus_dao.getById.mockRejectedValue(new Error("DB error"));

    await controller.get_menu_by_id(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});