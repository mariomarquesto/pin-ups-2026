// ==========================================
// CONFIGURACIÓN MAYORISTA DE TALLES Y COLORES
// ==========================================

// 1. CALZADO (Escala completa de numeración de calzado femenino/unisex)
export const SHOE_SIZES = [
  "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"
];

// 2. INDUMENTARIA / REMERAS / PANTALONES (Escala estándar y extendida de letras)
export const CLOTHING_SIZES = [
  "XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL", "XXXXXXL"
];

// 3. TALLES ESPECIALES / CURVY (Escala numérica del 1 al 10 para moldería especial)
export const SPECIAL_SIZES = [
  "Talle 1", "Talle 2", "Talle 3", "Talle 4", "Talle 5", 
  "Talle 6", "Talle 7", "Talle 8", "Talle 9", "Talle 10"
];

// 4. LENCERÍA Y CONJUNTOS INTIMOS (Combinación exacta de Corpiño + Talle equivalente de bombacha)
export const LINGERIE_SIZES = [
  "85 (Corpiño 85 / Talle 1)",
  "90 (Corpiño 90 / Talle 2)",
  "95 (Corpiño 95 / Talle 3)",
  "100 (Corpiño 100 / Talle 4)",
  "105 (Corpiño 105 / Talle 5)",
  "110 (Corpiño 110 / Talle 6)",
  "115 (Corpiño 115 / Talle 7)",
  "120 (Corpiño 120 / Talle 8)",
  "125 (Corpiño 125 / Talle 9)",
  "130 (Corpiño 130 / Talle 10)"
];

// 5. BOMBACHAS / ARTÍCULOS INTIMOS SUELTOS (Por si se venden por separado)
export const UNDERWEAR_INDIVIDUAL_SIZES = [
  "1 / S", "2 / M", "3 / L", "4 / XL", "5 / XXL", "6 / XXXL", "7 / Especial"
];

// 6. PALETA DE COLORES COMERCIAL MAYORISTA
export const PRODUCT_COLORS = [
  "Rojo", 
  "Azul", 
  "Amarillo", 
  "Chocolate", 
  "Verde", 
  "Blanco", 
  "Manteca", 
  "Plateado", 
  "Dorado", 
  "Rosa", 
  "Bordo", 
  "Camel", 
  "Beige", 
  "Celeste", 
  "Negro",
  "Gris Melange",
  "Fucsia",
  "Naranja",
  "Violeta",
  "Lila",
  "海军蓝 (Azul Marino)" // O Azul Marino comercial
];

// 7. CATEGORÍAS PRINCIPALES DEL MAYORISTA
export const STORE_CATEGORIES = [
  { id: 'lenceria', label: 'Lencería y Conjuntos' },
  { id: 'ropa', label: 'Indumentaria y Remeras' },
  { id: 'especial', label: 'Línea Especial / Curvy' },
  { id: 'calzado', label: 'Calzado' },
  { id: 'accesorios', label: 'Accesorios' }
];