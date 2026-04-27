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
  },
}));

app.use((req, res, next) => {
  req.kauth = {
    grant: {
      access_token: {
        content: { sub: "test-user" }
      }
    }
  };
  next();
});

const {
  reservations_dao,
  tables_dao,
} = require("../../src/config/database_selector.js");

describe("Integration - Reservations (sin auth)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ======================
  // GET ALL
  // ======================
  it("GET /api/reservations -> todas las reservaciones", async () => {
    const mockData = [{ id: 1 }, { id: 2 }];

    reservations_dao.getAll.mockResolvedValue(mockData);

    const res = await request(app).get("/api/reservations");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  // ======================
  // GET BY ID
  // ======================
  it("GET /api/reservations/:id -> devuelve una reservación", async () => {
    const mockResv = { id: 1 };

    reservations_dao.getById.mockResolvedValue(mockResv);

    const res = await request(app).get("/api/reservations/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResv);
  });

  it("GET /api/reservations/:id -> 404 si no existe", async () => {
    reservations_dao.getById.mockResolvedValue(null);

    const res = await request(app).get("/api/reservations/999");

    expect(res.status).toBe(404);
  });

  // ======================
  // CREATE
  // ======================
  it("POST /api/reservations -> crea reservación", async () => {
    const payload = {
      mesa_id: 1,
      dia_reservacion: "2026-04-26",
      hora_reservacion: "12:00",
    };

    tables_dao.checkAvailability.mockResolvedValue(true);

    const mockCreated = { id: 1, ...payload };

    reservations_dao.create.mockResolvedValue(mockCreated);

    const res = await request(app)
      .post("/api/reservations")
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockCreated);
  });

  it("POST /api/reservations -> 400 si mesa no disponible", async () => {
    const payload = {
      mesa_id: 1,
      dia_reservacion: "2026-04-26",
      hora_reservacion: "12:00",
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
  it("PATCH /api/reservations/:id/cancel -> cancela reservación", async () => {
    reservations_dao.cancel.mockResolvedValue({ id: 1, estado: "activa" });

    reservations_dao.cancel.mockResolvedValue(true);

    const res = await request(app)
      .patch("/api/reservations/1/cancel");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Reservación cancelada exitosamente" });
  });

  it("PATCH /api/reservations/:id/cancel -> 404 si no existe", async () => {
    reservations_dao.cancel.mockResolvedValue(false);

    const res = await request(app)
      .patch("/api/reservations/999/cancel");

    expect(res.status).toBe(404);
  });

  // ======================
  // DELETE
  // ======================
  it("DELETE /api/reservations/:id -> elimina reservación", async () => {
    reservations_dao.delete.mockResolvedValue(true);

    const res = await request(app)
      .delete("/api/reservations/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Reservación eliminada correctamente"
    });
  });

  it("DELETE /api/reservations/:id -> 404 si no existe", async () => {
    reservations_dao.delete.mockResolvedValue(false);

    const res = await request(app)
      .delete("/api/reservations/999");

    expect(res.status).toBe(404);
  });
});