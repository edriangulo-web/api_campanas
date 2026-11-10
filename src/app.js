// # Configuración de Express, middlewares y rutas (el equivalente a Programa.cs en .NET)

const express = require("express");
const cors = require("cors");
const { globalRateLimiter } = require("./middlewares/rateLimiter");
const securityMiddleware = require("./middlewares/security");
const errorHandler = require("./middlewares/errorHandler");
const menuRoutes = require("./routes/menuRoutes");
const campanaRoutes = require("./routes/campanaRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// 1. Cabeceras HTTP de seguridad (Helmet) ANTES de cualquier ruta
app.use(securityMiddleware);

const allowedOrigins = process.env.ALLOWED_ORIGINS ?
  process.env.ALLOWED_ORIGINS.split(",").map((item) => item.trim())
  : ["http://localhost:3000", "http://localhost:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    // Permite peticiones sin 'origin' (como Postman, apps móviles o curl) o peticiones que coincidan con la whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const error = new Error("No autorizado por la política de CORS");
      error.code = "CORS_ORIGIN_DENIED";
      callback(error);
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Habilitar si manejas cookies de sesión o Authorization headers
  optionsSuccessStatus: 200, // Compatibilidad con navegadores antiguos como IE11
};

// Aplicar el middleware de CORS antes de definir las rutas
app.use(cors(corsOptions));

app.use("/api", globalRateLimiter); // Aplica limitador global a todas las rutas bajo /api

app.use(
  express.json({
    limit: "100kb",
    strict: true,
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "100kb",
  }),
);

// 3. Montaje de rutas de la feature
console.log(menuRoutes);
app.use("/api/menu-opciones", menuRoutes);
app.use("/api/campanas", campanaRoutes);
app.use("/api/auth", authRoutes);

// 4. Manejador para rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint no encontrado" });
});

// 5. Middleware centralizado de errores (al final de toda la cadena)
app.use(errorHandler);

module.exports = app;
