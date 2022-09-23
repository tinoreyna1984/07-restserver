const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

/**
 * Nota: cada método (GET, POST, PUT, DELETE, etc) de la clase Router
 * debe incluir: path, middlewares y controlador
 */

router.post( // método
  "/login", // path
  [    // middlewares
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  login // controller
);

router.post(
  "/google",
  [
    check("id_token", "id_token de Google es necesario").not().isEmpty(),
    validarCampos,
  ],
  googleSignIn
);

module.exports = router;
