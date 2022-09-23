const { Router } = require("express");
const { check } = require("express-validator");
const {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");
const { existeProductoPorId } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole } = require("../middlewares/validar-roles");

const router = Router();

// Validar token previamente
//router.use(validarJWT);

// obtener todas las categorias - publico
router.get("/", obtenerProductos);

// obtener un producto por id - publico
router.get(
  "/:id",
  [
    check("id", "El ID debe ser válido en MongoDB").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

// crear categoria - privado - cualquier persona con un token válido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearProducto
);

// actualizar - privado - cualquiera con token válido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "El ID debe ser válido en MongoDB").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  actualizarProducto
);

// borrar un producto - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El ID debe ser válido en MongoDB").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
