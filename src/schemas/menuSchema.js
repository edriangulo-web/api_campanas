// src/schemas/menuSchema.js
const { z } = require("zod");

const idParamSchema = z.object({
  id: z.string().trim().min(1, "El identificador no puede estar vacío"),
});

const depthParamSchema = z.object({
  depth: z.coerce
    .number()
    .int()
    .nonnegative("La profundidad debe ser un entero mayor o igual a 0"),
});

const opcionMenuSchema = z.object({
  // ✅ Acepta tanto número (0, 34) como string ("0", "34", "0:en-US")
  id: z.union([z.number().int(), z.string().trim().min(1)]).optional(),
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  parent: z.string().nullable().optional(),
  depth: z.number().int().nonnegative().optional(),
  children: z.array(z.string()).optional().default([]),
  numContents: z.number().int().default(0),
  numContentsDescendants: z.number().int().default(0),
  slug: z.string().trim().optional(),
  culture: z.string().trim().optional(),
  isActive: z.boolean().nullable().optional().default(true),
  actionType: z.string().nullable().optional(),
  campaign: z.string().nullable().optional(),
  contentId: z.number().int().nullable().optional(),
  icon: z.string().nullable().optional(),
  order: z.number().int().default(0),
});

const menuBodySchema = z.union([
  opcionMenuSchema,
  z.array(opcionMenuSchema).min(1, "Debe enviar al menos una opción en el arreglo"),
]);

module.exports = {
  idParamSchema,
  depthParamSchema,
  menuBodySchema,
};