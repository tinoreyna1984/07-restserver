const { response } = require("express");
const Categoria = require("../models/categoria");

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({ msg: `La categoría ${nombre} ya existe` });
  }

  //console.log(req.usuario._id)

  try {
    const data = {
      nombre,
      usuario: req.usuario._id,
    };
    const categoria = new Categoria(data);
    await categoria.save();
    res.status(201).json({
      msg: "Categoria creada",
      categoria,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error al crear la categoria",
      error: error.message,
    });
  }
};

const obtenerCategorias = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  try {
    const [total, categorias] = await Promise.all([
      Categoria.countDocuments(query),
      Categoria.find(query)
        .populate("usuario", "nombre")
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.json({
      total,
      categorias,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error al obtener las categorias",
      error: error.message,
    });
  }
};

const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findById(id).populate("usuario", "nombre");
    res.json(categoria);

  } catch (error) {
    res.status(500).json({
      msg: "Error al obtener la categoria",
      error: error.message,
    });
  }
};

const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();
    
    try {
        const categoria = await Categoria.findByIdAndUpdate(id, { nombre });
        res.json(categoria);
    } catch (error) {
        res.status(500).json({
        msg: "Error al actualizar la categoria",
        error: error.message,
        });
    }

};

const borrarCategoria = async (req, res = response) => {
  
  const { id } = req.params;
  /* const { rol } = req.usuario;

  if(rol !== 'ADMIN_ROLE'){
    return res.status(401).json({ msg: 'No autorizado' });
  } */

  try {

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });
    res.json(categoria);

    
  } catch (error) {
    res.status(500).json({
      msg: "Error al borrar la categoria",
      error: error.message,
    });
  }

};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
