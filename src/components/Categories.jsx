// src/components/Categories.jsx

import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Paleta chocolate Pin Ups
const THEME = {
  primary: '#3E2723',       // chocolate oscuro (marca principal)
  primaryDark: '#2D1B15',   // chocolate más oscuro (hover)
  background: '#FFFFFF',    // blanco puro
  backgroundAlt: '#F5F0EB', // blanco chocolate (fondo de sección)
  textPrimary: '#1A1A1A',   // negro suave
  textSecondary: '#4E342E', // chocolate medio para textos
  border: '#D7CCC8',        // chocolate claro para bordes
};

const Categories = () => {
  const categories = [
    { name: "Vestidos", icon: "👗", color: THEME.primary },
    { name: "Pantalones", icon: "👖", color: THEME.primaryDark },
    { name: "Remeras", icon: "👕", color: THEME.textSecondary },
    { name: "Camperas", icon: "🧥", color: THEME.primary },
    { name: "Calzado", icon: "👠", color: THEME.primaryDark },
    { name: "Accesorios", icon: "👜", color: THEME.textSecondary },
  ];

  return (
    <div className="py-4" style={{ backgroundColor: THEME.backgroundAlt }}>
      <Container>
        {/* Título decorativo */}
        <div className="text-center mb-4">
          <span
            className="d-inline-block px-4 py-1 rounded-pill small fw-semibold"
            style={{
              backgroundColor: THEME.primary,
              color: '#FFFFFF',
              letterSpacing: '2px',
            }}
          >
            EXPLORÁ POR CATEGORÍA
          </span>
        </div>

        <Row className="g-3 justify-content-center">
          {categories.map((cat, idx) => (
            <Col key={idx} xs={6} md={4} lg={2} className="text-center">
              <Link
                to={`/category/${cat.name.toLowerCase()}`}
                className="text-decoration-none"
              >
                <div
                  className="category-card p-3 rounded-4 h-100"
                  style={{
                    backgroundColor: THEME.background,
                    border: `1px solid ${THEME.border}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    className="category-icon mb-2"
                    style={{
                      fontSize: '2.2rem',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {cat.icon}
                  </div>
                  <h6
                    className="fw-semibold mb-0"
                    style={{
                      color: cat.color,
                      fontSize: '0.8rem',
                      letterSpacing: '0.5px',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {cat.name}
                  </h6>
                  <div
                    className="category-underline mx-auto mt-1"
                    style={{
                      width: '0px',
                      height: '2px',
                      backgroundColor: cat.color,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Estilos embebidos con efectos hover */}
      <style>{`
        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(62, 39, 35, 0.15);
          border-color: ${THEME.primary} !important;
        }

        .category-card:hover .category-icon {
          transform: scale(1.1);
        }

        .category-card:hover .category-underline {
          width: 30px !important;
        }

        .category-card:active {
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  );
};

export default Categories;