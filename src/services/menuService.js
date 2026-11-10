// # Lógica de negocio (parseo de JSON, validaciones de profundidad)

const fs = require('node:fs/promises');
const path = require('node:path');
const menuOpciones = require('../models/MenuOpciones');

const relativePath  = process.env.CATEGORIAS_PATH || 'resources/Categorias.json';
const menuOpcionesDataPath = path.resolve(process.cwd(), relativePath);

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
  const contenido = await fs.readFile(menuOpcionesDataPath, 'utf8');
  const json = JSON.parse(contenido);
  return await menuOpciones.reemplazarMenuOpciones(json);
};

module.exports = {
  listarMenu,
  buscarPorId,
  guardarOpciones,
  inicializarDesdeArchivo
};