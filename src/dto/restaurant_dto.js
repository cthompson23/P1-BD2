class restaurant_dto {
  constructor({ nombre_rest, ubicacion, correo_rest, telefono_rest }) {
    this.nombre_rest = nombre_rest;
    this.ubicacion = ubicacion;
    this.correo_rest = correo_rest;
    this.telefono_rest = telefono_rest;
  }
}

module.exports = restaurant_dto;