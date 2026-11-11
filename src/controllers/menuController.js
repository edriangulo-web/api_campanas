// src/controllers/menuController.js
const menuService = require("../services/menuService");

/**
 * Obtiene las opciones de menú aplicando filtros opcionales recibidos por Query Params.
 * Ejemplo: /api/menu-opciones?idCategory=23&culture=es-MX&depth=1
 */
const obtenerMenu = async (req, res, next) => {
  try {
    const {
      idCategory: idCategoria, // Renombras 'idCategory' a 'idCategoria'
      culture: idioma, // Renombras 'culture' a 'idioma'
      depth: profundidad, // Renombras 'depth' a 'profundidad'
      parent, // Se queda igual
    } = req.query;

    const filtros = {};
    if (idCategoria !== undefined) filtros.idCategory = idCategoria;
    if (idioma !== undefined) filtros.culture = idioma;
    if (parent !== undefined) filtros.parent = parent;
    if (profundidad !== undefined) filtros.depth = Number(profundidad);

    // Si vienen filtros, se pasan; si viene vacío, lista todo
    const opciones = await menuService.listarMenu(filtros);

    // IMPORTANTE: Si C# espera la estructura { results: [...] }, devuélvela así:
    res.json({ results: opciones });
    // (O simplemente res.json(opciones) si tu C# deserializa directo la lista)
  } catch (error) {
    next(error);
  }
};

const obtenerOpcionPorId = async (req, res, next) => {
  try {
    const opcion = await menuService.buscarPorId(req.params.id);
    if (!opcion) {
      return res.status(404).json({ error: "Opción de menú no encontrada" });
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
      opciones,
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
      opciones,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerMenu,
  obtenerOpcionPorId,
  crearOpcion,
  inicializarBaseDatos,
};
