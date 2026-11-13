const { ZodError } = require("zod");

const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    try {
      // Sanea y parsea (elimina los campos no definidos y castea tipos)
      const validData = schema.parse(req[source]);
      req[source] = validData;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Error de validación en la solicitud",
          detalles: error.issues.map((issue) => ({
            campo: issue.path.join("."),
            mensaje: issue.message,
          })),
        });
      }
      // Si es otro tipo de error inesperado, se delega al errorHandler central
      return next(error);
    }
  };

module.exports = validate;