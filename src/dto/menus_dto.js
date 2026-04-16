class menu_dto {
  constructor({ nombre_menu, rest_id }) {

    if (nombre_menu !== undefined && typeof nombre_menu !== "string") {
      throw new Error("nombre_menu debe ser un string");
    }
  
    this.nombre_menu = nombre_menu;
    this.rest_id = rest_id;
  }
}

module.exports = menu_dto;