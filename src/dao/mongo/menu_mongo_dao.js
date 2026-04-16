const MenuDAO = require("../interfaces/menu_dao.js");

class MenuMongoDAO extends MenuDAO {

  async getAll() {
    // return await MenuModel.find();
  }

  async getByRestaurant(rest_id) {
    // return await MenuModel.find({ rest_id });
  }

  async getById(id) {
    // return await MenuModel.findById(id);
  }

  async create(data) {
    // return await MenuModel.create(data);
  }

  async update(id, data) {
    // return await MenuModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    // const res = await MenuModel.findByIdAndDelete(id);
    // return !!res;
  }
}

module.exports = MenuMongoDAO;