const campanaService = require('../services/campanaService');

const obtenerCampañas = async (req, res, next) => {
    try {
        const filtros = {};
        const { categories } = req.query;

        if(categories !== undefined) filtros.categories = String(categories).trim();

        const campanas = await campanaService.listarCampanas(filtros);
        res.status(200).json({ results: campanas });
    }catch (error) {
        next(error);
    }
}


const inicializarBaseDatos = async (req, res, next) => {
    try {
        const campanas = await campanaService.inicializarCampanasDesdeArchivo();

        res.status(200).json({
            guardadas: campanas.length,
            results : campanas
        });        
    }catch (error) {
        next(error);
    }
}

const obtenerDetalleCampana = async (req, res, next) => {
    try {
        const id = req.params.id;
        const campanas = await campanaService.detalleCampana({ id });

        if(campanas.results.length === 0){
            res.status(404).json({ error: "Campaña no encontrada" });
        } else {
            res.status(200).json(campanas);
        }
    }catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerCampañas,
    inicializarBaseDatos,
    obtenerDetalleCampana
};
