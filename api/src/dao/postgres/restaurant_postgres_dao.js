const restaurant_dao = require("../interfaces/restaurant_dao.js");
const pool = require("../../config/db.js");

class restaurant_postgres_dao extends restaurant_dao {
  async create({ nombre_rest, ubicacion, correo_rest, telefono_rest }) {
    const result = await pool.query(
      `INSERT INTO restaurantes(nombre_rest, ubicacion, correo_rest, telefono_rest)
       VALUES($1, $2, $3, $4) RETURNING *`,
      [nombre_rest, ubicacion, correo_rest, telefono_rest]
    );

    return result.rows[0];
  }

  async getAll() {
    const result = await pool.query("SELECT * FROM restaurantes");
    return result.rows;
  }

  async getById(id) {
    const result = await pool.query(
      "SELECT * FROM restaurantes WHERE id = $1",
      [id]
    );

    return result.rows[0] || null;
  }

  async update(id, { nombre_rest, ubicacion, correo_rest, telefono_rest }) {
    const result = await pool.query(
      `UPDATE restaurantes 
       SET nombre_rest = $1, ubicacion = $2, correo_rest = $3, telefono_rest = $4
       WHERE id = $5 RETURNING *`,
      [nombre_rest, ubicacion, correo_rest, telefono_rest, id]
    );

    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM restaurantes WHERE id = $1 RETURNING id",
      [id]
    );

    return result.rowCount > 0;
  }
}

module.exports = restaurant_postgres_dao;