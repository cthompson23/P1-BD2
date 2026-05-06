const tables_dao = require("../interfaces/tables_dao.js");
const { getDb } = require("../../config/db.js");
const { ObjectId } = require("mongodb");

const COLLECTION = "mesas";
const RESTAURANTS_COLLECTION = "restaurantes";

function fromDocument(doc) {
    if (!doc) return null;
    return {
        id: doc._id.toString(),
        rest_id: doc.rest_id,
        numero_mesa: doc.numero_mesa,
        capacidad: doc.capacidad,
        disponible: doc.disponible
    };
}

class tables_mongo_dao extends tables_dao {
    async create(data) {
        const db = await getDb();
        const result = await db.collection(COLLECTION).insertOne({
            rest_id: data.rest_id,
            numero_mesa: data.numero_mesa,
            capacidad: data.capacidad,
            disponible: data.disponible !== undefined ? data.disponible : true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const inserted = await db.collection(COLLECTION).findOne({ _id: result.insertedId });
        return fromDocument(inserted);
    }

    async getAll() {
        const db = await getDb();
        const docs = await db.collection(COLLECTION).find({}).toArray();
        return docs.map(fromDocument);
    }

    async getByRestaurant(rest_id) {
        const db = await getDb();
        const docs = await db.collection(COLLECTION).find({ rest_id: rest_id }).toArray();
        return docs.map(fromDocument);
    }

    async getById(id) {
        const db = await getDb();
        const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
        return fromDocument(doc);
    }

    async update(id, data) {
        const db = await getDb();
        const updateDoc = { ...data, updatedAt: new Date() };
        delete updateDoc._id;
        delete updateDoc.id;
        
        const result = await db.collection(COLLECTION).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateDoc },
            { returnDocument: 'after' }
        );
        return fromDocument(result);
    }

    async delete(id) {
        const db = await getDb();
        const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }

    async restaurantExists(rest_id) {
        const db = await getDb();
        const count = await db.collection(RESTAURANTS_COLLECTION).countDocuments({ 
            _id: new ObjectId(rest_id) 
        });
        return count > 0;
    }

    async checkAvailability({ rest_id, fecha, hora, capacidad }) {
        const db = await getDb();
        
        const tables = await db.collection(COLLECTION).find({
            rest_id: rest_id,
            capacidad: { $gte: parseInt(capacidad) || 0 }
        }).toArray();
        
        const reservations = await db.collection("reservaciones").find({
            dia_reservacion: fecha,
            hora_reservacion: hora,
            estado: "activa"
        }).toArray();
        
        const reservedTableIds = new Set(reservations.map(r => r.mesa_id));
        const availableTables = tables.filter(table => !reservedTableIds.has(table._id.toString()));
        
        return availableTables.map(fromDocument);
    }
}

module.exports = tables_mongo_dao;