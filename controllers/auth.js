const { request, response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {

    // verificar si el email existe
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
        return res.status(400).json({
            msg: 'Usuario / Password no son correctos - correo'
        });
    }

    // verificar si el usuario está activo

    if (!usuario.estado) {
        return res.status(400).json({
            msg: 'Usuario / Password no son correctos - estado: false'
        });
    }

    // verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if(!validPassword) {
        return res.status(400).json({
            msg: 'Usuario / Password no son correctos - password'
        });
    }

    // generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });
  } catch (error) {

    console.log(error);
    
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {

  const { id_token } = req.body;

  try {

    const {correo, nombre, img} = await googleVerify(id_token);

    //console.log({correo, nombre, img})

    let usuario = await Usuario.findOne({correo});

    if(!usuario) {
        // crear usuario
        const data = {

            nombre,
            correo,
            password: ';P',
            img,
            google: true,
            rol: 'USER_ROLE'
        };

        usuario = new Usuario(data);
        await usuario.save();

    }

    // si el usuario en DB
    if(!usuario.estado) {
        return res.status(401).json({
            msg: 'Hable con el administrador, usuario bloqueado'
        });
    }

    // generar el JWT
    const token = await generarJWT(usuario.id);
    
    res.json({
      usuario,
      token
    });

  } catch (error) {
    res.status(400).json({
      msg: "Token de Google no es válido",
    });    
  }

}

module.exports = {
  login,
  googleSignIn,
};
