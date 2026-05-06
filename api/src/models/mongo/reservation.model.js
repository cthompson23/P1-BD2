const COLLECTION = "reservaciones";

const toDocument = (data) => ({
    usuario_id: data.usuario_id,
    mesa_id: data.mesa_id,
    dia_reservacion: data.dia_reservacion,
    hora_reservacion: data.hora_reservacion,
    estado: data.estado || "activa",
    createdAt: new Date(),
    updatedAt: new Date()
});

const fromDocument = (doc) => ({
    id: doc._id.toString(),
    usuario_id: doc.usuario_id,
    mesa_id: doc.mesa_id,
    dia_reservacion: doc.dia_reservacion,
    hora_reservacion: doc.hora_reservacion,
    estado: doc.estado
});

module.exports = { COLLECTION, toDocument, fromDocument };