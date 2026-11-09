// # Configuración de Express, middlewares y rutas (el equivalente a Programa.cs en .NET)

const express = require('express');
const { globalRateLimiter } = require('./middlewares/rateLimiter');
const securityMiddleware = require('./middlewares/security');
const errorHandler = require('./middlewares/errorHandler');
const menuRoutes = require('./routes/menuRoutes');
const campanaRoutes = require('./routes/campanaRoutes');

const app = express();

// 1. Cabeceras HTTP de seguridad (Helmet) ANTES de cualquier ruta
app.use(securityMiddleware);

app.use('/api', globalRateLimiter); // Aplica limitador global a todas las rutas bajo /api


app.use(express.json({
    limit: '100kb',
    strict: true
}));

app.use(express.urlencoded({
    extended: true,
    limit: '100kb'
}));

// 2. Parser de JSON para procesar req.body
app.use(express.json());

// 3. Montaje de rutas de la feature
console.log(menuRoutes);
app.use('/api/menu-opciones', menuRoutes);
app.use('/api/campanas', campanaRoutes);

// 4. Manejador para rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// 5. Middleware centralizado de errores (al final de toda la cadena)
app.use(errorHandler);

module.exports = app;
