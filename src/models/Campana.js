const Datastore = require('@seald-io/nedb');

const db = new Datastore({
  filename: './data/campanas.db',
  autoload: true
});

function mapCampanas(campanas) {
  if (!Array.isArray(campanas)) {
    throw new TypeError('Los datos deben ser un arreglo de publicaciones');
  }

  const ids = new Set();

  return campanas.map((campana, index) => {
    if (!campana || typeof campana !== 'object' || Array.isArray(campana)) {
      throw new TypeError(`La publicación en la posición ${index} no es un objeto válido`);
    }

    if (typeof campana.id !== 'string' || campana.id.trim().length === 0) {
      throw new TypeError(`Falta un id válido en la publicación de la posición ${index}`);
    }

    if (ids.has(campana.id)) {
      throw new TypeError(`El id "${campana.id}" está duplicado`);
    }
    ids.add(campana.id);

    if (!campana.voucher || typeof campana.voucher !== 'object' || Array.isArray(campana.voucher)) {
      throw new TypeError(`La publicación "${campana.id}" debe tener un voucher válido`);
    }

    if (typeof campana.voucher.campaign !== 'string' ||
      typeof campana.voucher.campaign_id !== 'string') {
      throw new TypeError(`El voucher de "${campana.id}" debe tener campaign y campaign_id de tipo texto`);
    }

    const { id, ...datos } = campana;
    return { ...datos, _id: id };
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
