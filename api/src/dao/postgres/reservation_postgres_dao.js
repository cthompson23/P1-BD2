const pool = require("../../config/db.js");
const reservation_dao = require("../interfaces/reservation_dao.js");

class reservation_postgres_dao extends reservation_dao {

  async getAll() {
    const res = await pool.query("SELECT * FROM reservaciones");
    return res.rows;
  }

  async getById(id) {
    const res = await pool.query(
      "SELECT * FROM reservaciones WHERE id = $1",
      [id]
    );
    return res.rows[0] || null;
  }

  async create({ usuario_id, mesa_id, dia_reservacion, hora_reservacion }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Verificar mesa
      const mesa = await client.query(
        "SELECT disponible FROM mesas WHERE id = $1",
        [mesa_id]
      );

      if (mesa.rows.length === 0) {
        throw new Error("Mesa no encontrada");
      }

      if (!mesa.rows[0].disponible) {
        throw new Error("Mesa no disponible");
      }

      // Verificar conflicto
      const conflict = await client.query(
        `SELECT id FROM reservaciones 
         WHERE mesa_id = $1 
         AND dia_reservacion = $2 
         AND hora_reservacion = $3
         AND estado = 'activa'`,
        [mesa_id, dia_reservacion, hora_reservacion]
      );

      if (conflict.rows.length > 0) {
        throw new Error("La mesa ya está reservada para ese horario");
      }

      // Insertar
      const result = await client.query(
        `INSERT INTO reservaciones 
         (usuario_id, mesa_id, dia_reservacion, hora_reservacion, estado)
         VALUES ($1, $2, $3, $4, 'activa')
         RETURNING *`,
        [usuario_id, mesa_id, dia_reservacion, hora_reservacion]
      );

      // Actualizar mesa
      await client.query(
        "UPDATE mesas SET disponible = false WHERE id = $1",
        [mesa_id]
      );

      await client.query("COMMIT");

      return result.rows[0];

    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async cancel(id) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const res = await client.query(
        "SELECT mesa_id, estado FROM reservaciones WHERE id = $1",
        [id]
      );

      if (res.rows.length === 0) return false;

      if (res.rows[0].estado === "cancelada") {
        throw new Error("Reservación ya cancelada");
      }

      await client.query(
        "UPDATE reservaciones SET estado = 'cancelada' WHERE id = $1",
        [id]
      );

      await client.query(
        "UPDATE mesas SET disponible = true WHERE id = $1",
        [res.rows[0].mesa_id]
      );

      await client.query("COMMIT");

      return true;

    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const res = await client.query(
        "SELECT mesa_id FROM reservaciones WHERE id = $1",
        [id]
      );

      if (res.rows.length === 0) return false;

      await client.query(
        "DELETE FROM reservaciones WHERE id = $1",
        [id]
      );

      await client.query(
        "UPDATE mesas SET disponible = true WHERE id = $1",
        [res.rows[0].mesa_id]
      );

      await client.query("COMMIT");

      return true;

    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = reservation_postgres_dao;