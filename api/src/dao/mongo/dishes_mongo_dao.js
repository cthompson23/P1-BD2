const dishes_dao = require("../interfaces/dishes_dao.js");
const { getDb } = require("../../config/db.js");
const { ObjectId } = require("mongodb");

const COLLECTION = "platos";
const MENUS_COLLECTION = "menus";

function fromDocument(doc) {
    if (!doc) return null;
    return {
        id: doc._id.toString(),
        nombre_plato: doc.nombre_plato,
        precio: doc.precio,
        menu_id: doc.menu_id
    };
}

class dishes_mongo_dao extends dishes_dao {
    async create(data) {
        const db = await getDb();
        const result = await db.collection(COLLECTION).insertOne({
            nombre_plato: data.nombre_plato,
            precio: data.precio,
            menu_id: data.menu_id,
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

    async getByMenu(menu_id) {
        const db = await getDb();
        const docs = await db.collection(COLLECTION).find({ menu_id: menu_id }).toArray();
        return docs.map(fromDocument);
    }

    async getById(id) {
        const db = await getDb();
        const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
        return fromDocument(doc);
    }

    async update(id, data) {
        const db = await getDb();
        
        // Construir documento de actualización
        const updateDoc = {
            updatedAt: new Date()
        };
        
        // Solo incluir campos que vienen en la solicitud
        if (data.nombre_plato !== undefined) updateDoc.nombre_plato = data.nombre_plato;
        if (data.precio !== undefined) updateDoc.precio = data.precio;
        if (data.menu_id !== undefined) updateDoc.menu_id = data.menu_id;
        
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

    async menuExists(menu_id) {
        const db = await getDb();
        const count = await db.collection(MENUS_COLLECTION).countDocuments({ 
            _id: new ObjectId(menu_id) 
        });
        return count > 0;
    }
}

module.exports = dishes_mongo_dao;