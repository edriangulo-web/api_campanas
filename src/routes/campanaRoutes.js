const { Router } = require("express");
const campanaController = require("../controllers/campanaController");
const { strictRateLimiter } = require("../middlewares/rateLimiter");
const authenticationToken = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const router = Router();

// Exige token JWT a todas las rutas de este router
router.use(authenticationToken);

// Consultas operativas
router.get("/", campanaController.obtenerCampañas);
router.get("/:id", campanaController.obtenerDetalleCampana);

// Operación restringida solo a ADMIN con rate limit estricto
router.post(
  "/inicializar_bd", 
  authorize('ADMIN'), 
  strictRateLimiter,
  campanaController.inicializarBaseDatos
);

module.exports = router;