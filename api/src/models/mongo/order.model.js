const COLLECTION = "pedidos";

const toDocument = (data) => ({
    usuario_id: data.usuario_id,
    reservacion_id: data.reservacion_id || null,
    tipo_pedido: data.tipo_pedido,
    fecha_orden: data.fecha_orden,
    estado: data.estado || "pendiente",
    items: data.items || [],
    createdAt: new Date(),
    updatedAt: new Date()
});

const fromDocument = (doc) => ({
    id: doc._id.toString(),
    usuario_id: doc.usuario_id,
    reservacion_id: doc.reservacion_id,
    tipo_pedido: doc.tipo_pedido,
    fecha_orden: doc.fecha_orden,
    estado: doc.estado,
    items: doc.items
});

module.exports = { COLLECTION, toDocument, fromDocument };