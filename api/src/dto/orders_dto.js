class order_dto {
  constructor({ reservacion_id, tipo_pedido, items }) {

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("El pedido debe tener al menos un plato");
    }

    this.reservacion_id = reservacion_id;
    this.tipo_pedido = tipo_pedido;
    this.items = items.map(item => ({
      plato_id: item.plato_id,
      cantidad: item.cantidad
    }));
  }
}

module.exports = order_dto;