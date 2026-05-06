const pool = require("../../config/db.js");
const users_dao = require("../interfaces/users_dao.js");

class users_postgres_dao extends users_dao {
    async create({ id, email, nombre }) {
        const result = await pool.query(
            "INSERT INTO usuarios (id, email, nombre) VALUES ($1, $2, $3) RETURNING *",
            [id, email, nombre]
        );
        return result.rows[0];
    }

    async getAll() {
        const result = await pool.query("SELECT id, email, nombre FROM usuarios");
        return result.rows;
    }

    async getById(id) {
        const result = await pool.query(
            "SELECT id, email, nombre FROM usuarios WHERE id = $1",
            [id]
        );
        return result.rows[0] || null;
    }

    async update(id, { email, nombre }) {
        const result = await pool.query(
            "UPDATE usuarios SET email = $1, nombre = $2 WHERE id = $3 RETURNING *",
            [email, nombre, id]
        );
        return result.rows[0] || null;
    }

    async delete(id) {
        const result = await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
        return result.rowCount > 0;
    }
}

module.exports = users_postgres_dao;