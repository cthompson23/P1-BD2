const COLLECTION = "platos";

const toDocument = (data) => ({
    nombre_plato: data.nombre_plato,
    precio: data.precio,
    menu_id: data.menu_id,
    createdAt: new Date(),
    updatedAt: new Date()
});

const fromDocument = (doc) => ({
    id: doc._id.toString(),
    nombre_plato: doc.nombre_plato,
    precio: doc.precio,
    menu_id: doc.menu_id
});

module.exports = { COLLECTION, toDocument, fromDocument };