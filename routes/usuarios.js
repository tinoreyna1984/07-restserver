const { Router } = require("express");
const { check } = require("express-validator");
const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosPatch,
  usuariosDelete,
} = require("../controllers/usuarios");
const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole, tieneRole } = require("../middlewares/validar-roles");

const router = Router();

// el segundo argumento en las rutas es el uso del middleware
// a partir de express-validator

router.get("/", usuariosGet);

router.put("/:id",
  [
    check("id", "El ID no es válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos
  ],
  usuariosPut
);

router.post("/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password","El password es obligatorio, 6 caracteres mínimo").isLength({ min: 6 }),
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom(emailExiste),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
);

router.patch("/", usuariosPatch);

router.delete("/:id",
  [
    validarJWT,
    //esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE", "OTRO_ROLE"),
    check("id", "El ID no es válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
