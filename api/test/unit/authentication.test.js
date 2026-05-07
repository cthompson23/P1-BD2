process.env.DB_TYPE = "postgres";

jest.mock("../../src/config/database_selector.js", () => ({
  users_dao: {
    create: jest.fn()
  }
}));

jest.mock("axios");

const axios = require("axios");

const { users_dao } = require("../../src/config/database_selector.js");

const controller = require("../../src/controllers/authentication_controller.js");

const mockRequest = (body = {}) => ({ body });

const mockResponse = () => {
  const res = {};

  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);

  return res;
};

const mockNext = jest.fn();

describe("Controlador de Autenticación", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {

    it("debe registrar un usuario normal", async () => {

      const req = mockRequest({
        username: "user1",
        email: "user1@test.com",
        password: "123",
        first_name: "Juan",
        last_name: "Perez",
        isAdmin: false
      });

      const res = mockResponse();

      // token admin
      axios.post.mockResolvedValueOnce({
        data: {
          access_token: "token"
        }
      });

      // crear usuario keycloak
      axios.post.mockResolvedValueOnce({
        headers: {
          location: "http://keycloak/users/abc-123"
        }
      });

      // mock DAO
      users_dao.create.mockResolvedValueOnce({});

      await controller.register(req, res);

      expect(users_dao.create).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);

    });

  });

});