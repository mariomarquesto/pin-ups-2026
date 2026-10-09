// src/components/Product.jsx

import { useEffect, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useProducts } from '../utils/useProducts';
import { formatearPrecio, PLACEHOLDER_IMG } from '../utils/helpers';
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

function Product() {
  const { productos, loading } = useProducts();
  const cardsRef = useRef([]);

  // Función segura para extraer la URL limpia
  const getImageUrl = (item) => {
    let rawImg = null;

    if (Array.isArray(item.images) && item.images.length > 0) {
      rawImg = item.images[0];
    } else if (item.thumbnail) {
      rawImg = item.thumbnail;
    } else if (item.image) {
      rawImg = item.image;
    }

    if (!rawImg) return PLACEHOLDER_IMG;

    if (typeof rawImg === 'string') {
      const trimmed = rawImg.trim();
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        try {
          const parsed = JSON.parse(trimmed);
          return parsed.url || PLACEHOLDER_IMG;
        } catch (e) {
          return trimmed;
        }
      }
      return trimmed;
    }

    return PLACEHOLDER_IMG;
  };

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

  if (!productos || productos.length === 0) {
    return (
      <div className="text-center py-5">
        <p style={{ color: THEME.textMuted }}>No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className='d-flex flex-wrap justify-content-center gap-4 py-4'>
      {productos.map((item, index) => {
        const title = item.name || item.title || 'Producto';
        const price = item.price || 0;
        const imageUrl = getImageUrl(item);

        let discount = item.discountPercentage || item.discount_percentage || 0;
        if (!discount && item.compare_at_price && item.compare_at_price > price) {
          discount = Math.round(
            ((item.compare_at_price - price) / item.compare_at_price) * 100
          );
        }

        const finalPrice = price;
        const brand = item.brand || 'Pin-Ups Indumentaria';
        const rating = item.rating || 5;
        const productId = item.id;

        return (
          <div
            key={productId}
            ref={(el) => (cardsRef.current[index] = el)}
            className="card-cascade"
          >
            <Link to={`/productdetails/${productId}`} className='product-link'>
              <Card className='product-card h-100 border-0 shadow-sm'>
                <div className="img-container position-relative overflow-hidden">
                  {discount > 0 && (
                    <span
                      className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill small fw-bold"
                      style={{
                        backgroundColor: THEME.primary,
                        color: '#FFFFFF',
                        zIndex: 2,
                      }}
                    >
                      -{discount}%
                    </span>
                  )}
                  <Card.Img
                    variant="top"
                    src={imageUrl}
                    className='product-img'
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMG;
                    }}
                  />
                </div>

                <Card.Body className="d-flex flex-column">
                  {brand && (
                    <p
                      className="small mb-1"
                      style={{ color: THEME.textMuted }}
                    >
                      {brand}
                    </p>
                  )}

                  <Card.Title
                    className='fs-6 fw-bold mb-2'
                    style={{ color: THEME.textPrimary }}
                  >
                    {title}
                  </Card.Title>

                  {rating > 0 && (
                    <div className="d-flex align-items-center gap-1 mb-2">
                      <span style={{ color: THEME.primary }}>★</span>
                      <span className="small" style={{ color: THEME.textMuted }}>
                        {rating}
                      </span>
                    </div>
                  )}

                  <div className="mt-auto">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className='fw-bold price-pulse'
                        style={{ color: THEME.primary, fontSize: '1.2rem' }}
                      >
                        {formatearPrecio(finalPrice)}
                      </span>

                      {item.compare_at_price && item.compare_at_price > price && (
                        <span
                          className="text-decoration-line-through small"
                          style={{ color: THEME.textMuted }}
                        >
                          {formatearPrecio(item.compare_at_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default Product;