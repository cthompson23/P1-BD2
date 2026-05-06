const COLLECTION = "menus";

const toDocument = (data) => ({
    nombre_menu: data.nombre_menu,
    rest_id: data.rest_id,
    createdAt: new Date(),
    updatedAt: new Date()
});

const fromDocument = (doc) => ({
    id: doc._id.toString(),
    nombre_menu: doc.nombre_menu,
    rest_id: doc.rest_id
});

module.exports = { COLLECTION, toDocument, fromDocument };