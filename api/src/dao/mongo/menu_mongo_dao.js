const menu_dao = require("../interfaces/menu_dao.js");
const { getDb } = require("../../config/db.js");
const { ObjectId } = require("mongodb");

const COLLECTION = "menus";
const RESTAURANTS_COLLECTION = "restaurantes";

function fromDocument(doc) {
    if (!doc) return null;
    return {
        id: doc._id.toString(),
        nombre_menu: doc.nombre_menu,
        rest_id: doc.rest_id
    };
}

class menu_mongo_dao extends menu_dao {
    async create(data) {
        const db = await getDb();
        const result = await db.collection(COLLECTION).insertOne({
            nombre_menu: data.nombre_menu,
            rest_id: data.rest_id,
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
}

module.exports = menu_mongo_dao;