// # Middleware centralizado de errores (500, URIError, etc.)

const errorHandler = (error, req, res, next) => {
  if (error.type === "entity.too.large") {
    return res
      .status(413)
      .json({
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
  console.error("Error procesando la solicitud:", error);
  res.status(500).json({ error: "Error interno del servidor" });
};

module.exports = errorHandler;
