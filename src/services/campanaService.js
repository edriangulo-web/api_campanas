const fs = require("node:fs/promises");
const path = require("node:path");
const campanaModel = require("../models/Campana");
const campanaDetalleModel = require("../models/CampanaDetalle");

const campanaDataPath = [
  path.join(
    __dirname,
    "..",
    "..",
    "resources",
    "Asociado o distribuidor Betterware.json",
  ),
  path.join(
    __dirname,
    "..",
    "..",
    "resources",
    "Cuenta Broxel.json",
  ),
  path.join(
    __dirname,
    "..",
    "..",
    "resources",
    "Invita y gana Betterware Familiares, amigos y conocidos.json",
  ),
];

const campanaDetalleDataPath = [
  path.join(
    __dirname,
    "..",
    "..",
    "resources",
    "details_Asociado o distribuidor Betterware.json",
  ),
  path.join(
    __dirname,
    "..",
    "..",
    "resources",
    "details_Cuenta Broxel.json",
  ),
  path.join(
    __dirname,
    "..",
    "..",
    "resources",
    "details_Invita y gana Betterware Familiares, amigos y conocidos.json",
  ),
];

const listarCampanas = async(filtro) => {
    return await campanaModel.buscarCampanas(filtro);
};


const inicializarCampanasDesdeArchivo = async() => {
    const json_campanas = [];

    for(const filePath of campanaDataPath) {
        const contenido = await fs.readFile(filePath, "utf8");
        json_campanas.push(JSON.parse(contenido));
    }

    return await campanaModel.reemplazarCampanas(json_campanas);
};

const detalleCampana = async(filtro) => {
  const detalle = await campanaDetalleModel.buscarCampanaDetallePorId(filtro.id);
  return {
    results: detalle ? [detalle] : [],
  };
}


const inicializarDetallesCampanasDesdeArchivo = async() => {
     const json_campanas_detalle = [];

    for(const filePath of campanaDetalleDataPath) {
        const contenido = await fs.readFile(filePath, "utf8");
        json_campanas_detalle.push(JSON.parse(contenido));
    }

    return await campanaDetalleModel.reemplazarCampanasDetalle(json_campanas_detalle);
};

module.exports = {
    listarCampanas,
    inicializarCampanasDesdeArchivo,
    detalleCampana,
    inicializarDetallesCampanasDesdeArchivo
};

