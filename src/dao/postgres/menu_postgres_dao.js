const menu_dao = require("../interfaces/menu_dao.js");
const pool = require("../../config/db.js");

class menu_postgres_dao extends menu_dao {

  async getAll() {
    const result = await pool.query(`
      SELECT m.*, r.nombre_rest 
      FROM menus m 
      JOIN restaurantes r ON m.rest_id = r.id 
      ORDER BY m.id
    `);
    return result.rows;
  }

  async getByRestaurant(rest_id) {
    const result = await pool.query(
      "SELECT * FROM menus WHERE rest_id = $1 ORDER BY id",
      [rest_id]
    );
    return result.rows;
  }

  async getById(id) {
    const result = await pool.query(`
      SELECT m.*, r.nombre_rest 
      FROM menus m 
      JOIN restaurantes r ON m.rest_id = r.id 
      WHERE m.id = $1
    `, [id]);

    return result.rows[0] || null;
  }

  async restaurantExists(rest_id) {
    const result = await pool.query(
      "SELECT id FROM restaurantes WHERE id = $1",
      [rest_id]
    );
    return result.rows.length > 0;
  }

  async create({ nombre_menu, rest_id }) {
    const result = await pool.query(
      "INSERT INTO menus (nombre_menu, rest_id) VALUES ($1, $2) RETURNING *",
      [nombre_menu, rest_id]
    );
    return result.rows[0];
  }

  async update(id, { nombre_menu, rest_id }) {
    const result = await pool.query(`
      UPDATE menus 
      SET nombre_menu = COALESCE($1, nombre_menu), 
          rest_id = COALESCE($2, rest_id) 
      WHERE id = $3 
      RETURNING *
    `, [nombre_menu, rest_id, id]);

    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM menus WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rowCount > 0;
  }
}

module.exports = menu_postgres_dao;