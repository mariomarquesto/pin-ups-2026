// src/pages/Location.jsx

import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaClock,
  FaPhoneAlt,
  FaEnvelope,
  FaHeart,
  FaInstagram,
  FaWhatsapp,
} from 'react-icons/fa';
import { useEffect } from 'react';

// Paleta chocolate Pin Ups
const THEME = {
  primary: "#3E2723",
  primaryDark: "#2D1B15",
  background: "#FFFFFF",
  backgroundAlt: "#F5F0EB",
  textPrimary: "#1A1A1A",
  textSecondary: "#4E342E",
  textMuted: "#8D6E63",
  border: "#D7CCC8",
  whatsapp: "#25D366",
};

const Location = () => {
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.reveal');
      sections.forEach((section) => {
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
    <div className="location-page" style={{ backgroundColor: THEME.backgroundAlt, minHeight: '100vh' }}>
      {/* Hero Section */}
      <div
        className="location-hero text-center py-5"
        style={{
          backgroundColor: THEME.primary,
          color: '#FFFFFF',
          minHeight: '250px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
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
            <div
              className="map-container rounded-4 overflow-hidden shadow-sm reveal"
              style={{
                height: '450px',
                border: `1px solid ${THEME.border}`,
              }}
            >
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
            <div
              className="contact-info rounded-4 p-4 shadow-sm reveal h-100"
              style={{
                backgroundColor: THEME.background,
                transitionDelay: '0.1s',
                border: `1px solid ${THEME.border}`,
              }}
            >
              <h3 className="fw-bold mb-4" style={{ color: THEME.primary }}>
                Información de contacto
              </h3>

              <div className="mb-4 d-flex align-items-start">
                <FaMapMarkerAlt
                  size={20}
                  style={{ color: THEME.primary }}
                  className="me-3 mt-1"
                />
                <div>
                  <h5 className="fw-bold mb-1" style={{ color: THEME.textPrimary }}>
                    Dirección
                  </h5>
                  <p className="mb-0" style={{ color: THEME.textMuted }}>
                    Buenos Aires 190<br />
                    San Miguel de Tucumán
                  </p>
                  <a
                    href="https://maps.google.com/maps?q=Buenos+Aires+190,+San+Miguel+de+Tucumán,+Tucumán"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none small"
                    style={{ color: THEME.primary }}
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              </div>

              <div className="mb-4 d-flex align-items-start">
                <FaClock
                  size={20}
                  style={{ color: THEME.primary }}
                  className="me-3 mt-1"
                />
                <div>
                  <h5 className="fw-bold mb-1" style={{ color: THEME.textPrimary }}>
                    Horarios
                  </h5>
                  <p className="mb-0" style={{ color: THEME.textMuted }}>
                    Lunes a Viernes: 10:00 - 20:00<br />
                    Sábados: 10:00 - 17:00
                  </p>
                </div>
              </div>

              <div className="mb-4 d-flex align-items-start">
                <FaPhoneAlt
                  size={20}
                  style={{ color: THEME.primary }}
                  className="me-3 mt-1"
                />
                <div>
                  <h5 className="fw-bold mb-1" style={{ color: THEME.textPrimary }}>
                    Teléfono
                  </h5>
                  <a
                    href={`tel:${telefono}`}
                    className="text-decoration-none"
                    style={{ color: THEME.textMuted }}
                  >
                    {telefono}
                  </a>
                </div>
              </div>

              <div className="mb-4 d-flex align-items-start">
                <FaEnvelope
                  size={20}
                  style={{ color: THEME.primary }}
                  className="me-3 mt-1"
                />
                <div>
                  <h5 className="fw-bold mb-1" style={{ color: THEME.textPrimary }}>
                    Email
                  </h5>
                  <a
                    href={`mailto:${email}`}
                    className="text-decoration-none"
                    style={{ color: THEME.textMuted }}
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div
                className="mt-3 pt-3 border-top"
                style={{ borderColor: THEME.border }}
              >
                <h5 className="fw-bold mb-2" style={{ color: THEME.primary }}>
                  Seguinos
                </h5>
                <div className="d-flex gap-3">
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                    style={{ color: THEME.primary }}
                  >
                    <FaInstagram size={24} />
                    <span className="ms-1 small">@pinupstucuman</span>
                  </a>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                    style={{ color: THEME.whatsapp }}
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
          <h2 className="fw-bold" style={{ color: THEME.primary }}>
            ¿Cómo llegar?
          </h2>
          <p style={{ color: THEME.textMuted }}>
            Diferentes opciones para que nos visites
          </p>
        </div>

        <Row className="g-4 mb-5">
          <Col md={4}>
            <div
              className="text-center p-4 rounded-4 shadow-sm h-100 reveal"
              style={{
                backgroundColor: THEME.background,
                transitionDelay: '0.1s',
                border: `1px solid ${THEME.border}`,
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚗</div>
              <h4 className="fw-bold" style={{ color: THEME.primary }}>
                En auto
              </h4>
              <p className="small" style={{ color: THEME.textMuted }}>
                Desde Av. Batalla de San Lorenzo, doblá en calle Buenos Aires.
                Estacionamiento en la zona.
              </p>
            </div>
          </Col>

          <Col md={4}>
            <div
              className="text-center p-4 rounded-4 shadow-sm h-100 reveal"
              style={{
                backgroundColor: THEME.background,
                transitionDelay: '0.2s',
                border: `1px solid ${THEME.border}`,
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚌</div>
              <h4 className="fw-bold" style={{ color: THEME.primary }}>
                En colectivo
              </h4>
              <p className="small" style={{ color: THEME.textMuted }}>
                Líneas 3, 10, 12, 6. Bajada en Batalla de San Lorenzo y Buenos
                Aires.
              </p>
            </div>
          </Col>

          <Col md={4}>
            <div
              className="text-center p-4 rounded-4 shadow-sm h-100 reveal"
              style={{
                backgroundColor: THEME.background,
                transitionDelay: '0.3s',
                border: `1px solid ${THEME.border}`,
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚶</div>
              <h4 className="fw-bold" style={{ color: THEME.primary }}>
                A pie
              </h4>
              <p className="small" style={{ color: THEME.textMuted }}>
                En pleno centro, a 3 cuadras de la Plaza Independencia. Fácil
                acceso peatonal.
              </p>
            </div>
          </Col>
        </Row>

        {/* Beneficios */}
        <div className="text-center mb-5 reveal">
          <h2 className="fw-bold" style={{ color: THEME.primary }}>
            Beneficios de visitarnos
          </h2>
          <p style={{ color: THEME.textMuted }}>
            Te esperamos con todo el amor Pin Ups
          </p>
        </div>

        <Row className="g-4 mb-5">
          {[
            { icon: '👗', title: 'Probate antes de comprar', sub: 'Vestidores amplios', delay: '0.1s' },
            { icon: '💳', title: 'Todos los medios de pago', sub: 'Tarjetas, efectivo', delay: '0.15s' },
            { icon: '🎁', title: 'Promos exclusivas', sub: 'Solo presencial', delay: '0.2s' },
            { icon: '☕', title: 'Cafecito de bienvenida', sub: 'Mientras mirás', delay: '0.25s' },
          ].map((item, idx) => (
            <Col md={3} key={idx}>
              <div
                className="text-center p-3 rounded-4 shadow-sm h-100 reveal"
                style={{
                  backgroundColor: THEME.background,
                  transitionDelay: item.delay,
                  border: `1px solid ${THEME.border}`,
                }}
              >
                <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                <p
                  className="fw-bold mb-0 small mt-2"
                  style={{ color: THEME.textPrimary }}
                >
                  {item.title}
                </p>
                <small style={{ color: THEME.textMuted }}>{item.sub}</small>
              </div>
            </Col>
          ))}
        </Row>

        {/* Frase motivacional */}
        <div className="text-center mt-5 reveal">
          <div
            className="p-5 rounded-4"
            style={{
              background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.primaryDark})`,
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                fontSize: '150px',
                opacity: 0.05,
                transform: 'rotate(15deg)',
              }}
            >
              👗
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                fontSize: '100px',
                opacity: 0.05,
                transform: 'rotate(-10deg)',
              }}
            >
              💖
            </div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  display: 'inline-block',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              >
                <FaHeart size={32} className="mb-3" />
              </div>

              <p className="fs-3 fw-light fst-italic mb-3">
                Te esperamos con las puertas abiertas<br />y el corazón ❤️
              </p>

              <div
                style={{
                  width: '60px',
                  height: '2px',
                  background: 'rgba(255,255,255,0.3)',
                  margin: '16px auto',
                }}
              />

              <div className="row justify-content-center g-3 mt-2">
                {['🕐 Lunes a Sábados', '📍 Buenos Aires 190', '👗 Probate sin compromiso'].map((txt, i) => (
                  <div className="col-auto" key={i}>
                    <div
                      className="px-3 py-1 rounded-pill"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        fontSize: '14px',
                      }}
                    >
                      {txt}
                    </div>
                  </div>
                ))}
              </div>

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
            <button
              className="btn rounded-pill px-4 py-2"
              style={{
                backgroundColor: THEME.primary,
                color: '#FFFFFF',
                border: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = THEME.primaryDark;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = THEME.primary;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ← Volver a la tienda
            </button>
          </Link>
        </div>
      </Container>

      <style>{`
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
          box-shadow: 0 2px 12px rgba(62, 39, 35, 0.08) !important;
        }

        .map-container {
          overflow: hidden;
          border-radius: 16px;
        }

        .contact-info,
        .bg-white {
          transition: all 0.3s ease;
        }

        .contact-info:hover,
        .bg-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(62, 39, 35, 0.15) !important;
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