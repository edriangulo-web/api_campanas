// # Helmet, rateLimit, headers

const helmet = require('helmet');

const securityMiddleware = helmet({
  // Desactiva X-Powered-By explícitamente para evitar fuga de información
  hidePoweredBy: true,

  // Anti-clickjacking: impide incrustar la app en iframes externos
  frameguard: { action: 'sameorigin' },

  // Anti-sniffing: fuerza al navegador a respetar estrictamente el Content-Type
  noSniff: true,

  // HSTS: obliga el uso de HTTPS por 1 año
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },

  // Content Security Policy (CSP): restringe los orígenes de carga de recursos
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"]
    }
  }
});

module.exports = securityMiddleware;