const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;

    // Rutas
    this.paths = {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      categorias: '/api/categorias',
      productos: '/api/productos',
      buscar: '/api/buscar',
    }

    // conectar a bases de datos
    this.conectarDB();

    // middlewares
    this.middlewares();

    // rutas de mi aplicacion
    this.routes();
  }

  // conexion a bases de datos
  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());
    // lectura y parseo del cuerpo
    this.app.use(express.json());
    // public
    this.app.use(express.static("public"));
  }

  // usar rutas definidas en el constructor
  routes() {
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    this.app.use(this.paths.categorias, require('../routes/categorias'));
    this.app.use(this.paths.productos, require('../routes/productos'));
    this.app.use(this.paths.buscar, require('../routes/buscar'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor ejecutandose en el puerto ${this.port}`);
    });
  }
}

module.exports = server;
