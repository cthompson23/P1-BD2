const  = process.env.DB_TYPE;

if (!) {
  throw new Error("DB_TYPE no definido");
}

const allowedDBs = ["mongo", "postgres"];

if (!allowedDBs.includes()) {
  throw new Error(`DB_TYPE inválido: ${}`);
}

class dao_factory {
  static create() {
    const basePath = `../dao/${}`;

    const load = (name) => {
      const DAO = require(`${basePath}/${name}_${}_dao.js`);
      return new DAO();
    };

    return {
      restaurants_dao: load("restaurant"),
      tables_dao: load("tables"),
      menus_dao: load("menu"),
      orders_dao: load("orders"),
      reservations_dao: load("reservation"),
      dishes_dao: load("dishes"),
      users_dao: load("users") 
    };
  }
}

module.exports = dao_factory.create();