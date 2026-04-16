const DishDAO = require("../interfaces/dishes_dao.js");

class DishMongoDAO extends DishDAO {

  async getAll() {
    // return await DishModel.find();
  }

  async getByMenu(menu_id) {

  }

  async getById(id) {
  
  }

  async menuExists(menu_id) {
  
  }

  async create(data) {
  
  }

  async update(id, data) {

  }

  async delete(id) {
  }
}

module.exports = DishMongoDAO;