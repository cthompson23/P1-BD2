const dbType = process.env.DB_TYPE;

if (!dbType) {
  throw new Error("DB_TYPE no definido");
}

const allowedDBs = ["mongo", "postgres"];

if (!allowedDBs.includes(dbType)) {
  throw new Error(`DB_TYPE inválido: ${dbType}`);
}

class dao_factory {
  static create(dbType) {
    const basePath = `../dao/${dbType}`;

    const load = (name) => {
      const DAO = require(`${basePath}/${name}_${dbType}_dao.js`);
      return new DAO();
    };

    return {
      restaurants_dao: load("restaurant"),
      tables_dao: load("tables"),
      menus_dao: load("menu"),
      orders_dao: load("orders"),
      reservations_dao: load("reservation"),
      dishes_dao: load("dishes")
    };
  }
}

module.exports = dao_factory.create(dbType);
