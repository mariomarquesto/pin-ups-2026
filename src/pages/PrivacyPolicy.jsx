// src/pages/PrivacyPolicy.jsx
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {  FaShieldAlt } from 'react-icons/fa';
import { useEffect } from 'react';

const PrivacyPolicy = () => {

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible) {
          section.classList.add('animated');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="privacy-page" style={{ backgroundColor: '#fef6f0', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Hero Section */}
      <div className="privacy-hero text-center py-5" style={{ backgroundColor: '#f85606', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-particles" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} className="floating-heart" style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 3}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`
            }}>🔒</div>
          ))}
        </div>
        <Container>
          <h1 className="display-4 fw-bold mb-3 animate-on-scroll" style={{ animation: 'fadeInUp 0.8s ease' }}>🔐 Política de Privacidad</h1>
          <p className="lead mb-0 animate-on-scroll" style={{ animation: 'fadeInUp 0.8s ease 0.2s backwards' }}>Protegemos tus datos personales · Ley 25.326</p>
        </Container>
      </div>

      <Container className="py-5">
        
        {/* Introducción */}
        <Row className="mb-5 animate-on-scroll">
          <Col lg={12}>
            <div className="bg-white rounded-4 p-4 shadow-sm">
              <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>✨ Compromiso con tu privacidad</h3>
              <p>En <strong>Pin Ups</strong> valoramos tu confianza. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos tus datos personales, en cumplimiento con la <strong>Ley de Protección de Datos Personales N° 25.326</strong> y su Decreto Reglamentario 1558/2001.</p>
            </div>
          </Col>
        </Row>

        {/* Responsable */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>👤 Responsable del tratamiento</h3>
          <p><strong>Titular:</strong> Pin Ups</p>
          <p><strong>Domicilio:</strong> Buenos Aires 190, San Miguel de Tucumán, Tucumán, Argentina</p>
          <p><strong>Email:</strong> hola@pinups.com.ar</p>
          <p><strong>WhatsApp:</strong> +54 381 347-1147</p>
        </div>

        {/* Datos recopilados */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>📋 Datos que recopilamos</h3>
          <p>Podemos recopilar la siguiente información:</p>
          <ul>
            <li><strong>Datos identificatorios:</strong> Nombre, apellido, DNI</li>
            <li><strong>Datos de contacto:</strong> Email, teléfono, dirección</li>
            <li><strong>Datos de navegación:</strong> IP, tipo de dispositivo, páginas visitadas</li>
            <li><strong>Datos de compra:</strong> Historial de pedidos, preferencias de talles</li>
          </ul>
        </div>

        {/* Finalidad */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>🎯 Finalidad del tratamiento</h3>
          <p>Tus datos se utilizan para:</p>
          <ul>
            <li>Procesar tus pedidos y gestionar envíos</li>
            <li>Comunicarnos sobre novedades, promociones o seguimiento de compras</li>
            <li>Mejorar nuestros productos y servicios</li>
            <li>Cumplir con obligaciones fiscales y legales</li>
          </ul>
        </div>

        {/* Base legal */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>⚖️ Base legal</h3>
          <p>El tratamiento de tus datos se basa en:</p>
          <ul>
            <li>La ejecución del contrato de compra-venta</li>
            <li>Tu consentimiento expreso (ej. para recibir newsletters)</li>
            <li>Obligaciones legales (facturación, AFIP)</li>
          </ul>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>🍪 Cookies</h3>
          <p>Utilizamos cookies para mejorar tu experiencia de navegación. Podés deshabilitarlas en la configuración de tu navegador, aunque algunas funciones del sitio podrían verse afectadas.</p>
        </div>

        {/* Derechos ARCO */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>🔍 Tus derechos ARCO</h3>
          <p>Podés ejercer los derechos de <strong>Acceso, Rectificación, Cancelación y Oposición</strong> (derechos ARCO) enviando un email a <strong>hola@pinups.com.ar</strong> con el asunto &quot;Datos Personales&quot;. Tenemos 10 días hábiles para responder.</p>
        </div>

        {/* Seguridad */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>🛡️ Seguridad de los datos</h3>
          <p>Implementamos medidas técnicas y organizativas para proteger tu información contra acceso no autorizado, pérdida o alteración.</p>
        </div>

        {/* Transferencias */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>🔄 Transferencia de datos</h3>
          <p>No compartimos tus datos con terceros, excepto:</p>
          <ul>
            <li>Proveedores de servicios de pago y envíos (Mercado Pago, Andreani, Correo Argentino)</li>
            <li>Obligaciones legales (AFIP, fuerzas de seguridad)</li>
          </ul>
        </div>

        {/* Menores */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>🧸 Menores de edad</h3>
          <p>Nuestros productos están dirigidos a mayores de 18 años. No recopilamos conscientemente datos de menores.</p>
        </div>

        {/* Modificaciones */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>📝 Actualizaciones</h3>
          <p>Esta política puede modificarse ocasionalmente. La versión vigente está siempre disponible en este sitio.</p>
        </div>

        {/* Contacto */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>📞 Contacto para temas de privacidad</h3>
          <p>Si tenés preguntas sobre cómo manejamos tus datos, escribinos a <strong>hola@pinups.com.ar</strong> o llamanos al <strong>+54 381 347-1147</strong>.</p>
        </div>

        {/* Aceptación */}
        <div className="text-center mt-4 animate-on-scroll">
          <div className="p-4 rounded-4" style={{ background: 'linear-gradient(135deg, #f85606, #ff8c5a)', color: 'white' }}>
            <FaShieldAlt size={40} className="mb-3 opacity-50" />
            <p className="fs-5 fw-semibold">Tus datos están seguros con nosotras. 💖</p>
            <p className="mb-0 small">Última actualización: 9 de junio de 2026</p>
          </div>
        </div>

        {/* Botón volver */}
        <div className="text-center mt-5">
          <Link to="/">
            <button className="btn rounded-pill px-4 py-2" style={{ backgroundColor: '#f85606', color: 'white', border: 'none', transition: 'all 0.3s' }}>
              ← Volver a la tienda
            </button>
          </Link>
        </div>

      </Container>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .floating-heart {
          font-size: 24px;
          animation: float 3s infinite ease-in-out;
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease;
        }

        .animate-on-scroll.animated {
          opacity: 1;
          transform: translateY(0);
        }

        .privacy-hero {
          position: relative;
          overflow: hidden;
        }

        .btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important;
        }

        .rounded-4 {
          border-radius: 20px;
        }

        .shadow-sm {
          box-shadow: 0 5px 15px rgba(0,0,0,0.05) !important;
        }

        .shadow-sm:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(248,86,6,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;