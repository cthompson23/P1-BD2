const request = require("supertest");
const app = require("../../src/app.js");

jest.mock("../../src/config/database_selector.js", () => ({
  tables_dao: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

const { tables_dao } = require("../../src/config/database_selector.js");

describe("Tables API", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/tables -> devuelve todas las mesas", async () => {
    tables_dao.getAll.mockResolvedValue([{ id: 1 }]);

    const res = await request(app).get("/api/tables");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1 }]);
  });

  it("GET /api/tables/1 -> devuelve una mesa", async () => {
    tables_dao.getById.mockResolvedValue({ id: 1 });

    const res = await request(app).get("/api/tables/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 1 });
  });

  it("GET /api/tables/999 -> 404", async () => {
    tables_dao.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/tables/999");

    expect(res.statusCode).toBe(404);
  });

  it("POST /api/tables -> crea mesa", async () => {
    tables_dao.create.mockResolvedValue({ id: 1 });

    const res = await request(app)
      .post("/api/tables")
      .send({ rest_id: 1, numero_mesa: 5, capacidad: 4 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("PUT /api/tables/1 -> actualiza", async () => {
    tables_dao.getById.mockResolvedValue({ id: 1 });
    tables_dao.update.mockResolvedValue({ id: 1, capacidad: 6 });

    const res = await request(app)
      .put("/api/tables/1")
      .send({ capacidad: 6 });

    expect(res.statusCode).toBe(200);
  });

  it("DELETE /api/tables/1 -> elimina", async () => {
    tables_dao.delete.mockResolvedValue(true);

    const res = await request(app).delete("/api/tables/1");

    expect(res.statusCode).toBe(200);
  });

});