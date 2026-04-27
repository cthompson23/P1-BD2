const request = require("supertest");
const app = require("../../src/app.js");

jest.mock("../../src/config/database_selector.js", () => ({
  reservations_dao: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    cancel: jest.fn(),
    delete: jest.fn(),
  },
  tables_dao: {
    checkAvailability: jest.fn(),
  }
}));

const {
  reservations_dao,
  tables_dao
} = require("../../src/config/database_selector.js");

describe("Integration - Reservations (sin auth)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ======================
  // GET ALL
  // ======================
  it("GET /api/reservations", async () => {
    const data = [{ id: 1 }];

    reservations_dao.getAll.mockResolvedValue(data);

    const res = await request(app).get("/api/reservations");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
  });

  // ======================
  // GET BY ID
  // ======================
  it("GET /api/reservations/:id -> 200", async () => {
    reservations_dao.getById.mockResolvedValue({ id: 1 });

    const res = await request(app).get("/api/reservations/1");

    expect(res.status).toBe(200);
  });

  it("GET /api/reservations/:id -> 404", async () => {
    reservations_dao.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/reservations/999");

    expect(res.status).toBe(404);
  });

  // ======================
  // CREATE
  // ======================
  it("POST /api/reservations -> 201", async () => {
    const payload = {
      mesa_id: 1,
      dia_reservacion: "2026-04-26",
      hora_reservacion: "12:00"
    };

    tables_dao.checkAvailability.mockResolvedValue(true);
    reservations_dao.create.mockResolvedValue({ id: 1 });

    const res = await request(app)
      .post("/api/reservations")
      .send(payload);

    expect(res.status).toBe(201);
  });

  it("POST /api/reservations -> 400 si no disponible", async () => {
    const payload = {
      mesa_id: 1,
      dia_reservacion: "2026-04-26",
      hora_reservacion: "12:00"
    };

    tables_dao.checkAvailability.mockResolvedValue(false);

    const res = await request(app)
      .post("/api/reservations")
      .send(payload);

    expect(res.status).toBe(400);
  });

  // ======================
  // CANCEL
  // ======================
  it("PATCH cancel -> 200", async () => {
    reservations_dao.getById.mockResolvedValue({
      id: 1,
      estado: "activa"
    });

    reservations_dao.cancel.mockResolvedValue(true);

    const res = await request(app)
      .patch("/api/reservations/1/cancel");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Reservación cancelada exitosamente"
    });
  });

  it("PATCH cancel -> 400 si ya cancelada", async () => {
    reservations_dao.getById.mockResolvedValue({
      id: 1,
      estado: "cancelada"
    });

    const res = await request(app)
      .patch("/api/reservations/1/cancel");

    expect(res.status).toBe(400);
  });

  it("PATCH cancel -> 404", async () => {
    reservations_dao.getById.mockResolvedValue(null);

    const res = await request(app)
      .patch("/api/reservations/999/cancel");

    expect(res.status).toBe(404);
  });

  // ======================
  // DELETE
  // ======================
  it("DELETE -> 200", async () => {
    reservations_dao.delete.mockResolvedValue(true);

    const res = await request(app)
      .delete("/api/reservations/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Reservación eliminada correctamente"
    });
  });

  it("DELETE -> 404", async () => {
    reservations_dao.delete.mockResolvedValue(false);

    const res = await request(app)
      .delete("/api/reservations/999");

    expect(res.status).toBe(404);
  });
});