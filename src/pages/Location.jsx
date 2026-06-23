// src/pages/Location.jsx
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaPhoneAlt, FaEnvelope, FaHeart, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useEffect } from 'react';

const Location = () => {

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.reveal');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible) {
          section.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const direccion = 'Buenos Aires 190, San Miguel de Tucumán, Tucumán, Argentina';
  const telefono = '+54 381 207-1103';
  const email = 'hola@pinups.com.ar';
  const instagram = 'https://www.instagram.com/pinupstucuman';
  const whatsapp = 'https://wa.me/5493812071103';

  const mapsUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(direccion)}`;

  return (
    <div className="location-page" style={{ backgroundColor: '#fef6f0', minHeight: '100vh' }}>
      
      {/* Hero Section */}
      <div className="location-hero text-center py-5" style={{ 
        backgroundColor: '#f85606', 
        color: 'white', 
        minHeight: '250px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Container>
          <h1 className="display-4 fw-bold mb-3">📍 Pin Ups Tucumán</h1>
          <p className="lead mb-0">Plus Size · Moda sin tallas</p>
          <p className="mt-2">Buenos Aires 190 · San Miguel de Tucumán</p>
        </Container>
      </div>

      <Container className="py-5">
        
        {/* Mapa y datos de contacto */}
        <Row className="g-4 mb-5">
          <Col lg={7}>
            <div className="map-container rounded-4 overflow-hidden shadow-sm reveal" style={{ height: '450px' }}>
              <iframe 
                src={mapsUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Pin Ups Tucumán"
              ></iframe>
            </div>
          </Col>
          <Col lg={5}>
            <div className="contact-info bg-white rounded-4 p-4 shadow-sm reveal h-100" style={{ transitionDelay: '0.1s' }}>
              <h3 className="fw-bold mb-4" style={{ color: '#f85606' }}>Información de contacto</h3>
              
              <div className="mb-4 d-flex align-items-start">
                <FaMapMarkerAlt size={20} style={{ color: '#f85606' }} className="me-3 mt-1" />
                <div>
                  <h5 className="fw-bold mb-1">Dirección</h5>
                  <p className="text-muted mb-0">
                    Buenos Aires 190<br />
                    San Miguel de Tucumán
                  </p>
                  <a 
                    href="https://maps.google.com/maps?q=Buenos+Aires+190,+San+Miguel+de+Tucumán,+Tucumán"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none small"
                    style={{ color: '#f85606' }}
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              </div>

              <div className="mb-4 d-flex align-items-start">
                <FaClock size={20} style={{ color: '#f85606' }} className="me-3 mt-1" />
                <div>
                  <h5 className="fw-bold mb-1">Horarios</h5>
                  <p className="text-muted mb-0">
                    Lunes a Viernes: 10:00 - 20:00<br />
                    Sábados: 10:00 - 17:00
                  </p>
                </div>
              </div>

              <div className="mb-4 d-flex align-items-start">
                <FaPhoneAlt size={20} style={{ color: '#f85606' }} className="me-3 mt-1" />
                <div>
                  <h5 className="fw-bold mb-1">Teléfono</h5>
                  <a href={`tel:${telefono}`} className="text-decoration-none text-muted">
                    {telefono}
                  </a>
                </div>
              </div>

              <div className="mb-4 d-flex align-items-start">
                <FaEnvelope size={20} style={{ color: '#f85606' }} className="me-3 mt-1" />
                <div>
                  <h5 className="fw-bold mb-1">Email</h5>
                  <a href={`mailto:${email}`} className="text-decoration-none text-muted">
                    {email}
                  </a>
                </div>
              </div>

              <div className="mt-3 pt-3 border-top" style={{ borderColor: '#f0e0d8' }}>
                <h5 className="fw-bold mb-2" style={{ color: '#f85606' }}>Seguinos</h5>
                <div className="d-flex gap-3">
                  <a 
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                    style={{ color: '#f85606' }}
                  >
                    <FaInstagram size={24} />
                    <span className="ms-1 small">@pinupstucuman</span>
                  </a>
                  <a 
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                    style={{ color: '#25D366' }}
                  >
                    <FaWhatsapp size={24} />
                    <span className="ms-1 small">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Cómo llegar */}
        <div className="text-center mb-5 reveal">
          <h2 className="fw-bold" style={{ color: '#f85606' }}>¿Cómo llegar?</h2>
          <p className="text-muted">Diferentes opciones para que nos visites</p>
        </div>

        <Row className="g-4 mb-5">
          <Col md={4}>
            <div className="text-center p-4 rounded-4 bg-white shadow-sm h-100 reveal" style={{ transitionDelay: '0.1s' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚗</div>
              <h4 className="fw-bold" style={{ color: '#f85606' }}>En auto</h4>
              <p className="text-muted small">Desde Av. Batalla de San Lorenzo, doblá en calle Buenos Aires. Estacionamiento en la zona.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center p-4 rounded-4 bg-white shadow-sm h-100 reveal" style={{ transitionDelay: '0.2s' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚌</div>
              <h4 className="fw-bold" style={{ color: '#f85606' }}>En colectivo</h4>
              <p className="text-muted small">Líneas 3, 10, 12, 6. Bajada en Batalla de San Lorenzo y Buenos Aires.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center p-4 rounded-4 bg-white shadow-sm h-100 reveal" style={{ transitionDelay: '0.3s' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚶</div>
              <h4 className="fw-bold" style={{ color: '#f85606' }}>A pie</h4>
              <p className="text-muted small">En pleno centro, a 3 cuadras de la Plaza Independencia. Fácil acceso peatonal.</p>
            </div>
          </Col>
        </Row>

        {/* Beneficios */}
        <div className="text-center mb-5 reveal">
          <h2 className="fw-bold" style={{ color: '#f85606' }}>Beneficios de visitarnos</h2>
          <p className="text-muted">Te esperamos con todo el amor Pin Ups</p>
        </div>

        <Row className="g-4 mb-5">
          <Col md={3}>
            <div className="text-center p-3 rounded-4 bg-white shadow-sm h-100 reveal" style={{ transitionDelay: '0.1s' }}>
              <div style={{ fontSize: '2rem' }}>👗</div>
              <p className="fw-bold mb-0 small mt-2">Probate antes de comprar</p>
              <small className="text-muted">Vestidores amplios</small>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-4 bg-white shadow-sm h-100 reveal" style={{ transitionDelay: '0.15s' }}>
              <div style={{ fontSize: '2rem' }}>💳</div>
              <p className="fw-bold mb-0 small mt-2">Todos los medios de pago</p>
              <small className="text-muted">Tarjetas, efectivo</small>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-4 bg-white shadow-sm h-100 reveal" style={{ transitionDelay: '0.2s' }}>
              <div style={{ fontSize: '2rem' }}>🎁</div>
              <p className="fw-bold mb-0 small mt-2">Promos exclusivas</p>
              <small className="text-muted">Solo presencial</small>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-4 bg-white shadow-sm h-100 reveal" style={{ transitionDelay: '0.25s' }}>
              <div style={{ fontSize: '2rem' }}>☕</div>
              <p className="fw-bold mb-0 small mt-2">Cafecito de bienvenida</p>
              <small className="text-muted">Mientras mirás</small>
            </div>
          </Col>
        </Row>

        {/* Frase motivacional y horarios especiales */}
        <div className="text-center mt-5 reveal">
          <div className="p-5 rounded-4" style={{ 
            background: 'linear-gradient(135deg, #f85606, #ff6b35)', 
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decoración de fondo sutil */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              fontSize: '150px',
              opacity: 0.05,
              transform: 'rotate(15deg)'
            }}>👗</div>
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              fontSize: '100px',
              opacity: 0.05,
              transform: 'rotate(-10deg)'
            }}>💖</div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              {/* Corazón animado */}
              <div style={{ 
                display: 'inline-block',
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                <FaHeart size={32} className="mb-3" />
              </div>

              {/* Frase principal */}
              <p className="fs-3 fw-light fst-italic mb-3">
                Te esperamos con las puertas abiertas<br />y el corazón ❤️
              </p>

              {/* Separador decorativo */}
              <div style={{
                width: '60px',
                height: '2px',
                background: 'rgba(255,255,255,0.3)',
                margin: '16px auto'
              }} />

              {/* Información adicional */}
              <div className="row justify-content-center g-3 mt-2">
                <div className="col-auto">
                  <div className="px-3 py-1 rounded-pill" style={{ 
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '14px'
                  }}>
                    🕐 Lunes a Sábados
                  </div>
                </div>
                <div className="col-auto">
                  <div className="px-3 py-1 rounded-pill" style={{ 
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '14px'
                  }}>
                    📍 Buenos Aires 190
                  </div>
                </div>
                <div className="col-auto">
                  <div className="px-3 py-1 rounded-pill" style={{ 
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '14px'
                  }}>
                    👗 Probate sin compromiso
                  </div>
                </div>
              </div>

              {/* Fundadoras */}
              <p className="mt-4 mb-0 small" style={{ opacity: 0.8 }}>
                — Ana y Ale, fundadoras de Pin Ups
              </p>
            </div>

            <style>{`
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
            `}</style>
          </div>
        </div>

        {/* Botón volver */}
        <div className="text-center mt-5 reveal" style={{ transitionDelay: '0.2s' }}>
          <Link to="/">
            <button className="btn rounded-pill px-4 py-2" style={{ 
              backgroundColor: '#f85606', 
              color: 'white', 
              border: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.opacity = '0.85';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              ← Volver a la tienda
            </button>
          </Link>
        </div>

      </Container>

      <style>{`
        /* Efecto reveal al hacer scroll */
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.2, 0.9, 0.4, 1);
        }

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .rounded-4 {
          border-radius: 16px !important;
        }

        .shadow-sm {
          box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important;
        }

        .map-container {
          overflow: hidden;
          border-radius: 16px;
        }

        .bg-white {
          transition: all 0.3s ease;
        }

        .bg-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.08) !important;
        }

        .btn {
          transition: all 0.3s ease;
        }

        .location-hero {
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Location;