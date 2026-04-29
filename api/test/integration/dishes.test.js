const request = require("supertest");
const app = require("../../src/app.js");

jest.mock("../../src/config/database_selector.js", () => ({
  dishes_dao: {
    getAll: jest.fn(),
    getByMenu: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    menuExists: jest.fn(),
  },
}));

const { dishes_dao } = require("../../src/config/database_selector.js");

describe("Integration - Dishes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET ALL
  it("GET /api/dishes retorna todos", async () => {
    dishes_dao.getAll.mockResolvedValue([{ id: 1, nombre_plato: "Pizza" }]);

    const res = await request(app).get("/api/dishes");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, nombre_plato: "Pizza" }]);
  });

  // GET BY MENU
  it("GET /api/menus/:menu_id/dishes", async () => {
    dishes_dao.getByMenu.mockResolvedValue([
      { id: 1, menu_id: 1, nombre_plato: "Pizza" },
    ]);

    const res = await request(app).get("/api/menus/1/dishes");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 1, menu_id: 1, nombre_plato: "Pizza" },
    ]);
  });

  // GET BY ID OK
  it("GET /api/dishes/:id retorna plato", async () => {
    dishes_dao.getById.mockResolvedValue({
      id: 1,
      nombre_plato: "Pizza",
    });

    const res = await request(app).get("/api/dishes/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      nombre_plato: "Pizza",
    });
  });

  // GET BY ID 404
  it("GET /api/dishes/:id retorna 404", async () => {
    dishes_dao.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/dishes/999");

    expect(res.status).toBe(404);
  });

  // CREATE OK
  it("POST /api/dishes crea plato", async () => {
    dishes_dao.menuExists.mockResolvedValue(true);
    dishes_dao.create.mockResolvedValue({
      id: 1,
      nombre_plato: "Pizza",
      precio: 5000,
    });

    const res = await request(app)
      .post("/api/dishes")
      .send({
        nombre_plato: "Pizza",
        precio: 5000,
        menu_id: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 1,
      nombre_plato: "Pizza",
      precio: 5000,
    });
  });

  // CREATE 404 MENU NO EXISTE
  it("POST /api/dishes retorna 404 si menú no existe", async () => {
    dishes_dao.menuExists.mockResolvedValue(false);

    const res = await request(app)
      .post("/api/dishes")
      .send({
        nombre_plato: "Pizza",
        precio: 5000,
        menu_id: 99,
      });

    expect(res.status).toBe(404);
  });

  // UPDATE OK
  it("PUT /api/dishes/:id actualiza plato", async () => {
    dishes_dao.getById.mockResolvedValue({ id: 1 });
    dishes_dao.update.mockResolvedValue({
      id: 1,
      nombre_plato: "Pizza Updated",
    });

    const res = await request(app)
      .put("/api/dishes/1")
      .send({ nombre_plato: "Pizza Updated" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      nombre_plato: "Pizza Updated",
    });
  });

  // UPDATE 404
  it("PUT /api/dishes/:id retorna 404", async () => {
    dishes_dao.getById.mockResolvedValue(null);

    const res = await request(app)
      .put("/api/dishes/999")
      .send({ nombre_plato: "X" });

    expect(res.status).toBe(404);
  });

  // DELETE OK
  it("DELETE /api/dishes/:id elimina plato", async () => {
    dishes_dao.delete.mockResolvedValue(true);

    const res = await request(app).delete("/api/dishes/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Plato eliminado exitosamente",
    });
  });

  // DELETE 404
  it("DELETE /api/dishes/:id retorna 404", async () => {
    dishes_dao.delete.mockResolvedValue(false);

    const res = await request(app).delete("/api/dishes/999");

    expect(res.status).toBe(404);
  });
});