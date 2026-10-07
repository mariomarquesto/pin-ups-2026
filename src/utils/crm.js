// Persistencia local de datos propios del CRM (etiquetas y notas) por cliente.
// Se indexa por una clave estable (email normalizado o id) para sobrevivir
// recargas y actualizaciones del listado de pedidos.
const CRM_KEY = "crm_client_data";

const leer = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(CRM_KEY));
    if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw;
  } catch {
    /* localStorage corrupto: se ignora */
  }
  return {};
};

const escribir = (data) => {
  try {
    localStorage.setItem(CRM_KEY, JSON.stringify(data));
    return true;
  } catch {
    /* almacenamiento lleno o bloqueado */
    return false;
  }
};

export const clienteKey = (cliente) => {
  const email = (cliente?.email || "").trim().toLowerCase();
  if (email) return email;
  return (cliente?.profileId || cliente?.key || "sin-identificar").toString();
};

export const getCrmData = (cliente) => {
  const data = leer();
  return data[clienteKey(cliente)] || { tags: [], notas: [] };
};

export const getAllCrmData = () => leer();

const guardarCliente = (key, valor) => {
  const data = leer();
  data[key] = valor;
  escribir(data);
  return valor;
};

export const addTag = (cliente, tag) => {
  const limpio = tag.trim();
  if (!limpio) return getCrmData(cliente).tags;
  const actual = getCrmData(cliente);
  if (actual.tags.some((t) => t.toLowerCase() === limpio.toLowerCase())) return actual.tags;
  return guardarCliente(clienteKey(cliente), { ...actual, tags: [...actual.tags, limpio] }).tags;
};

export const removeTag = (cliente, tag) => {
  const actual = getCrmData(cliente);
  const tags = actual.tags.filter((t) => t !== tag);
  return guardarCliente(clienteKey(cliente), { ...actual, tags }).tags;
};

export const addNota = (cliente, texto) => {
  const limpio = texto.trim();
  if (!limpio) return getCrmData(cliente).notas;
  const actual = getCrmData(cliente);
  const nota = { id: Date.now(), texto: limpio, fecha: new Date().toISOString() };
  return guardarCliente(clienteKey(cliente), { ...actual, notas: [nota, ...actual.notas] }).notas;
};

export const removeNota = (cliente, id) => {
  const actual = getCrmData(cliente);
  const notas = actual.notas.filter((n) => n.id !== id);
  return guardarCliente(clienteKey(cliente), { ...actual, notas }).notas;
};
