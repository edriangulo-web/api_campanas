// # Lógica de negocio (parseo de JSON, validaciones de profundidad)

const fs = require('node:fs/promises');
const path = require('node:path');
const menuOpciones = require('../models/MenuOpciones');

const menuOpcionesPath = path.join(__dirname, '..', '..', 'resources', 'menu_principal.json');

const listarMenu = async (filtro) => {
  return await menuOpciones.buscarMenuOpciones(filtro);
};

const buscarPorId = async (id) => {
  return await menuOpciones.buscarMenuOpcionPorId(id);
};

const guardarOpciones = async (body) => {
  return await menuOpciones.guardarMenuOpciones(body);
};

const inicializarDesdeArchivo = async () => {
  const contenido = await fs.readFile(menuOpcionesPath, 'utf8');
  const json = JSON.parse(contenido);
  return await menuOpciones.reemplazarMenuOpciones(json);
};

module.exports = {
  listarMenu,
  buscarPorId,
  guardarOpciones,
  inicializarDesdeArchivo
};