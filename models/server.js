const express = require("express");
const cors = require("cors");

class server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.usuariosPath = '/api/usuarios';

    // middlewares
    this.middlewares();

    // rutas de mi aplicacion
    this.routes();
  }

  middlewares() {
    // CORS
    this.app.use(cors());
    // lectura y parseo del cuerpo
    this.app.use(express.json());
    // public
    this.app.use(express.static("public"));
  }

  routes() {

    this.app.use(this.usuariosPath, require('../routes/usuarios'));

  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor ejecutandose en el puerto ${this.port}`);
    });
  }
}

module.exports = server;
