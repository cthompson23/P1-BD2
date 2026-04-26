const request = require("supertest");
const app = require("../../src/app.js");

jest.mock("../../src/config/database_selector.js", () => ({
  orders_dao: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn(),
  },
}));

const { orders_dao } = require("../../src/config/database_selector.js");

describe("Integración - Orders (sin auth)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET ALL
  it("GET /api/orders -> debe retornar todos los pedidos", async () => {
    const mockData = [{ id: 1 }, { id: 2 }];

    orders_dao.getAll.mockResolvedValue(mockData);

    const res = await request(app).get("/api/orders");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  // ======================
  // GET BY ID
  // ======================
  it("GET /api/orders/:id -> debe retornar un pedido", async () => {
    const mockOrder = { id: 1 };

    orders_dao.getById.mockResolvedValue(mockOrder);

    const res = await request(app).get("/api/orders/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockOrder);
  });

  it("GET /api/orders/:id -> 404 si no existe", async () => {
    orders_dao.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/orders/999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  // ======================
  // CREATE
  // ======================
  it("POST /api/orders -> crea pedido", async () => {
    const payload = {
      reservacion_id: 1,
      tipo_pedido: "mesa",
      items: [{ plato_id: 1, cantidad: 2 }],
    };

    const mockCreated = { id: 1, ...payload };

    orders_dao.create.mockResolvedValue(mockCreated);

    const res = await request(app).post("/api/orders").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockCreated);
  });

  it("POST /api/orders -> 400 si no hay items", async () => {
    const payload = {
      reservacion_id: 1,
      tipo_pedido: "mesa",
      items: [],
    };

    const res = await request(app).post("/api/orders").send(payload);

    expect(res.status).toBe(400);
  });

  // ======================
  // UPDATE STATUS
  // ======================
  it("PATCH /api/orders/:id/status -> actualiza estado", async () => {
    const updated = { id: 1, estado: "confirmado" };

    orders_dao.updateStatus.mockResolvedValue(updated);

    const res = await request(app)
      .patch("/api/orders/1/status")
      .send({ estado: "confirmado" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
  });

  it("PATCH /api/orders/:id/status -> 400 estado inválido", async () => {
    const res = await request(app)
      .patch("/api/orders/1/status")
      .send({ estado: "invalido" });

    expect(res.status).toBe(400);
  });

  // ======================
  // DELETE
  // ======================
  it("DELETE /api/orders/:id -> elimina pedido", async () => {
    orders_dao.delete.mockResolvedValue(true);

    const res = await request(app).delete("/api/orders/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("DELETE /api/orders/:id -> 404 si no existe", async () => {
    orders_dao.delete.mockResolvedValue(false);

    const res = await request(app).delete("/api/orders/999");

    expect(res.status).toBe(404);
  });
});