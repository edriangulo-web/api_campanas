const { z } = require("zod");

// Esquema para validar el parametro de ruta: id
const idParamSchema = z.object({
  id: z.string().trim().min(1, "El identidicaddor no puede estar vacio"),
});

// Esquema para validar la profundidad (/depth=:depth)
const depthParamSchema = z.object({
  depth: z.coerce
    .number()
    .int()
    .nonnegative("La profundidad debe ser un número entero no negativo"),
});

// Esquema unitario de una opción de menú
const opcionMenuSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1, " El nombre es obligatorio"),
  parent: z.string().nullable().optional(),
  depth: z.number().int().nonnegative().optional(),
  numContents: z.number().int().default(0),
  numContentsDescendants: z.number().int().default(0),
  slug: z.string().trim().optional(),
  order: z.number().int().default(0),
});

// Esquema para el cuerpo de POST /api/menu-opciones (acepta un objeto o un arreglo de opciones)
const menuBodySchema = z.union([
  opcionMenuSchema,
  z
    .array(opcionMenuSchema)
    .min(1, "El arreglo de opciones no puede estar vacío"),
]);

module.exports = {
  idParamSchema,
  depthParamSchema,
  opcionMenuSchema,
  menuBodySchema,
};
