const mongoose = require("mongoose");
const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no es válido`);
  }
};

const emailExiste = async (correo = "") => {
  // verificar si el correo existe
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya existe`);
  }
};

const existeUsuarioPorId = async (id) => {
  // verificar si el ID existe
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`El ID no es válido en Mongoose`);
  }

  const existeUsuario = await Usuario.findById(id);

  if (!existeUsuario) {
    throw new Error(`El usuario con ID '${id}' no existe`);
  }
};

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
};
