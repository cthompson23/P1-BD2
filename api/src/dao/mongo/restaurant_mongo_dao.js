const restaurant_dao = require("../interfaces/restaurant_dao.js");
const { getDb } = require("../../config/db.js");
const { ObjectId } = require("mongodb");

const COLLECTION = "restaurantes";

function fromDocument(doc) {
    if (!doc) return null;
    return {
        id: doc._id.toString(),
        nombre_rest: doc.nombre_rest,
        ubicacion: doc.ubicacion,
        correo_rest: doc.correo_rest,
        telefono_rest: doc.telefono_rest
    };
}

class restaurant_mongo_dao extends restaurant_dao {
    async create(data) {
        const db = await getDb();
        const result = await db.collection(COLLECTION).insertOne({
            nombre_rest: data.nombre_rest,
            ubicacion: data.ubicacion,
            correo_rest: data.correo_rest || null,
            telefono_rest: data.telefono_rest || null,
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
}

module.exports = restaurant_mongo_dao;