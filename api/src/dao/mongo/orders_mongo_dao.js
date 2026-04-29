const { ObjectId } = require("mongodb");
const connectMongo = require("../../config/mongo_client.js");
const order_dao = require("../interfaces/orders_dao.js");

class order_mongo_dao extends order_dao {
  constructor() {
    super();
    this.collectionName = "orders";
  }

  async _getCollection() {
    const db = await connectMongo();
    return db.collection(this.collectionName);
  }

  async getAll({ userId, isAdmin }) {
    const collection = await this._getCollection();
    const filter = {};

    if (!isAdmin) {
      filter.usuario_id = userId;
    }

    return await collection.find(filter).toArray();
  }

  async getById(id, { userId, isAdmin }) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const collection = await this._getCollection();
    const filter = { _id: new ObjectId(id) };

    if (!isAdmin) {
      filter.usuario_id = userId;
    }

    return await collection.findOne(filter);
  }

  async create({ usuario_id, reservacion_id, tipo_pedido, items = [] }) {
    const collection = await this._getCollection();

    const order = {
      usuario_id,
      reservacion_id,
      tipo_pedido,
      items,
      fecha_orden: new Date(),
      estado: "pendiente"
    };

    const result = await collection.insertOne(order);

    return {
      message: "Pedido creado exitosamente",
      pedido: {
        _id: result.insertedId,
        ...order
      }
    };
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

    if (!ObjectId.isValid(id)) {
      return null;
    }

    const collection = await this._getCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { estado } },
      { returnDocument: "after" }
    );

    return result.value;
  }

  async delete(id) {
    if (!ObjectId.isValid(id)) {
      return false;
    }

    const collection = await this._getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount > 0;
  }
}

module.exports = order_mongo_dao;
