const dish_dao = require("../interfaces/dishes_dao.js");
const pool = require("../../config/db.js");

class dish_postgres_dao extends dish_dao{

  async getAll() {
    const result = await pool.query(`
      SELECT p.*, m.nombre_menu, r.nombre_rest 
      FROM platos p 
      JOIN menus m ON p.menu_id = m.id 
      JOIN restaurantes r ON m.rest_id = r.id 
      ORDER BY p.id
    `);
    return result.rows;
  }

  async getByMenu(menu_id) {
    const result = await pool.query(
      "SELECT * FROM platos WHERE menu_id = $1 ORDER BY id",
      [menu_id]
    );
    return result.rows;
  }

  async getById(id) {
    const result = await pool.query(`
      SELECT p.*, m.nombre_menu, r.nombre_rest 
      FROM platos p 
      JOIN menus m ON p.menu_id = m.id 
      JOIN restaurantes r ON m.rest_id = r.id 
      WHERE p.id = $1
    `, [id]);

    return result.rows[0] || null;
  }

  async menuExists(menu_id) {
    const result = await pool.query(
      "SELECT id FROM menus WHERE id = $1",
      [menu_id]
    );
    return result.rows.length > 0;
  }

  async create({ nombre_plato, precio, menu_id }) {
    const result = await pool.query(
      "INSERT INTO platos (nombre_plato, precio, menu_id) VALUES ($1, $2, $3) RETURNING *",
      [nombre_plato, precio, menu_id]
    );
    return result.rows[0];
  }

  async update(id, { nombre_plato, precio, menu_id }) {
    const result = await pool.query(`
      UPDATE platos 
      SET nombre_plato = COALESCE($1, nombre_plato),
          precio = COALESCE($2, precio),
          menu_id = COALESCE($3, menu_id)
      WHERE id = $4
      RETURNING *
    `, [nombre_plato, precio, menu_id, id]);

    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM platos WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rowCount > 0;
  }
}

module.exports = dish_postgres_dao;