const { response } = require("express");
const Producto = require("../models/producto");

const crearProducto = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;

  const productoDB = await Producto.findOne({ nombre: body.nombre });
  if (productoDB) {
    return res.status(400).json({ msg: `El producto ${nombre} ya existe` });
  }

  //console.log(req.usuario._id)

  try {
    const data = {
      ...body,
      nombre: body.nombre.toUpperCase(),
      usuario: req.usuario._id,
    };
    const producto = new Producto(data);
    await producto.save();
    res.status(201).json({
      msg: "Producto creado",
      producto,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error al crear el producto",
      error: error.message,
    });
  }
};

const obtenerProductos = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  try {
    const [total, productos] = await Promise.all([
      Producto.countDocuments(query),
      Producto.find(query)
        .populate("usuario", "nombre")
        .populate("categoria", "nombre")
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.json({
      total,
      productos,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error al obtener los productos",
      error: error.message,
    });
  }
};

const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;

  //console.log(req.params.id)

  //return;

  try {
    const producto = await Producto.findById(id)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre");
    res.json(producto);
  } catch (error) {
    res.status(500).json({
      msg: "Error al obtener el producto",
      error: error.message,
    });
  }
};

const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if(data.nombre){
    data.nombre = data.nombre.toUpperCase();
  }
  data.usuario = req.usuario._id;

  try {
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    res.json(producto);
  } catch (error) {
    res.status(500).json({
      msg: "Error al actualizar el producto",
      error: error.message,
    });
  }
};

const borrarProducto = async (req, res = response) => {
  const { id } = req.params;
  
  try {
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.json(producto);
  } catch (error) {
    res.status(500).json({
      msg: "Error al borrar el producto",
      error: error.message,
    });
  }
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
};
