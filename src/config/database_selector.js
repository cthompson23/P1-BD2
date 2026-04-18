
const dbType = process.env.DB_TYPE;

if (!dbType) {
  throw new Error("DB_TYPE no definido");
}

let restaurants_dao;
let tables_dao;
let menus_dao;
let orders_dao;
let reservations_dao;
let dishes_dao;

if (dbType === "mongo") {
  restaurants_dao = require("../dao/mongo/restaurant_mongo_dao.js");
  tables_dao = require("../dao/mongo/tables_mongo_dao.js");
  menus_dao = require("../dao/mongo/menu_mongo_dao.js");
  orders_dao = require("../dao/mongo/orders_mongo_dao.js");
  reservations_dao = require("../dao/mongo/reservation_mongo_dao.js");
  dishes_dao = require("../dao/mongo/dishes_mongo_dao.js");

} else if (dbType === "postgres") {
  restaurants_dao = require("../dao/postgres/restaurant_postgres_dao.js");
  tables_dao = require("../dao/postgres/tables_postgres_dao.js");
  menus_dao = require("../dao/postgres/menu_postgres_dao.js");
  orders_dao = require("../dao/postgres/orders_postgres_dao.js");
  reservations_dao = require("../dao/postgres/reservation_postgres_dao.js");
  dishes_dao = require("../dao/postgres/dishes_postgres_dao.js");
  
  restaurants_dao = new restaurants_dao();
  tables_dao = new tables_dao();
  menus_dao = new menus_dao();
  orders_dao = new orders_dao();
  reservations_dao = new reservations_dao();
  dishes_dao = new dishes_dao();
}

module.exports = {
  restaurants_dao,
  tables_dao,
  menus_dao,
  orders_dao,
  reservations_dao,
  dishes_dao
};