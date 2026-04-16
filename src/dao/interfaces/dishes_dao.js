//DAO ABSTRACT CLASS
class dish_dao {
  async getAll() { 
    throw new Error("Not implemented"); 
    }

  async getByMenu(menu_id) { 
    throw new Error("Not implemented"); 
    }

  async getById(id) { 
    throw new Error("Not implemented"); 
  }

  async create(data) { 
    throw new Error("Not implemented"); 
  }
  
  async update(id, data) { 
    throw new Error("Not implemented"); 
  }

  async delete(id) { 
    throw new Error("Not implemented");
  }
}

module.exports = dish_dao;