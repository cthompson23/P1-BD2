const request = require("supertest");
const app = require("../../src/app.js");

jest.mock("../../src/config/database_selector.js", () => ({
  restaurants_dao: {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const { restaurants_dao } = require("../../src/config/database_selector.js");

describe("Integration - Restaurants", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CREATE
  it("POST /api/restaurants crea restaurante", async () => {
    restaurants_dao.create.mockResolvedValue({ id: 1, name: "Test" });

    const res = await request(app)
      .post("/api/restaurants")
      .send({ name: "Test" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, name: "Test" });
  });

  // GET ALL
  it("GET /api/restaurants retorna todos", async () => {
    restaurants_dao.getAll.mockResolvedValue([{ id: 1 }]);

    const res = await request(app).get("/api/restaurants");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1 }]);
  });

  // GET BY ID OK
  it("GET /api/restaurants/:id retorna uno", async () => {
    restaurants_dao.getById.mockResolvedValue({ id: 1 });

    const res = await request(app).get("/api/restaurants/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1 });
  });

  // GET BY ID 404
  it("GET /api/restaurants/:id retorna 404", async () => {
    restaurants_dao.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/restaurants/999");

    expect(res.status).toBe(404);
  });

  // UPDATE
  it("PUT /api/restaurants/:id actualiza", async () => {
    restaurants_dao.update.mockResolvedValue({ id: 1, name: "Updated" });

    const res = await request(app)
      .put("/api/restaurants/1")
      .send({ name: "Updated" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, name: "Updated" });
  });

  // DELETE OK
  it("DELETE /api/restaurants/:id elimina", async () => {
    restaurants_dao.delete.mockResolvedValue(true);

    const res = await request(app).delete("/api/restaurants/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Restaurante eliminado exitosamente",
    });
  });

  // DELETE 404
  it("DELETE /api/restaurants/:id retorna 404", async () => {
    restaurants_dao.delete.mockResolvedValue(false);

    const res = await request(app).delete("/api/restaurants/999");

    expect(res.status).toBe(404);
  });
});