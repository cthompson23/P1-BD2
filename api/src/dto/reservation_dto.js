class reservation_dto {
  constructor({ mesa_id, dia_reservacion, hora_reservacion }) {

    if (!mesa_id) {
      throw new Error("mesa_id es requerido");
    }

    if (!dia_reservacion) {
      throw new Error("dia_reservacion es requerido");
    }

    if (!hora_reservacion) {
      throw new Error("hora_reservacion es requerido");
    }

    this.mesa_id = mesa_id;
    this.dia_reservacion = dia_reservacion;
    this.hora_reservacion = hora_reservacion;
  }
}

module.exports = reservation_dto;