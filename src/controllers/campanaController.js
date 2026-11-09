const campanaService = require('../services/campanaService');

const obtenerCampañas = async (req, res, next) => {
    try {
        const campanas = await campanaService.listarCampanas();
        res.status(200).json(campanas);
    }catch (error) {
        next(error);
    }
}


const inicializarBaseDatos = async (req, res, next) => {
    try {
        const campanas = await campanaService.inicializarCampanasDesdeArchivo();

        res.status(200).json({
            guardadas: campanas.length,
            campanas
        });        
    }catch (error) {
        next(error);
    }
}

const obtenerDetalleCampana = async (req, res, next) => {
    try {
        const id = req.params.id;
        const campanas = await campanaService.detalleCampana({ id });

        if(!campanas){
            res.status(404).json({ error: "Campaña no encontrada" });
        } else {
            res.status(200).json(campanas);
        }
    }catch (error) {
        next(error);
    }
};

const inicializarBaseDatosDetalle = async (req, res, next) => {
    try {
        const detalles_campanas = await campanaService.inicializarDetallesCampanasDesdeArchivo();

        res.status(200).json({
            guardadas: detalles_campanas.length,
            detalles_campanas
        });        
    }catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerCampañas,
    inicializarBaseDatos,
    obtenerDetalleCampana,
    inicializarBaseDatosDetalle
};
