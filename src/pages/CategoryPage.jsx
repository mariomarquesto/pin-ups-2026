import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../config/supabase";

// Mapeo de nombres de categoría amigables
const categoryNames = {
  vestidos: "Vestidos",
  pantalones: "Pantalones",
  remeras: "Remeras y Blusas",
  camperas: "Camperas y Abrigos",
  calzado: "Calzado",
  accesorios: "Accesorios",
  lenceria: "Lencería y Conjuntos",
  especial: "Línea Especial / Curvy"
};

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const searchTerm = categoryName?.toLowerCase() || '';

        // 1. Intentar buscar primero por la relación con la tabla 'categories' (si usa category_id)
        const { data: catData } = await supabase
          .from('categories')
          .select('id')
          .ilike('slug', `%${searchTerm}%`)
          .single();

        let query = supabase.from('products').select('*');

        if (catData) {
          query = query.eq('category_id', catData.id);
        } else {
          // Fallback: buscar por el campo de texto 'category' o nombre del producto
          query = query.or(`category.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        
        setFilteredProducts(data || []);
      } catch (err) {
        console.error("Error al cargar productos de la categoría:", err.message);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();

    setCategoryTitle(
      categoryNames[categoryName?.toLowerCase()] ||
        categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1),
    );
  }, [categoryName]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ color: '#f85606' }}>
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
          
          {/* Botón Volver al inicio */}
          <Link to="/" className="text-decoration-none">
            <div 
              className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill transition-all"
              style={{ 
                backgroundColor: '#f85606',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer'
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
              const imageUrl = Array.isArray(item.images) && item.images.length > 0 
                ? item.images[0] 
                : (item.images || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600');

              const precioOriginal = item.price || 0;
              const tieneDescuento = item.discountPercentage && item.discountPercentage > 0;
              const precioConDescuento = tieneDescuento 
                ? precioOriginal - precioOriginal * item.discountPercentage * 0.01 
                : precioOriginal;

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
                  aria-label={`Ver detalles de ${item.name}`}
                >
                  <div
                    className="product-card h-100 border-0 shadow-sm bg-white rounded-4 overflow-hidden"
                    style={{ width: "280px", transition: "transform 0.3s" }}
                  >
                    <div
                      className="img-container position-relative overflow-hidden"
                      style={{
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      {tieneDescuento && (
                        <span className="badge-discount position-absolute top-0 end-0 m-2 px-2 py-1 bg-danger text-white rounded-pill small fw-bold">
                          -{item.discountPercentage}%
                        </span>
                      )}
                      <img
                        src={imageUrl}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "220px",
                          objectFit: "cover",
                          padding: "12px",
                        }}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600";
                        }}
                      />
                    </div>

                    <div className="p-3">
                      <p className="text-muted small mb-1">{item.brand || "Pin Ups"}</p>
                      <h6
                        className="fw-bold text-dark mb-2"
                        style={{
                          fontSize: "0.9rem",
                          height: "2.5rem",
                          overflow: "hidden",
                        }}
                      >
                        {item.name}
                      </h6>

                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="fw-bold"
                          style={{ color: "#f85606", fontSize: "1.1rem" }}
                        >
                          {formatearPrecio(precioConDescuento)}
                        </span>
                        {tieneDescuento && (
                          <span className="text-decoration-line-through text-secondary small">
                            {formatearPrecio(precioOriginal)}
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
            <Link to="/" className="text-decoration-none mt-3 d-inline-block">
              <div 
                className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill"
                style={{ 
                  backgroundColor: '#f85606',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
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
} 

export default CategoryPage;