const users_dao = require("../interfaces/users_dao.js");
const { getDb } = require("../../config/db.js");

const COLLECTION = "usuarios";

const fromDocument = (doc) => ({
    id: doc._id.toString(),
    email: doc.email,
    nombre: doc.nombre
});

class users_mongo_dao extends users_dao {
    async create({ id, email, nombre }) {
        const db = await getDb();

        const existing = await db.collection(COLLECTION).findOne({ id });
        if (existing) {
            return fromDocument(existing);
        }
        
        const result = await db.collection(COLLECTION).insertOne({
            id,  // Guardamos el ID de Keycloak
            email,
            nombre,
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
        const doc = await db.collection(COLLECTION).findOne({ id });
        return doc ? fromDocument(doc) : null;
    }

    async update(id, { email, nombre }) {
        const db = await getDb();
        const result = await db.collection(COLLECTION).findOneAndUpdate(
            { id },
            { $set: { email, nombre, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );
        return result ? fromDocument(result) : null;
    }

    async delete(id) {
        const db = await getDb();
        const result = await db.collection(COLLECTION).deleteOne({ id });
        return result.deletedCount > 0;
    }
}

module.exports = users_mongo_dao;