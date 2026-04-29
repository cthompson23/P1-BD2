const restaurant_dao = require("../interfaces/restaurant_dao.js");

// luego conectas mongoose
class restaurant_mongo_dao extends restaurant_dao {
  async create(data) {
    // return await RestaurantModel.create(data);
  }

  async getAll() {
    // return await RestaurantModel.find();
  }

  async getById(id) {
    // return await RestaurantModel.findById(id);
  }

  async update(id, data) {
    // return await RestaurantModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    // const res = await RestaurantModel.findByIdAndDelete(id);
    // return !!res;
  }
}

module.exports = restaurant_mongo_dao;