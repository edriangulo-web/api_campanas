// # Definición de endpoints y métodos (GET, POST)

const { Router } = require("express");
const menuController = require("../controllers/menuController");
const { strictRateLimiter } = require("../middlewares/rateLimiter");
const validate = require("../middlewares/validate");
const {
  idParamSchema,
  depthParamSchema,
  menuBodySchema,
} = require("../schemas/menuSchema");

const router = Router();


// Menu Routes
router.get("/", menuController.obtenerMenu);
router.get("/depth=:depth", validate(depthParamSchema, 'params') , menuController.obtenerMenuPorProfundidad);
router.get("/:id", validate(idParamSchema, 'params'), menuController.obtenerOpcionPorId);
router.post("/", validate(menuBodySchema, 'body'), menuController.crearOpcion);
router.post(
  "/inicicializar_bd",
  strictRateLimiter,
  menuController.inicializarBaseDatos,
);


module.exports = router;
