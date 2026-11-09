// # Manejo de req, res, códigos HTTP (200, 400, 404)
const menuService = require('../services/menuService');

const obtenerMenu = async (req, res, next) => {
  try {
    const opciones = await menuService.listarMenu();
    res.json(opciones);
  } catch (error) {
    next(error);
  }
};

const obtenerMenuPorProfundidad = async (req, res, next) => {
  try {
    const depth = Number(req.params.depth);
    const opciones = await menuService.listarMenu({ depth });
    res.json(opciones);
  } catch (error) {
    next(error);
  }
};

const obtenerMenuPorCultura = async (req, res, next) => {
  try {
    const culture = req.params.culture;
    const opciones = await menuService.listarMenu({ culture });
    res.json(opciones);
  } catch (error) {
    next(error);
  }
};
const obtenerOpcionPorId = async (req, res, next) => {
  try {
    const opcion = await menuService.buscarPorId(req.params.id);
    if (!opcion) {
      return res.status(404).json({ error: 'Opción de menú no encontrada' });
    }
    res.json(opcion);
  } catch (error) {
    next(error);
  }
};

const crearOpcion = async (req, res, next) => {
  try {
    const opciones = await menuService.guardarOpciones(req.body);
    res.status(200).json({
      guardadas: opciones.length,
      opciones
    });
  } catch (error) {
    if (error instanceof TypeError) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

const inicializarBaseDatos = async (req, res, next) => {
  try {
    const opciones = await menuService.inicializarDesdeArchivo();
    res.status(200).json({
      guardadas: opciones.length,
      opciones
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerMenu,
  obtenerMenuPorProfundidad,
  obtenerMenuPorCultura,
  obtenerOpcionPorId,
  crearOpcion,
  inicializarBaseDatos
};