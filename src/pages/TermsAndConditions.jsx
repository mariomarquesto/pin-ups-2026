// src/pages/TermsAndConditions.jsx
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {  FaFileContract, FaLock, FaStore} from 'react-icons/fa';
import {  useEffect } from 'react';

const TermsAndConditions = () => {

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
    <div className="terms-page" style={{ backgroundColor: '#fef6f0', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Hero Section */}
      <div className="terms-hero text-center py-5" style={{ backgroundColor: '#f85606', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-particles" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} className="floating-heart" style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 3}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`
            }}>⚖️</div>
          ))}
        </div>
        <Container>
          <h1 className="display-4 fw-bold mb-3 animate-on-scroll" style={{ animation: 'fadeInUp 0.8s ease' }}>📜 Términos y Condiciones</h1>
          <p className="lead mb-0 animate-on-scroll" style={{ animation: 'fadeInUp 0.8s ease 0.2s backwards' }}>Última actualización: 9 de junio de 2026</p>
        </Container>
      </div>

      <Container className="py-5">
        
        {/* Introducción */}
        <Row className="mb-5 animate-on-scroll">
          <Col lg={12}>
            <div className="bg-white rounded-4 p-4 shadow-sm">
              <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>✨ Bienvenida a Pin Ups</h3>
              <p>Estos Términos y Condiciones regulan el uso de la tienda online y sucursal física de <strong>Pin Ups</strong> (en adelante &quot;el Establecimiento&quot;), ubicada en Buenos Aires 190, San Miguel de Tucumán, Tucumán, Argentina. Al realizar una compra, aceptás estos términos en su totalidad.</p>
            </div>
          </Col>
        </Row>

        {/* Información del vendedor */}
        <Row className="g-4 mb-5">
          <Col md={6}>
            <div className="bg-white rounded-4 p-4 shadow-sm h-100 animate-on-scroll">
              <FaStore size={30} style={{ color: '#f85606' }} className="mb-3" />
              <h4 className="fw-bold mb-3" style={{ color: '#f85606' }}>🏪 Datos del vendedor</h4>
              <p><strong>Razón Social:</strong> Pin Ups</p>
              <p><strong>Domicilio:</strong> Buenos Aires 190, San Miguel de Tucumán, Tucumán</p>
              <p><strong>Teléfono:</strong> +54 381 347-1147</p>
              <p><strong>Email:</strong> hola@pinups.com.ar</p>
              <p><strong>CUIL/CUIT:</strong> 27-12345678-9</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="bg-white rounded-4 p-4 shadow-sm h-100 animate-on-scroll">
              <FaLock size={30} style={{ color: '#f85606' }} className="mb-3" />
              <h4 className="fw-bold mb-3" style={{ color: '#f85606' }}>🔒 Seguridad y privacidad</h4>
              <p>Tus datos personales serán tratados conforme a nuestra <Link to="/privacy-policy">Política de Privacidad</Link>. Implementamos medidas de seguridad para proteger tu información.</p>
            </div>
          </Col>
        </Row>

        {/* Productos y talles */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>👗 Productos y talles especiales</h3>
          <p>Pin Ups se especializa en:</p>
          <ul>
            <li><strong>Ropa para talles reales:</strong> 1X, 2X, 3X, 4X, Plus S/M/L/XL</li>
            <li><strong>Calzado ancho especial:</strong> Ancho EE y EEE (para pies anchos)</li>
          </ul>
          <p>Te recomendamos consultar la <strong>Guía de Talles</strong> antes de comprar. Las medidas son orientativas; ante cualquier duda, contactanos.</p>
        </div>

        {/* Precios y formas de pago */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>💰 Precios y formas de pago</h3>
          <p>Todos los precios se expresan en <strong>Pesos Argentinos (ARS)</strong> e incluyen IVA. Los métodos de pago aceptados son:</p>
          <ul>
            <li>Efectivo (en sucursal)</li>
            <li>Tarjetas de crédito y débito (Visa, Mastercard, American Express)</li>
            <li>Mercado Pago</li>
            <li>Transferencia bancaria</li>
          </ul>
          <p>Pin Ups se reserva el derecho de modificar precios sin previo aviso.</p>
        </div>

        {/* Envíos */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>📦 Envíos</h3>
          <p>Realizamos envíos a todo el país a través de <strong>Correo Argentino y Andreani</strong>.</p>
          <ul>
            <li><strong>Envío gratis:</strong> Compras superiores a $70,000</li>
            <li><strong>Plazos de entrega:</strong> 3 a 7 días hábiles según ubicación</li>
            <li><strong>Envíos internacionales:</strong> No realizamos envíos fuera de Argentina por el momento</li>
          </ul>
          <p>Una vez procesado el pago, recibirás un número de seguimiento por email.</p>
        </div>

        {/* Cambios y devoluciones */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>🔄 Cambios y devoluciones</h3>
          <p>De acuerdo con la <strong>Ley de Defensa del Consumidor N° 24.240</strong> (modificada por Ley 26.994):</p>
          <ul>
            <li><strong>Plazo para cambios:</strong> 14 días corridos desde la recepción del producto</li>
            <li><strong>Condiciones:</strong> Producto sin uso, con etiquetas originales y packaging</li>
            <li><strong>Gastos de envío:</strong> Por cambio de talle o producto, los gastos de envío corren por cuenta del cliente</li>
            <li><strong>Productos defectuosos:</strong> Pin Ups se hace cargo del cambio y los gastos de envío</li>
          </ul>
          <p>Para gestionar un cambio, contactanos a hola@pinups.com.ar o por WhatsApp al +54 381 347-1147.</p>
        </div>

        {/* Garantía */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>🛡️ Garantía</h3>
          <p>Todos los productos ofrecen garantía de <strong>6 meses</strong> contra defectos de fabricación (Ley 24.240). En caso de falla, te reembolsaremos el 100% del valor o repondremos el producto.</p>
        </div>

        {/* Propiedad intelectual */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>©️ Propiedad intelectual</h3>
          <p>Todo el contenido de este sitio (imágenes, textos, logotipos, diseños) es propiedad de <strong>Pin Ups</strong>. Queda prohibida su reproducción sin autorización expresa.</p>
        </div>

        {/* Jurisdicción */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>⚖️ Jurisdicción</h3>
          <p>Cualquier controversia derivada de la compra será resuelta ante los tribunales ordinarios de la <strong>Ciudad de San Miguel de Tucumán, Provincia de Tucumán</strong>, Argentina.</p>
        </div>

        {/* Modificaciones */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>📝 Modificaciones</h3>
          <p>Pin Ups puede actualizar estos términos en cualquier momento. Te recomendamos revisarlos periódicamente.</p>
        </div>

        {/* Contacto */}
        <div className="bg-white rounded-4 p-4 shadow-sm mb-5 animate-on-scroll">
          <h3 className="fw-bold mb-3" style={{ color: '#f85606' }}>📞 Contacto</h3>
          <p>Si tenés dudas sobre estos términos, escribinos a:</p>
          <ul>
            <li><strong>Email:</strong> hola@pinups.com.ar</li>
            <li><strong>WhatsApp:</strong> +54 381 347-1147</li>
            <li><strong>Sucursal:</strong> Buenos Aires 190, San Miguel de Tucumán</li>
          </ul>
        </div>

        {/* Aceptación */}
        <div className="text-center mt-4 animate-on-scroll">
          <div className="p-4 rounded-4" style={{ background: 'linear-gradient(135deg, #f85606, #ff8c5a)', color: 'white' }}>
            <FaFileContract size={40} className="mb-3 opacity-50" />
            <p className="fs-5 fw-semibold">Al realizar una compra en Pin Ups, aceptás todos estos términos y condiciones.</p>
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

        .terms-hero {
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

export default TermsAndConditions;