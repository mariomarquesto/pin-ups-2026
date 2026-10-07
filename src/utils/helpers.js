// Utilidades compartidas: storage seguro, precios, descuentos y placeholder de imagen.

// Placeholder SVG embebido (no depende de servicios externos ni de archivos faltantes)
export const PLACEHOLDER_IMG =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
       <rect width="300" height="300" fill="#fef6f0"/>
       <circle cx="150" cy="120" r="45" fill="#f8c9b0"/>
       <rect x="80" y="175" width="140" height="80" rx="16" fill="#f8c9b0"/>
       <text x="150" y="285" font-family="sans-serif" font-size="18" fill="#f85606" text-anchor="middle">Pin Ups</text>
     </svg>`
  );

// JSON.parse protegido: nunca crashea con valores null o corruptos
export const safeParse = (raw, fallback = null) => {
  if (raw == null) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
};

export const getJSON = (key, fallback = null) =>
  safeParse(localStorage.getItem(key), fallback);

export const setJSON = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

// Usuario logueado actual (prefiere currentUser; retrocompatible con el objeto único "users")
export const getCurrentUser = () => {
  const current = getJSON('currentUser', null);
  if (current && typeof current === 'object') return current;
  const legacy = getJSON('users', null);
  if (legacy && !Array.isArray(legacy) && typeof legacy === 'object') return legacy;
  return null;
};

// Lista de usuarios registrados (migra el formato antiguo de objeto único a array)
export const getUsers = () => {
  const stored = getJSON('users', []);
  if (Array.isArray(stored)) return stored;
  if (stored && typeof stored === 'object') return [stored];
  return [];
};

export const saveUsers = (users) => setJSON('users', users);

// Descuento normalizado: acepta discountPercentage (carrito) y discount_percentage (Supabase)
export const getDiscountPct = (item) => {
  const value = item?.discountPercentage ?? item?.discount_percentage ?? 0;
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

export const calcFinalPrice = (item) => {
  const price = Number(item?.price) || 0;
  const discount = getDiscountPct(item);
  return discount > 0 ? Math.round(price - (price * discount) / 100) : price;
};

export const formatearPrecio = (valor) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);
