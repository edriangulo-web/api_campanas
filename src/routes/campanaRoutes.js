const { Router } = require("express");
const campanaController = require("../controllers/campanaController");
const router = Router();


// Campañas Routes
router.get("/listar_campanas", campanaController.obtenerCampañas);
router.post("/inicializar_bd", campanaController.inicializarBaseDatos);
router.get("/detalle_campana/:id", campanaController.obtenerDetalleCampana);
router.post("/detalle_campana", campanaController.inicializarBaseDatosDetalle);


module.exports = router;