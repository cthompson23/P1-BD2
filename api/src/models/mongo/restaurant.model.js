const COLLECTION = "restaurantes";

const toDocument = (data) => ({
    nombre_rest: data.nombre_rest,
    ubicacion: data.ubicacion,
    correo_rest: data.correo_rest || null,
    telefono_rest: data.telefono_rest || null,
    createdAt: new Date(),
    updatedAt: new Date()
});

const fromDocument = (doc) => ({
    id: doc._id.toString(),
    nombre_rest: doc.nombre_rest,
    ubicacion: doc.ubicacion,
    correo_rest: doc.correo_rest,
    telefono_rest: doc.telefono_rest
});

module.exports = { COLLECTION, toDocument, fromDocument };