const fs = require("node:fs/promises");
const path = require("node:path");
const campanaModel = require("../models/Campana");

const campanaDataPath = path.join(
  __dirname,
  "..",
  "..",
  "resources",
  "CategoriasDetalle.json",
);

const listarCampanas = async(filtro) => {
    return await campanaModel.buscarCampanas(filtro);
};


const inicializarCampanasDesdeArchivo = async() => {
    const contenido = await fs.readFile(campanaDataPath, "utf8");
    const json_campanas = JSON.parse(contenido);
    return await campanaModel.reemplazarCampanas(json_campanas);
};

const detalleCampana = async(filtro) => {
  const detalle = await campanaModel.buscarCampanaPorId(filtro.id);
  return {
    results: detalle ? [detalle] : [],
  };
};

module.exports = {
    listarCampanas,
    inicializarCampanasDesdeArchivo,
    detalleCampana
};
