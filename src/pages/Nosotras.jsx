// src/pages/AboutUs.jsx
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart, FaUsers, FaQuoteLeft, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useEffect } from 'react';

const NosotrasPage = () => {

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.reveal');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 80;
        if (isVisible) {
          setTimeout(() => {
            section.classList.add('visible');
          }, index * 60);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="about-us-page" style={{ backgroundColor: '#fef6f0', minHeight: '100vh' }}>
      
      {/* Hero Section */}
      <div className="about-hero text-center py-5" style={{ 
        backgroundColor: '#f85606', 
        color: 'white', 
        minHeight: '240px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Container>
          <h1 className="display-4 fw-bold mb-3 reveal">Sobre Nosotras</h1>
          <p className="lead mb-0 reveal" style={{ transitionDelay: '0.1s' }}>
            Moda para todas · Calzado cómodo · Amor propio
          </p>
        </Container>
      </div>

      <Container className="py-5">
        
        {/* Historia */}
        <Row className="align-items-center mb-5 g-4">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="rounded-4 overflow-hidden shadow-sm reveal">
              <img 
                src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600" 
                alt="Mujeres reales" 
                className="img-fluid w-100"
                style={{ height: '350px', objectFit: 'cover' }}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="p-3 reveal" style={{ transitionDelay: '0.1s' }}>
              <h2 className="fw-bold mb-3" style={{ color: '#f85606' }}>Nuestra historia</h2>
              <p className="fw-semibold" style={{ fontSize: '1.1rem' }}>
                Nacimos para que todas las mujeres se sientan hermosas, cómodas y seguras.
              </p>
              <p style={{ lineHeight: '1.8' }}>
                Pin Ups nació de la amistad y el sueño compartido de dos mujeres que saben lo que es buscar ropa que realmente les quede bien.
              </p>
              <p style={{ lineHeight: '1.8' }}>
                Cansadas de encontrar solo talles estándar y zapatos que aprietan, decidieron crear su propia marca: <strong style={{ color: '#f85606' }}>Pin Ups</strong>.
              </p>
              <p style={{ lineHeight: '1.8' }}>
                Hoy somos una comunidad que celebra la diversidad, los cuerpos reales y el estilo sin limitaciones.
              </p>
            </div>
          </Col>
        </Row>

        {/* Nuestro objetivo */}
        <div className="text-center mb-5 reveal" style={{ transitionDelay: '0.1s' }}>
          <div className="p-5 rounded-4" style={{ 
            background: 'linear-gradient(135deg, #f85606, #ff6b35)',
            color: 'white'
          }}>
            <FaHeart size={36} className="mb-3" />
            <h2 className="fw-bold mb-2">Nuestro objetivo</h2>
            <p className="fs-5 fw-light mb-0">
              Que cada mujer encuentre ropa y calzado que la haga sentir bien, sin tener que buscar en talles que no existen.
            </p>
          </div>
        </div>

        {/* Lo que ofrecemos */}
        <div className="text-center mb-5 reveal">
          <h2 className="fw-bold" style={{ color: '#f85606' }}>Lo que ofrecemos</h2>
          <p className="text-muted">Pensado para vos, para tu comodidad, para tu estilo</p>
        </div>

        <Row className="g-4 mb-5">
          <Col md={4}>
            <div className="text-center p-4 rounded-4 bg-white shadow-sm h-100 reveal" style={{ 
              transitionDelay: '0.1s',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
            }}
            >
              <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>👗</div>
              <h4 className="fw-bold" style={{ color: '#f85606' }}>Talles reales</h4>
              <p className="text-muted small">
                Ropa en talles 1X a 5XL, con cortes que abrazan sin apretar. Diseños pensados para cuerpos reales.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center p-4 rounded-4 bg-white shadow-sm h-100 reveal" style={{ 
              transitionDelay: '0.2s',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
            }}
            >
              <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>👠</div>
              <h4 className="fw-bold" style={{ color: '#f85606' }}>Calzado ancho especial</h4>
              <p className="text-muted small">
                Zapatos diseñados para pies anchos. Ancho EE y EEE. Comodidad sin renunciar al estilo.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center p-4 rounded-4 bg-white shadow-sm h-100 reveal" style={{ 
              transitionDelay: '0.3s',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
            }}
            >
              <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>💬</div>
              <h4 className="fw-bold" style={{ color: '#f85606' }}>Atención personalizada</h4>
              <p className="text-muted small">
                Te asesoramos por WhatsApp, mail o redes. Queremos que encuentres lo que buscás.
              </p>
            </div>
          </Col>
        </Row>

        {/* Fundadoras */}
        <div className="text-center mb-5 reveal">
          <h2 className="fw-bold" style={{ color: '#f85606' }}>Nuestras fundadoras</h2>
          <p className="text-muted">Dos amigas, un sueño, una pasión</p>
        </div>

        <Row className="g-4 mb-5">
          <Col md={6}>
            <div className="text-center p-4 rounded-4 bg-white shadow-sm h-100 reveal" style={{ 
              transitionDelay: '0.1s',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
            }}
            >
              <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" style={{ 
                width: '90px', height: '90px', 
                background: 'linear-gradient(135deg, #f85606, #ff6b35)'
              }}>
                <FaHeart size={35} color="white" />
              </div>
              <h3 className="fw-bold" style={{ color: '#f85606' }}>Ana</h3>
              <p className="text-muted" style={{ fontSize: '14px' }}>Diseñadora y creadora</p>
              <p style={{ fontSize: '14px', color: '#4a4a4a' }}>
                Diseño cada prenda pensando en la comodidad y el estilo. Que te sientas bien es mi prioridad.
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className="text-center p-4 rounded-4 bg-white shadow-sm h-100 reveal" style={{ 
              transitionDelay: '0.2s',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
            }}
            >
              <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" style={{ 
                width: '90px', height: '90px', 
                background: 'linear-gradient(135deg, #f85606, #ff6b35)'
              }}>
                <FaUsers size={35} color="white" />
              </div>
              <h3 className="fw-bold" style={{ color: '#f85606' }}>Ale</h3>
              <p className="text-muted" style={{ fontSize: '14px' }}>Gestora y atención al cliente</p>
              <p style={{ fontSize: '14px', color: '#4a4a4a' }}>
                Me aseguro de que cada cliente reciba la atención que merece. Escucho y ayudo a encontrar lo que necesitan.
              </p>
            </div>
          </Col>
        </Row>

        {/* Frase motivacional */}
        <div className="text-center mt-4 reveal">
          <div className="p-5 rounded-4" style={{ 
            background: 'linear-gradient(135deg, #f85606, #ff6b35)', 
            color: 'white'
          }}>
            <FaQuoteLeft size={36} className="mb-3 opacity-50" />
            <p className="fs-3 fst-italic">
              La moda no tiene talla. El estilo no tiene límite. Pin Ups es para todas.
            </p>
            <p className="mt-3 mb-0">Ana y Ale, fundadoras de Pin Ups</p>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="text-center mt-5 reveal" style={{ transitionDelay: '0.2s' }}>
          <h3 className="fw-bold" style={{ color: '#f85606' }}>Seguinos</h3>
          <div className="d-flex justify-content-center gap-4 mt-3">
            <a 
              href="https://instagram.com/pinupstucuman" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-decoration-none"
            >
              <div className="bg-white rounded-circle p-3 shadow-sm" style={{ 
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = 'scale(1.05)'; 
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(248,86,6,0.1)'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = 'scale(1)'; 
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; 
              }}
              >
                <FaInstagram size={26} style={{ color: '#f85606' }} />
              </div>
            </a>
            <a 
              href="https://wa.me/5493812071103" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-decoration-none"
            >
              <div className="bg-white rounded-circle p-3 shadow-sm" style={{ 
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = 'scale(1.05)'; 
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,211,102,0.1)'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = 'scale(1)'; 
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; 
              }}
              >
                <FaWhatsapp size={26} style={{ color: '#25D366' }} />
              </div>
            </a>
          </div>
        </div>

        {/* Botón volver */}
        <div className="text-center mt-5 reveal" style={{ transitionDelay: '0.3s' }}>
          <Link to="/">
            <button className="btn rounded-pill px-4 py-2" style={{ 
              backgroundColor: '#f85606', 
              color: 'white', 
              border: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.opacity = '1';
            }}
            >
              Volver a la tienda
            </button>
          </Link>
        </div>

      </Container>

      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.7s cubic-bezier(0.2, 0.9, 0.4, 1);
        }

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .rounded-4 {
          border-radius: 16px !important;
        }

        .shadow-sm {
          box-shadow: 0 2px 12px rgba(0,0,0,0.04) !important;
        }

        .bg-white {
          transition: all 0.3s ease;
        }

        .about-hero {
          position: relative;
          overflow: hidden;
        }

        .btn {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default NosotrasPage;