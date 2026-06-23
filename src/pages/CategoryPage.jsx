// src/pages/CategoryPage.jsx
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import productList from "../data/products.json";

// Mapeo de nombres de categoría
const categoryNames = {
  vestidos: "Vestidos",
  pantalones: "Pantalones",
  remeras: "Remeras y Blusas",
  camperas: "Camperas y Abrigos",
  calzado: "Calzado",
  accesorios: "Accesorios",
};

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filtered = productList.filter(
      (product) =>
        product.category === categoryName ||
        product.category?.toLowerCase() === categoryName ||
        product.title.toLowerCase().includes(categoryName),
    );

    setFilteredProducts(filtered);
    setCategoryTitle(
      categoryNames[categoryName] ||
        categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1),
    );
    setLoading(false);
  }, [categoryName]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  return (
    <div
      className="py-4"
      style={{ backgroundColor: "#fef6f0", minHeight: "100vh" }}
    >
      <Container>
        {/* Header de categoría */}
        <div className="text-center mb-4">
          <h1 className="fw-bold" style={{ color: "#f85606" }}>
            {categoryTitle}
          </h1>
          <p className="text-muted">
            {filteredProducts.length} productos encontrados
          </p>
          
          {/* Botón Volver al inicio - MEJORADO */}
          <Link to="/" className="text-decoration-none">
            <div 
              className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill transition-all"
              style={{ 
                backgroundColor: '#f85606',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e04a00';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(248, 86, 6, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f85606';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>←</span>
              <span>Volver al inicio</span>
            </div>
          </Link>
        </div>

        {/* Productos */}
        {filteredProducts.length > 0 ? (
          <div className="d-flex flex-wrap justify-content-center gap-4 py-4">
            {filteredProducts.map((item) => {
              const precioConDescuento =
                item.price - item.price * item.discountPercentage * 0.01;
              const tieneDescuento =
                item.discountPercentage && item.discountPercentage > 0;
              const formatearPrecio = (precio) => {
                return new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(precio);
              };

              return (
                <Link
                  to={`/productdetails/${item.id}`}
                  key={item.id}
                  className="text-decoration-none product-link"
                  aria-label={`Ver detalles de ${item.title}`}
                >
                  <div
                    className="product-card h-100 border-0 shadow-sm"
                    style={{ width: "280px", transition: "transform 0.3s" }}
                  >
                    <div
                      className="img-container position-relative overflow-hidden"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px 8px 0 0",
                      }}
                    >
                      {tieneDescuento && (
                        <span className="badge-discount position-absolute top-0 end-0 m-2 px-2 py-1 bg-danger text-white rounded-pill small fw-bold">
                          -{item.discountPercentage}%
                        </span>
                      )}
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "220px",
                          objectFit: "cover",
                          padding: "12px",
                        }}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                    </div>

                    <div className="p-3">
                      <p className="text-muted small mb-1">{item.brand}</p>
                      <h6
                        className="fw-bold text-dark mb-2"
                        style={{
                          fontSize: "0.9rem",
                          height: "2.5rem",
                          overflow: "hidden",
                        }}
                      >
                        {item.title}
                      </h6>

                      {item.rating && (
                        <div className="d-flex align-items-center gap-1 mb-2">
                          <span className="text-warning">★</span>
                          <span className="small text-muted">
                            {item.rating}
                          </span>
                        </div>
                      )}

                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="fw-bold"
                          style={{ color: "#f85606", fontSize: "1.1rem" }}
                        >
                          {formatearPrecio(precioConDescuento)}
                        </span>
                        {tieneDescuento && (
                          <span className="text-decoration-line-through text-secondary small">
                            {formatearPrecio(item.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5">
            <h4 className="text-muted">No hay productos en esta categoría</h4>
            <p className="text-muted">Pronto tendremos novedades para vos ✨</p>
            <Link to="/">
              <div 
                className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill"
                style={{ 
                  backgroundColor: '#f85606',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e04a00'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f85606'}
              >
                <span>🛍️</span>
                <span>Seguir comprando</span>
              </div>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
};

export default CategoryPage;