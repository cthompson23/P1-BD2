const COLLECTION = "mesas";

const toDocument = (data) => ({
    rest_id: typeof data.rest_id === 'string' ? data.rest_id : data.rest_id,
    numero_mesa: data.numero_mesa,
    capacidad: data.capacidad,
    disponible: data.disponible !== undefined ? data.disponible : true,
    createdAt: new Date(),
    updatedAt: new Date()
});

const fromDocument = (doc) => ({
    id: doc._id.toString(),
    rest_id: doc.rest_id,
    numero_mesa: doc.numero_mesa,
    capacidad: doc.capacidad,
    disponible: doc.disponible
});

module.exports = { COLLECTION, toDocument, fromDocument };