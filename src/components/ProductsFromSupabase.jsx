// src/components/ProductsFromSupabase.jsx

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import './Product.css';

// Paleta chocolate Pin Ups
const THEME = {
  primary: "#3E2723",       // chocolate oscuro
  primaryDark: "#2D1B15",   // chocolate más oscuro (hover)
  textPrimary: "#1A1A1A",   // negro suave
  textSecondary: "#4E342E", // chocolate medio
  textMuted: "#8D6E63",     // chocolate claro
  background: "#FFFFFF",
  backgroundAlt: "#F5F0EB",
};

const formatearPrecio = (precio) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
};

function ProductsFromSupabase({ limit = null, showRating = true, showBrand = true }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsRef = useRef([]);

  // Cargar productos desde Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) throw supabaseError;

        setProductos(data || []);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  // Efecto cascada con Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('card-visible');
          }, index * 100);
        }
      });
    }, { threshold: 0.1 });

    cardsRef.current.forEach((card) => card && observer.observe(card));

    return () => observer.disconnect();
  }, [productos]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          role="status"
          style={{ color: THEME.primary }}
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2" style={{ color: THEME.textMuted }}>
          Cargando colección Pin-Ups...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">Error: {error}</p>
        <button
          className="btn btn-outline-secondary mt-2"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-5">
        <p style={{ color: THEME.textMuted }}>No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-wrap justify-content-center gap-4 py-4">
      {productos.map((producto, index) => {
        const tieneDescuento = producto.discount_percentage > 0;
        const precioFinal = tieneDescuento
          ? Math.round(
              producto.price -
                (producto.price * producto.discount_percentage) / 100
            )
          : producto.price;

        return (
          <div
            key={producto.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="card-cascade"
          >
            <Link to={`/productdetails/${producto.id}`} className="product-link">
              <div className="product-card h-100 border-0 shadow-sm">
                <div className="img-container position-relative overflow-hidden">
                  {tieneDescuento && (
                    <span
                      className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill small fw-bold"
                      style={{
                        backgroundColor: THEME.primary,
                        color: '#FFFFFF',
                        zIndex: 2,
                      }}
                    >
                      -{producto.discount_percentage}%
                    </span>
                  )}
                  <img
                    src={producto.thumbnail}
                    alt={producto.title}
                    className="product-img p-3"
                    style={{
                      width: '100%',
                      height: '220px',
                      objectFit: 'cover',
                    }}
                    loading="lazy"
                  />
                </div>

                <div className="card-body d-flex flex-column p-3">
                  {showBrand && producto.brand && (
                    <p
                      className="small mb-1"
                      style={{ color: THEME.textMuted }}
                    >
                      {producto.brand}
                    </p>
                  )}

                  <h5
                    className="fs-6 fw-bold mb-2"
                    style={{ color: THEME.textPrimary }}
                  >
                    {producto.title}
                  </h5>

                  {showRating && producto.rating && (
                    <div className="d-flex align-items-center gap-1 mb-2">
                      <span style={{ color: THEME.primary }}>★</span>
                      <span className="small" style={{ color: THEME.textMuted }}>
                        {producto.rating}
                      </span>
                    </div>
                  )}

                  <div className="mt-auto">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="fw-bold price-pulse"
                        style={{ color: THEME.primary, fontSize: "1.2rem" }}
                      >
                        {formatearPrecio(precioFinal)}
                      </span>

                      {tieneDescuento && (
                        <span
                          className="text-decoration-line-through small"
                          style={{ color: THEME.textMuted }}
                        >
                          {formatearPrecio(producto.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

ProductsFromSupabase.propTypes = {
  limit: PropTypes.number,
  showRating: PropTypes.bool,
  showBrand: PropTypes.bool,
};

export default ProductsFromSupabase;