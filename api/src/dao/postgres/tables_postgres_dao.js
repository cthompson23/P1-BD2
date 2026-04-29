const pool = require("../../config/db.js");
const table_dao = require("../interfaces/tables_dao.js");

class table_postgres_dao extends table_dao {

  async getAll() {
    const result = await pool.query(`
      SELECT m.*, r.nombre_rest 
      FROM mesas m 
      JOIN restaurantes r ON m.rest_id = r.id 
      ORDER BY m.id
    `);
    return result.rows;
  }

  async getByRestaurant(rest_id) {
    const result = await pool.query(
      "SELECT * FROM mesas WHERE rest_id = $1 ORDER BY numero_mesa",
      [rest_id]
    );
    return result.rows;
  }

  async getById(id) {
    const result = await pool.query(`
      SELECT m.*, r.nombre_rest 
      FROM mesas m 
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

  async create({ disponible, rest_id, numero_mesa, capacidad }) {
    const result = await pool.query(
      `INSERT INTO mesas (disponible, rest_id, numero_mesa, capacidad)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [disponible, rest_id, numero_mesa, capacidad]
    );
    return result.rows[0];
  }

  async update(id, { disponible, rest_id, numero_mesa, capacidad }) {
    const result = await pool.query(`
      UPDATE mesas 
      SET disponible = COALESCE($1, disponible),
          rest_id = COALESCE($2, rest_id),
          numero_mesa = COALESCE($3, numero_mesa),
          capacidad = COALESCE($4, capacidad)
      WHERE id = $5
      RETURNING *
    `, [disponible, rest_id, numero_mesa, capacidad, id]);

    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM mesas WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rowCount > 0;
  }

  async checkAvailability({ rest_id, fecha, hora, capacidad }) {
    let query = `
      SELECT m.* FROM mesas m
      WHERE m.disponible = true
    `;
    const params = [];
    let i = 1;

    if (rest_id) {
      query += ` AND m.rest_id = $${i++}`;
      params.push(rest_id);
    }

    if (capacidad) {
      query += ` AND m.capacidad >= $${i++}`;
      params.push(capacidad);
    }

    if (fecha && hora) {
      query += `
        AND NOT EXISTS (
          SELECT 1 FROM reservaciones r
          WHERE r.mesa_id = m.id
          AND r.dia_reservacion = $${i++}
          AND r.hora_reservacion = $${i++}
          AND r.estado = 'activa'
        )
      `;
      params.push(fecha, hora);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }
}

module.exports = table_postgres_dao;