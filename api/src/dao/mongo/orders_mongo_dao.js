const orders_dao = require("../interfaces/orders_dao.js");
const { getDb } = require("../../config/db.js");
const { ObjectId } = require("mongodb");

const COLLECTION = "pedidos";

function fromDocument(doc) {
    if (!doc) return null;
    return {
        id: doc._id.toString(),
        usuario_id: doc.usuario_id,
        reservacion_id: doc.reservacion_id,
        tipo_pedido: doc.tipo_pedido,
        fecha_orden: doc.fecha_orden,
        estado: doc.estado,
        items: doc.items || []
    };
}

class orders_mongo_dao extends orders_dao {
    async create(data) {
        const db = await getDb();
        const result = await db.collection(COLLECTION).insertOne({
            usuario_id: data.usuario_id,
            reservacion_id: data.reservacion_id || null,
            tipo_pedido: data.tipo_pedido,
            fecha_orden: data.fecha_orden,
            estado: data.estado || "pendiente",
            items: data.items || [],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const inserted = await db.collection(COLLECTION).findOne({ _id: result.insertedId });
        return fromDocument(inserted);
    }

    async getAll({ userId, isAdmin }) {
        const db = await getDb();
        let query = {};
        
        if (!isAdmin) {
            query = { usuario_id: userId };
        }
        
        const docs = await db.collection(COLLECTION).find(query).toArray();
        return docs.map(fromDocument);
    }

    async getById(id, { userId, isAdmin }) {
        const db = await getDb();
        const order = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
        
        if (!order) return null;
        if (!isAdmin && order.usuario_id !== userId) return null;
        
        return fromDocument(order);
    }

    async updateStatus(id, estado) {
        const db = await getDb();
        const result = await db.collection(COLLECTION).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { estado, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );
        return fromDocument(result);
    }

    async delete(id) {
        const db = await getDb();
        const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}

module.exports = orders_mongo_dao;