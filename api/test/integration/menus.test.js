const request = require("supertest");
const app = require("../../src/app.js");

// Mock del DAO
jest.mock("../../src/config/database_selector.js", () => ({
  menus_dao: {
    getAll: jest.fn(),
    getByRestaurant: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    restaurantExists: jest.fn(),
  },
}));

const { menus_dao } = require("../../src/config/database_selector.js");

describe("Integration - Menus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET ALL
  it("GET /api/menus retorna todos", async () => {
    menus_dao.getAll.mockResolvedValue([{ id: 1 }]);

    const res = await request(app).get("/api/menus");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1 }]);
  });

  // GET BY RESTAURANT
  it("GET /api/restaurants/:rest_id/menus", async () => {
    menus_dao.getByRestaurant.mockResolvedValue([{ id: 1, rest_id: 1 }]);

    const res = await request(app).get("/api/restaurants/1/menus");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, rest_id: 1 }]);
  });

  // GET BY ID OK
  it("GET /api/menus/:id retorna menu", async () => {
    menus_dao.getById.mockResolvedValue({ id: 1 });

    const res = await request(app).get("/api/menus/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1 });
  });

  // GET BY ID 404
  it("GET /api/menus/:id retorna 404", async () => {
    menus_dao.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/menus/999");

    expect(res.status).toBe(404);
  });

  // CREATE OK
  it("POST /api/menus crea menu", async () => {
    menus_dao.restaurantExists.mockResolvedValue(true);
    menus_dao.create.mockResolvedValue({ id: 1, nombre_menu: "Menu 1" });

    const res = await request(app)
      .post("/api/menus")
      .send({ nombre_menu: "Menu 1", rest_id: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, nombre_menu: "Menu 1" });
  });

  // CREATE RESTAURANT NO EXISTE
  it("POST /api/menus retorna 404 si restaurante no existe", async () => {
    menus_dao.restaurantExists.mockResolvedValue(false);

    const res = await request(app)
      .post("/api/menus")
      .send({ nombre_menu: "Menu", rest_id: 99 });

    expect(res.status).toBe(404);
  });

  // UPDATE OK
  it("PUT /api/menus/:id actualiza menu", async () => {
    menus_dao.update.mockResolvedValue({ id: 1, nombre_menu: "Updated" });

    const res = await request(app)
      .put("/api/menus/1")
      .send({ nombre_menu: "Updated" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, nombre_menu: "Updated" });
  });

  // DELETE OK
  it("DELETE /api/menus/:id elimina menu", async () => {
    menus_dao.delete.mockResolvedValue(true);

    const res = await request(app).delete("/api/menus/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Menú eliminado correctamente",
    });
  });

  // DELETE 404
  it("DELETE /api/menus/:id retorna 404", async () => {
    menus_dao.delete.mockResolvedValue(false);

    const res = await request(app).delete("/api/menus/999");

    expect(res.status).toBe(404);
  });
});