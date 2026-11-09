// # Acceso a datos / operaciones directas en la DB (Data Access)

const Datastore = require('@seald-io/nedb');

const db = new Datastore({
  filename: './data/menu-opciones.db',
  autoload: true
});

function mapMenuOpciones(opciones) {
  if (!Array.isArray(opciones)) {
    throw new TypeError('El JSON debe ser un arreglo de opciones de menú');
  }

  const ids = new Set();
  const childOrder = new Map();

  for (const [index, opcion] of opciones.entries()) {
    if (!opcion || typeof opcion !== 'object' || Array.isArray(opcion)) {
      throw new TypeError(`La opción en la posición ${index} no es un objeto válido`);
    }
    if (opcion.id === undefined || opcion.id === null || String(opcion.id).length === 0) {
      throw new TypeError(`Falta un id válido en la posición ${index}`);
    }

    const id = String(opcion.id);
    if (ids.has(id)) {
      throw new TypeError(`El id "${id}" está duplicado`);
    }
    ids.add(id);

    if (!Array.isArray(opcion.children)) {
      throw new TypeError(`La propiedad children de "${id}" debe ser un arreglo`);
    }

    opcion.children.forEach((childId, order) => {
      const normalizedChildId = String(childId);
      if (!childOrder.has(normalizedChildId)) {
        childOrder.set(normalizedChildId, order);
      }
    });
  }

  return opciones.map((opcion, index) => {
    const id = String(opcion.id);
    if (typeof opcion.name !== 'string' || typeof opcion.slug !== 'string') {
      throw new TypeError(`La opción "${id}" debe tener name y slug de tipo texto`);
    }
    if (!Number.isInteger(opcion.depth) || opcion.depth < 0) {
      throw new TypeError(`La opción "${id}" debe tener un depth entero no negativo`);
    }
    if (!Number.isFinite(opcion.numContents) || !Number.isFinite(opcion.numContentsDescendants)) {
      throw new TypeError(`La opción "${id}" debe tener contadores numéricos`);
    }
    if (opcion.parent !== '-' && opcion.parent !== null && opcion.parent !== undefined &&
      typeof opcion.parent !== 'string' && typeof opcion.parent !== 'number') {
      throw new TypeError(`La opción "${id}" tiene un parent inválido`);
    }

    const documento = {
      _id: id,
      parent: opcion.parent === '-' || opcion.parent === undefined || opcion.parent === null
        ? null
        : String(opcion.parent),
      depth: opcion.depth,
      name: opcion.name,
      numContents: opcion.numContents,
      numContentsDescendants: opcion.numContentsDescendants,
      slug: opcion.slug,
      order: childOrder.get(id) ?? index
    };

    if (opcion.campaign !== undefined) {
      documento.campaign = opcion.campaign;
    }
    if (opcion.actionType !== undefined) {
      documento.actionType = opcion.actionType;
    }

    return documento;
  });
}

async function guardarMenuOpciones(opciones) {
  const documentos = mapMenuOpciones(opciones);
  for (const documento of documentos) {
    await db.updateAsync({ _id: documento._id }, documento, { upsert: true });
  }
  return documentos;
}

async function reemplazarMenuOpciones(opciones) {
  const documentos = mapMenuOpciones(opciones);

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

async function buscarMenuOpciones(query = {}) {
  const opciones = await db.findAsync(query);
  return opciones.sort((a, b) => a.depth - b.depth || a.order - b.order);
}

function buscarMenuOpcionPorId(id) {
  return db.findOneAsync({ _id: String(id) });
}

module.exports = {
  mapMenuOpciones,
  guardarMenuOpciones,
  reemplazarMenuOpciones,
  buscarMenuOpciones,
  buscarMenuOpcionPorId
};
