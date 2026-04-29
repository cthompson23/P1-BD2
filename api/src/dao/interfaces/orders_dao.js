//DAO ABSTRACT CLASS
class order_dao {
  async getAll(filters) {
    throw new Error("Not implemented");
  }

  async getById(id, filters) {
    throw new Error("Not implemented");
  }

  async create(data) {
    throw new Error("Not implemented");
  }

  async updateStatus(id, estado) {
    throw new Error("Not implemented");
  }

  async delete(id) {
    throw new Error("Not implemented");
  }
}

module.exports = order_dao;
