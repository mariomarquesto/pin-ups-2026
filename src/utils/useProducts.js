import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import productList from '../data/products.json';

// Fuente única de productos: Supabase primero, JSON local como respaldo.
// Evita que búsqueda/categorías usen una fuente distinta a la del Home.
export const useProducts = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!activo) return;
        if (!error && data && data.length > 0) {
          setProductos(data);
        } else {
          setProductos(productList);
        }
      } catch (err) {
        console.error('Supabase no disponible, usando JSON local:', err);
        if (activo) setProductos(productList);
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargar();
    return () => {
      activo = false;
    };
  }, []);

  return { productos, loading };
};
