// src/routes/menuRoutes.js
const { Router } = require("express");
const menuController = require("../controllers/menuController");
const { strictRateLimiter } = require("../middlewares/rateLimiter");
const validate = require("../middlewares/validate");
const {
  idParamSchema,
  menuBodySchema,
} = require("../schemas/menuSchema");

const router = Router();

// 1. Obtener menú con o sin filtros (?idCategory=...&culture=...&depth=...)
router.get("/", menuController.obtenerMenu);

// 2. Obtener un elemento específico por su ID único de ruta (/api/menu-opciones/34)
router.get("/:id", validate(idParamSchema, 'params'), menuController.obtenerOpcionPorId);

// 3. Crear nueva opción de menú
router.post("/", validate(menuBodySchema, 'body'), menuController.crearOpcion);

// 4. Inicializar base de datos desde el JSON físico
router.post(
  "/inicicializar_bd",
  strictRateLimiter,
  menuController.inicializarBaseDatos
);

module.exports = router;