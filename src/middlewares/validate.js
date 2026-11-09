const { ZodError } = require("zod");

const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    try {
      // Scanea y parsea (elimina los campos no definidos y castea tipos)
      const validData = schema.parse(req[source]);
      req[source] = validData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Error de validación en la solicitud",
          detalles: error.issues.map((issue) => ({
            campo: issue.path.join("."),
            mensaje: issue.message,
          })),
        });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
      next(error);
    }
  };


  module.exports = validate;
