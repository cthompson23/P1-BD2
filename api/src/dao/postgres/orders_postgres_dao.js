const pool = require("../../config/db.js");
const order_dao = require("../interfaces/orders_dao.js");

class order_postgres_dao extends order_dao {

  async getAll({ userId, isAdmin }) {
    let query = "SELECT * FROM pedidos";
    let params = [];

    if (!isAdmin) {
      query += " WHERE usuario_id = $1";
      params.push(userId);
    }

    const res = await pool.query(query, params);
    return res.rows;
  }

  async getById(id, { userId, isAdmin }) {
    let query = "SELECT * FROM pedidos WHERE id = $1";
    let params = [id];

    if (!isAdmin) {
      query += " AND usuario_id = $2";
      params.push(userId);
    }

    const res = await pool.query(query, params);
    return res.rows[0] || null;
  }

  async create({ usuario_id, reservacion_id, tipo_pedido, items }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const order = await client.query(
        `INSERT INTO pedidos 
        (usuario_id, reservacion_id, tipo_pedido, fecha_orden, estado)
        VALUES ($1, $2, $3, CURRENT_DATE, 'pendiente')
        RETURNING *`,
        [usuario_id, reservacion_id, tipo_pedido]
      );

      const pedido_id = order.rows[0].id;

      for (const item of items) {
        await client.query(
          `INSERT INTO item_pedido (pedido_id, plato_id, cantidad)
           VALUES ($1, $2, $3)`,
          [pedido_id, item.plato_id, item.cantidad]
        );
      }

      await client.query("COMMIT");

      return {
        message: "Pedido creado exitosamente",
        pedido: order.rows[0]
      };

    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async updateStatus(id, estado) {
    const validStates = [
      "pendiente",
      "confirmado",
      "en_preparacion",
      "listo",
      "entregado",
      "cancelado"
    ];

    if (!validStates.includes(estado)) {
      throw new Error("Estado inválido");
    }

    const res = await pool.query(
      "UPDATE pedidos SET estado = $1 WHERE id = $2 RETURNING *",
      [estado, id]
    );

    return res.rows[0] || null;
  }

  async delete(id) {
    const res = await pool.query(
      "DELETE FROM pedidos WHERE id = $1 RETURNING id",
      [id]
    );

    return res.rowCount > 0;
  }
}

module.exports = order_postgres_dao;