const reservation_dao = require("../interfaces/reservation_dao.js");
const { getDb } = require("../../config/db.js");
const { ObjectId } = require("mongodb");

const COLLECTION = "reservaciones";
const TABLES_COLLECTION = "mesas";

function fromDocument(doc) {
    if (!doc) return null;
    return {
        id: doc._id.toString(),
        usuario_id: doc.usuario_id,
        mesa_id: doc.mesa_id,
        dia_reservacion: doc.dia_reservacion,
        hora_reservacion: doc.hora_reservacion,
        estado: doc.estado
    };
}

class reservation_mongo_dao extends reservation_dao {
    async create(data) {
        const db = await getDb();
        
        const result = await db.collection(COLLECTION).insertOne({
            usuario_id: data.usuario_id,
            mesa_id: data.mesa_id,
            dia_reservacion: data.dia_reservacion,
            hora_reservacion: data.hora_reservacion,
            estado: data.estado || "activa",
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        await db.collection(TABLES_COLLECTION).updateOne(
            { _id: new ObjectId(data.mesa_id) },
            { $set: { disponible: false, updatedAt: new Date() } }
        );
        
        const inserted = await db.collection(COLLECTION).findOne({ _id: result.insertedId });
        return fromDocument(inserted);
    }

    async getAll() {
        const db = await getDb();
        const docs = await db.collection(COLLECTION).find({}).toArray();
        return docs.map(fromDocument);
    }

    async getById(id) {
        const db = await getDb();
        const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
        return fromDocument(doc);
    }

    async cancel(id) {
        const db = await getDb();
        
        const reservation = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
        
        if (!reservation) return false;
        
        const result = await db.collection(COLLECTION).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { estado: "cancelada", updatedAt: new Date() } },
            { returnDocument: 'after' }
        );
        
        await db.collection(TABLES_COLLECTION).updateOne(
            { _id: new ObjectId(reservation.mesa_id) },
            { $set: { disponible: true, updatedAt: new Date() } }
        );
        
        return !!result;
    }

    async delete(id) {
        const db = await getDb();
        
        const reservation = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
        
        const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
        
        if (reservation && result.deletedCount > 0) {
            await db.collection(TABLES_COLLECTION).updateOne(
                { _id: new ObjectId(reservation.mesa_id) },
                { $set: { disponible: true, updatedAt: new Date() } }
            );
        }
        
        return result.deletedCount > 0;
    }
}

module.exports = reservation_mongo_dao;