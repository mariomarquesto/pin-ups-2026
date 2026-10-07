// Persistencia del CRM (etiquetas y notas) en Supabase, tabla `crm_clients`.
// Una fila por clienta, indexada por una clave estable (email normalizado o id).
import { supabase } from "../config/supabase";

const TABLA = "crm_clients";

export const clienteKey = (cliente) => {
  const email = (cliente?.email || "").trim().toLowerCase();
  if (email) return email;
  return (cliente?.profileId || cliente?.key || "sin-identificar").toString();
};

const vacio = () => ({ tags: [], notas: [] });

const normalizar = (row) => ({
  tags: Array.isArray(row?.tags) ? row.tags : [],
  notas: Array.isArray(row?.notas) ? row.notas : [],
});

export const getCrmData = async (cliente) => {
  const { data, error } = await supabase
    .from(TABLA)
    .select("tags, notas")
    .eq("client_key", clienteKey(cliente))
    .maybeSingle();
  if (error) throw error;
  return data ? normalizar(data) : vacio();
};

const upsert = async (cliente, patch) => {
  const payload = {
    client_key: clienteKey(cliente),
    nombre: cliente?.nombre || null,
    email: cliente?.email || null,
    telefono: cliente?.telefono || null,
    updated_at: new Date().toISOString(),
    ...patch,
  };
  const { data, error } = await supabase
    .from(TABLA)
    .upsert(payload, { onConflict: "client_key" })
    .select("tags, notas")
    .single();
  if (error) throw error;
  return normalizar(data);
};

export const addTag = async (cliente, tag, tagsActuales = []) => {
  const limpio = (tag || "").trim();
  if (!limpio) return tagsActuales;
  if (tagsActuales.some((t) => t.toLowerCase() === limpio.toLowerCase())) return tagsActuales;
  const { tags } = await upsert(cliente, { tags: [...tagsActuales, limpio] });
  return tags;
};

export const removeTag = async (cliente, tag, tagsActuales = []) => {
  const { tags } = await upsert(cliente, { tags: tagsActuales.filter((t) => t !== tag) });
  return tags;
};

export const addNota = async (cliente, texto, notasActuales = []) => {
  const limpio = (texto || "").trim();
  if (!limpio) return notasActuales;
  const nota = { id: Date.now(), texto: limpio, fecha: new Date().toISOString() };
  const { notas } = await upsert(cliente, { notas: [nota, ...notasActuales] });
  return notas;
};

export const removeNota = async (cliente, id, notasActuales = []) => {
  const { notas } = await upsert(cliente, { notas: notasActuales.filter((n) => n.id !== id) });
  return notas;
};
