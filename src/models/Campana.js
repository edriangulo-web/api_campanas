const Datastore = require('@seald-io/nedb');

const db = new Datastore({
  filename: './data/campanas.db',
  autoload: true
});

function mapCampanas(campanas) {
  if (!Array.isArray(campanas)) {
    throw new TypeError('Los datos deben ser un arreglo de categorías de campaña');
  }

  const ids = new Set();

  return campanas.map((campana, index) => {
    if (!campana || typeof campana !== 'object' || Array.isArray(campana)) {
      throw new TypeError(`La categoría en la posición ${index} no es un objeto válido`);
    }

    if ((typeof campana.id !== 'number' && typeof campana.id !== 'string') ||
      String(campana.id).trim().length === 0) {
      throw new TypeError(`Falta un id válido en la categoría de la posición ${index}`);
    }

    const id = String(campana.id);
    if (ids.has(id)) {
      throw new TypeError(`El id "${id}" está duplicado`);
    }
    ids.add(id);

    if (typeof campana.title !== 'string' || typeof campana.slug !== 'string' ||
      !Array.isArray(campana.categories) ||
      !campana.tracking || typeof campana.tracking !== 'object' || Array.isArray(campana.tracking) ||
      !campana.attributes || typeof campana.attributes !== 'object' || Array.isArray(campana.attributes) ||
      !campana.attributeArrays || typeof campana.attributeArrays !== 'object' ||
      Array.isArray(campana.attributeArrays)) {
      throw new TypeError(`La categoría "${id}" no tiene la estructura esperada`);
    }

    const { id: campanaId, ...datos } = campana;
    return { ...datos, _id: String(campanaId) };
  });
}

async function guardarCampanas(campanas) {
  const documentos = mapCampanas(campanas);

  for (const documento of documentos) {
    await db.updateAsync({ _id: documento._id }, documento, { upsert: true });
  }

  return documentos;
}

async function reemplazarCampanas(campanas) {
  const documentos = mapCampanas(campanas);

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

function buscarCampanas(query = {}) {
  return db.findAsync(query);
}

function buscarCampanaPorId(id) {
  return db.findOneAsync({ _id: String(id) });
}

module.exports = {
  mapCampanas,
  guardarCampanas,
  reemplazarCampanas,
  buscarCampanas,
  buscarCampanaPorId
};
