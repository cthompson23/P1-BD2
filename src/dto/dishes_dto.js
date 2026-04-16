class dish_dto {
  constructor({ nombre_plato, precio, menu_id }) {

    if (nombre_plato !== undefined && typeof nombre_plato !== "string") {
      throw new Error("nombre_plato debe ser un string");
    }

    if (precio !== undefined && typeof precio !== "number") {
      throw new Error("precio debe ser un número");
    }

    this.nombre_plato = nombre_plato; 
    this.precio = precio;
    this.menu_id = menu_id;
  }
}

module.exports = dish_dto;