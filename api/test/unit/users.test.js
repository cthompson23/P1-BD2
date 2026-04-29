jest.mock("../../src/config/db.js", () => ({
  query: jest.fn(),
}));
jest.mock("axios");

const axios = require("axios");
const pool = require("../../src/config/db.js");
const controller = require("../../src/controllers/users_controller.js");

const mockRequestWithUser = (body = {}, user = null) => ({
  body,
  kauth: {
    grant: {
      access_token: {
        content: user || { 
          sub: "user-123", 
          preferred_username: "testuser", 
          given_name: "Test", 
          family_name: "User", 
          name: "Test User", 
          email: "test@test.com" }
      }
    }
  }
});

const mockRequestWithoutAuth = (body = {}) => ({
  body,
  kauth: {
    grant: {
      access_token: {
        content: null,
      },
    },
  },
});

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe("Controlador de Usuarios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Obtener usuario autenticado
  describe("get_user", () => {
    it("debe devolver los datos del usuario", async () => {
      const req = mockRequestWithUser();
      const res = mockResponse();
      await controller.get_user(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: "user-123", username: "testuser" }));
    });

    it("debe devolver error 401 si no hay usuario", async () => {
      const req = mockRequestWithoutAuth();
      const res = mockResponse();
      await controller.get_user(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("debe manejar error interno", async () => {
      const req = {}; // rompe estructura
      const res = mockResponse();
      await controller.get_user(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
    
    it("get_user maneja error inesperado", async () => {
      const req = {
        kauth: {
          grant: {
            access_token: null // rompe acceso
          }
        }
      };

      const res = mockResponse();

      await controller.get_user(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("get_user_by_id", () => {
    it("retorna usuario", async () => {
      const req = { params: { id: "1" } };
      const res = mockResponse();

      axios.post.mockResolvedValueOnce({ data: { access_token: "token" } });

      axios.get.mockResolvedValueOnce({
        data: {
          id: "1",
          username: "test",
          firstName: "Test",
          lastName: "User",
          email: "test@test.com",
          enabled: true
        }
      });

      await controller.get_user_by_id(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it("retorna 404 si no existe", async () => {
      const req = { params: { id: "1" } };
      const res = mockResponse();

      axios.post.mockResolvedValueOnce({ data: { access_token: "token" } });

      axios.get.mockRejectedValue({
        response: { status: 404 }
      });

      await controller.get_user_by_id(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
  describe("get_all_users", () => {
    it("retorna usuarios", async () => {
      const req = {};
      const res = mockResponse();

      axios.post.mockResolvedValueOnce({ data: { access_token: "token" } });

      axios.get.mockResolvedValueOnce({
        data: [
          {
            id: "1",
            username: "test",
            firstName: "Test",
            lastName: "User",
            email: "test@test.com",
            enabled: true
          }
        ]
      });

      await controller.get_all_users(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it("maneja error", async () => {
      const req = {};
      const res = mockResponse();

      axios.post.mockRejectedValue(new Error("fail"));

      await controller.get_all_users(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // Actualizar usuario
  describe("update_user", () => {
    it("debe actualizar los datos del usuario", async () => {
      const req = mockRequestWithUser({ first_name: "Nuevo", last_name: "Apellido", email: "nuevo@test.com" });
      const res = mockResponse();
      axios.post.mockResolvedValueOnce({ data: { access_token: "admin-token" } });
      axios.put.mockResolvedValueOnce({});
      await controller.update_user(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: "Usuario actualizado correctamente" });
    });

    it("debe devolver error 401 si no hay usuario", async () => {
      const req = { kauth: null };
      const res = mockResponse();
      await controller.update_user(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("debe manejar error", async () => {
      const req = mockRequestWithUser();
      const res = mockResponse();
      axios.post.mockRejectedValue({
        response: { data: "error" },
      });

      await controller.update_user(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("update_user falla en axios.put", async () => {
      const req = mockRequestWithUser({
        first_name: "Test",
        last_name: "User",
        email: "test@test.com"
      });

      const res = mockResponse();

      axios.post.mockResolvedValueOnce({ data: { access_token: "token" } });
      axios.put.mockRejectedValueOnce(new Error("fail"));

      await controller.update_user(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("update_user_by_id", () => {
    it("actualiza usuario", async () => {
      const req = {
        params: { id: "1" },
        body: { first_name: "A", last_name: "B", email: "a@test.com" }
      };
      const res = mockResponse();

      axios.post.mockResolvedValueOnce({ data: { access_token: "token" } });
      axios.put.mockResolvedValueOnce({});

      await controller.update_user_by_id(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });
  // Eliminar usuario
  describe("delete_user", () => {
    it("debe eliminar el usuario", async () => {
      const req = mockRequestWithUser();
      const res = mockResponse();
      axios.post.mockResolvedValueOnce({ data: { access_token: "admin-token" } });
      axios.delete.mockResolvedValueOnce({});
      await controller.delete_user(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: "Usuario eliminado correctamente" });
    });

    it("debe devolver error 401 si no hay usuario", async () => {
      const req = mockRequestWithoutAuth();
      const res = mockResponse();
      await controller.delete_user(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("debe manejar error", async () => {
      const req = mockRequestWithUser();
      const res = mockResponse();
      axios.post.mockRejectedValue({
        response: { data: "error" },
      });

      await controller.delete_user(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("register", () => {
    it("registra usuario correctamente", async () => {
      const req = {
        body: {
          username: "test",
          email: "test@test.com",
          password: "123",
          first_name: "Test",
          last_name: "User"
        }
      };
      const res = mockResponse();

      axios.post
        .mockResolvedValueOnce({ data: { access_token: "token" } }) // admin token
        .mockResolvedValueOnce({}); // creación usuario

      await controller.register(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Usuario registrado correctamente"
      });
    });

    it("maneja error", async () => {
      const req = { body: {} };
      const res = mockResponse();

      axios.post.mockRejectedValue(new Error("fail"));

      await controller.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
  
  describe("login", () => {
    it("login correcto", async () => {
      const req = { body: { username: "test", password: "123" } };
      const res = mockResponse();

      axios.post.mockResolvedValue({ data: { access_token: "token" } });

      await controller.login(req, res);

      expect(res.json).toHaveBeenCalledWith({ access_token: "token" });
    });

    it("credenciales inválidas", async () => {
      const req = { body: {} };
      const res = mockResponse();

      axios.post.mockRejectedValue(new Error("fail"));

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
});
describe("delete_user_by_id", () => {
  it("elimina usuario", async () => {
    const req = { params: { id: "1" } };
    const res = mockResponse();

    axios.post.mockResolvedValueOnce({ data: { access_token: "token" } });
    axios.delete.mockResolvedValueOnce({});

    await controller.delete_user_by_id(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("maneja error", async () => {
    const req = { params: { id: "1" } };
    const res = mockResponse();

    axios.post.mockRejectedValue(new Error("fail"));

    await controller.delete_user_by_id(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

});