// src/utils/syncVariants.js
import { supabase } from '../config/supabase';

/**
 * Sincroniza product_variants con los talles/colores del producto.
 * Genera el producto cartesiano talles × colores.
 *
 * @param {number|string} productId
 * @param {string[]} sizes
 * @param {string[]} colors
 * @param {object} stockPorCombinacion - { "L|Negro": 10, "XL|Negro": 0, ... }
 * @param {number} stockTotalFallback - si no hay stockPorCombinacion, se reparte acá
 */
export async function syncProductVariants(
  productId,
  sizes = [],
  colors = [],
  stockPorCombinacion = {},
  stockTotalFallback = 0
) {
  try {
    if (!productId) throw new Error('productId requerido');

    const numericId = parseInt(productId, 10);
    if (isNaN(numericId)) throw new Error('productId debe ser numérico');

    const tallasLimpias = (sizes || [])
      .map((s) => String(s).trim())
      .filter(Boolean);

    const coloresLimpios = (colors || [])
      .map((c) => String(c).trim())
      .filter(Boolean);

    // 1. Borrar TODAS las variantes viejas del producto
    const { error: deleteError } = await supabase
      .from('product_variants')
      .delete()
      .eq('product_id', numericId);

    if (deleteError) throw deleteError;

    // 2. Si no hay talles ni colores, producto "único" → no insertamos
    if (tallasLimpias.length === 0 && coloresLimpios.length === 0) {
      console.log(`ℹ️ Producto ${numericId} sin variantes (Único).`);
      return { ok: true, count: 0 };
    }

    const tallasFinal = tallasLimpias.length > 0 ? tallasLimpias : ['Único'];
    const coloresFinal = coloresLimpios.length > 0 ? coloresLimpios : ['Único'];

    // 3. Producto cartesiano
    const combinaciones = [];
    for (const size of tallasFinal) {
      for (const color of coloresFinal) {
        combinaciones.push({ size, color, key: `${size}|${color}` });
      }
    }

    // 4. Repartir stock: si viene stockPorCombinacion, lo usamos.
    // Si no, repartimos stockTotalFallback equitativamente (o todo a la primera).
    const totalCombinaciones = combinaciones.length;
    const stockTotal = parseInt(stockTotalFallback, 10) || 0;
    let restante = stockTotal;

    const nuevasVariantes = combinaciones.map(({ size, color, key }, idx) => {
      let stock;

      if (stockPorCombinacion[key] !== undefined) {
        stock = parseInt(stockPorCombinacion[key], 10) || 0;
      } else if (stockTotal > 0) {
        // Repartir equitativamente
        const base = Math.floor(stockTotal / totalCombinaciones);
        const sobrante = stockTotal % totalCombinaciones;
        stock = base + (idx < sobrante ? 1 : 0);
      } else {
        stock = 0;
      }

      return {
        product_id: numericId,
        size,
        color,
        stock,
      };
    });

    // 5. Insertar todas juntas
    const { error: insertError } = await supabase
      .from('product_variants')
      .insert(nuevasVariantes);

    if (insertError) throw insertError;

    console.log(
      `✅ Sincronizadas ${nuevasVariantes.length} variantes para producto ${numericId}`
    );
    return { ok: true, count: nuevasVariantes.length };
  } catch (err) {
    console.error('❌ Error al sincronizar variantes:', err);
    return { ok: false, error: err.message || String(err) };
  }
}