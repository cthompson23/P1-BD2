class table_dto {
  constructor({ disponible, rest_id, numero_mesa, capacidad }) {

    if (disponible !== undefined && typeof disponible !== "boolean") {
      throw new Error("disponible debe ser boolean");
    }

    if (numero_mesa !== undefined && typeof numero_mesa !== "number") {
      throw new Error("numero_mesa debe ser número");
    }

    if (capacidad !== undefined && typeof capacidad !== "number") {
      throw new Error("capacidad debe ser número");
    }

    this.disponible = disponible;
    this.rest_id = rest_id;
    this.numero_mesa = numero_mesa;
    this.capacidad = capacidad;
  }
}

module.exports = table_dto;