const Datastore = require('@seald-io/nedb');

const db = new Datastore({
  filename: './data/campanas-detalle.db',
  autoload: true
});

function mapCampanasDetalle(respuestas) {
  if (!Array.isArray(respuestas)) {
    throw new TypeError('Los datos deben ser un arreglo de respuestas de detalle');
  }

  const detalles = [];
  const ids = new Set();

  for (const [index, respuesta] of respuestas.entries()) {
    if (!respuesta || typeof respuesta !== 'object' || Array.isArray(respuesta) ||
      !Array.isArray(respuesta.results)) {
      throw new TypeError(`La respuesta en la posición ${index} debe contener un arreglo results`);
    }

    for (const detalle of respuesta.results) {
      if (!detalle || typeof detalle !== 'object' || Array.isArray(detalle)) {
        throw new TypeError(`La respuesta en la posición ${index} contiene un detalle inválido`);
      }

      if ((typeof detalle.id !== 'number' && typeof detalle.id !== 'string') ||
        String(detalle.id).trim().length === 0) {
        throw new TypeError(`El detalle en la respuesta ${index} debe tener un id válido`);
      }

      const id = String(detalle.id);
      if (ids.has(id)) {
        throw new TypeError(`El id "${id}" está duplicado`);
      }
      ids.add(id);

      if (typeof detalle.title !== 'string' || typeof detalle.slug !== 'string' ||
        !Array.isArray(detalle.categories) ||
        !detalle.tracking || typeof detalle.tracking !== 'object' ||
        !detalle.attributes || typeof detalle.attributes !== 'object' ||
        !detalle.attributeArrays || typeof detalle.attributeArrays !== 'object') {
        throw new TypeError(`El detalle "${id}" no tiene la estructura esperada`);
      }

      const { id: detalleId, ...datos } = detalle;
      detalles.push({ ...datos, _id: String(detalleId) });
    }
  }

  return detalles;
}

async function guardarCampanasDetalle(respuestas) {
  const documentos = mapCampanasDetalle(respuestas);

  for (const documento of documentos) {
    await db.updateAsync({ _id: documento._id }, documento, { upsert: true });
  }

  return documentos;
}

async function reemplazarCampanasDetalle(respuestas) {
  const documentos = mapCampanasDetalle(respuestas);

  for (const documento of documentos) {
    await db.updateAsync({ _id: documento._id }, documento, { upsert: true });
  }

  const ids = new Set(documentos.map(documento => documento._id));
  const actuales = await db.findAsync({});
  const idsObsoletos = actuales
    .filter(documento => !ids.has(documento._id))
    .map(documento => documento._id);

  if (idsObsoletos.length > 0) {
    await db.removeAsync({ _id: { $in: idsObsoletos } }, { multi: true });
  }

  return documentos;
}

function buscarCampanasDetalle(query = {}) {
  return db.findAsync(query);
}

function buscarCampanaDetallePorId(id) {
  return db.findOneAsync({ _id: String(id) });
}

module.exports = {
  mapCampanasDetalle,
  guardarCampanasDetalle,
  reemplazarCampanasDetalle,
  buscarCampanasDetalle,
  buscarCampanaDetallePorId
};