// # Inicialización y configuración de NeDB

const Datastore = require('@seald-io/nedb');
const path = require('node:path');


const dbMenu = new Datastore({
  filename: path.join(__dirname, '..', '..', 'data', 'menu-opciones.db'),
  autoload: true
});

module.exports = { dbMenu };