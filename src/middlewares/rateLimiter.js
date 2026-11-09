const rateLimit = require('express-rate-limit');

// 1. Limitador general para todas las rutas
const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 100, // Límite de 100 solicitudes por IP
    standardHeaders: true, // Devuelve información de límite en los headers
    legacyHeaders: false, // Desactiva los headers X-RateLimit-*
    message: {
        error: 'Demasiadas solicitudes desde esta IP, por favor intente nuevamente más tarde.'
    }
});

// 2.  Limitador estricto para operaciones sensibles/costosas
const strictRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    limit: 5, // Límite de 5 solicitudes por IP
    standardHeaders: 'draft-7', // Devuelve información de límite en los headers,
    legacyHeaders: false, // Desactiva los headers X-RateLimit-*
    message: {
        error: 'Demasiadas solicitudes para esta operación, por favor intente nuevamente más tarde.'
    }
});


module.exports = {
    globalRateLimiter,
    strictRateLimiter
};
