// # Middleware centralizado de errores (500, URIError, etc.)
const isProduction = process.env.NODE_ENV;

const errorHandler = (error, req, res, next) => {
  console.error(`[Error]: ${req.method} ${req.originalURL}: err`);

  if (error.code === "CORS_ORIGIN_DENIED") {
    return res.status(403).json({
      error: "Origen no permitido",
      mensaje: "Este origen no está autorizado para acceder a la API.",
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      error: "El cuerpo de la solicitud es demasiado grande > (100kb)",
    });
  }

  if (error instanceof URIError) {
    return res.status(400).json({ error: "ID inválido" });
  }

  if (error.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ error: "El cuerpo de la solicitud no contiene JSON válido" });
  }

  if (error.name === "ZodError") {
    return res.status(400).json({
      error: "Error de validacion en los datos enviados",
      detalles: error.issues.map((i) => ({
        campo: i.path.join("."),
        mensaje: i.message,
      })),
    });
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    error: isProduction
      ? " Ocurrio un error  intenro en el servidor"
      : error.message || "Error interno del servidor",
    ...(!isProduction && { stack: error.stack }),
  });
};

module.exports = errorHandler;
