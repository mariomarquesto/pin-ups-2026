// src/pages/HelpCenter.jsx
import { Container, Row, Col, Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaRuler,
  FaExchangeAlt,
  FaHeart,
  FaShoePrints,
  FaBoxOpen,
  FaCreditCard,
  FaUserCheck,
} from "react-icons/fa";
import { useEffect } from "react";

const HelpCenter = () => {
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".reveal");
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 80;
        if (isVisible) {
          setTimeout(() => {
            section.classList.add("visible");
          }, index * 60);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="help-page"
      style={{
        backgroundColor: "#fef6f0",
        minHeight: "100vh",
      }}
    >
      {/* Hero Section con partículas */}
      <div
        className="help-hero text-center py-5"
        style={{
          backgroundColor: "#f85606",
          color: "white",
          position: "relative",
          overflow: "hidden",
          minHeight: "240px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
          }}
        >
          {["❓", "✨", "❤️", "👗", "👠", "💖", "🌟"].map((emoji, i) => (
            <div
              key={i}
              className="particle"
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${20 + Math.random() * 30}px`,
                animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
        <Container style={{ position: "relative", zIndex: 2 }}>
          <h1 className="display-4 fw-bold mb-3 reveal">Centro de Ayuda</h1>
          <p className="lead mb-0 reveal" style={{ transitionDelay: "0.1s" }}>
            Estamos aquí para ayudarte con toda la info que necesitás
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Guía de Talles */}
        <div className="text-center mb-5 reveal">
          <h2 className="fw-bold" style={{ color: "#f85606" }}>
            👗 Guía de Talles Reales
          </h2>
          <p className="text-muted">
            Encontrá tu talle ideal · Diseñado para cuerpos reales
          </p>
        </div>

        <Row className="g-4 mb-5">
          <Col md={6}>
            <div
              className="bg-white rounded-4 p-4 shadow-sm h-100 reveal help-card"
              style={{
                transitionDelay: "0.1s",
              }}
            >
              <FaRuler
                size={36}
                style={{ color: "#f85606" }}
                className="mb-3"
              />
              <h4 className="fw-bold mb-3" style={{ color: "#f85606" }}>
                📏 Tabla de talles - Ropa
              </h4>
              <div className="table-responsive">
                <table className="table table-bordered text-center">
                  <thead style={{ backgroundColor: "#f85606", color: "white" }}>
                    <tr>
                      <th>Talle</th>
                      <th>Busto (cm)</th>
                      <th>Cintura (cm)</th>
                      <th>Cadera (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1X</td>
                      <td>102-107</td>
                      <td>86-91</td>
                      <td>112-117</td>
                    </tr>
                    <tr>
                      <td>2X</td>
                      <td>112-117</td>
                      <td>96-102</td>
                      <td>122-127</td>
                    </tr>
                    <tr>
                      <td>3X</td>
                      <td>122-127</td>
                      <td>107-112</td>
                      <td>132-137</td>
                    </tr>
                    <tr>
                      <td>4X</td>
                      <td>132-137</td>
                      <td>117-122</td>
                      <td>142-147</td>
                    </tr>
                    <tr>
                      <td>Plus S</td>
                      <td>95-100</td>
                      <td>80-85</td>
                      <td>100-105</td>
                    </tr>
                    <tr>
                      <td>Plus M</td>
                      <td>105-110</td>
                      <td>90-95</td>
                      <td>110-115</td>
                    </tr>
                    <tr>
                      <td>Plus L</td>
                      <td>115-120</td>
                      <td>100-105</td>
                      <td>120-125</td>
                    </tr>
                    <tr>
                      <td>Plus XL</td>
                      <td>125-130</td>
                      <td>110-115</td>
                      <td>130-135</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted small mt-2">
                ⚠️ Las medidas son orientativas. Consultanos si tenés dudas.
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div
              className="bg-white rounded-4 p-4 shadow-sm h-100 reveal help-card"
              style={{
                transitionDelay: "0.2s",
              }}
            >
              <FaShoePrints
                size={36}
                style={{ color: "#f85606" }}
                className="mb-3"
              />
              <h4 className="fw-bold mb-3" style={{ color: "#f85606" }}>
                👠 Calzado ancho especial
              </h4>
              <div className="table-responsive">
                <table className="table table-bordered text-center">
                  <thead style={{ backgroundColor: "#f85606", color: "white" }}>
                    <tr>
                      <th>Talle</th>
                      <th>Largo (cm)</th>
                      <th>Ancho</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>35</td>
                      <td>22.5</td>
                      <td rowSpan="8">
                        Ancho EE (Ancho especial)
                        <br />
                        Ancho EEE (Extra ancho)
                      </td>
                    </tr>
                    <tr><td>36</td><td>23.0</td></tr>
                    <tr><td>37</td><td>23.5</td></tr>
                    <tr><td>38</td><td>24.0</td></tr>
                    <tr><td>39</td><td>24.5</td></tr>
                    <tr><td>40</td><td>25.0</td></tr>
                    <tr><td>41</td><td>25.5</td></tr>
                    <tr><td>42</td><td>26.0</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted small mt-2">
                👣 ¿Pies anchos? Nuestro calzado tiene horma especial para mayor comodidad.
              </p>
            </div>
          </Col>
        </Row>

        {/* Cómo medirse correctamente */}
        <div
          className="bg-white rounded-4 p-4 shadow-sm mb-5 reveal help-card"
          style={{
            transitionDelay: "0.1s",
          }}
        >
          <h4 className="fw-bold mb-3" style={{ color: "#f85606" }}>
            📏 ¿Cómo tomar tus medidas?
          </h4>
          <Row>
            <Col md={4}>
              <div className="text-center p-3">
                <div style={{ fontSize: "2rem", animation: "float 3s ease-in-out infinite" }}>📐</div>
                <p className="fw-bold mb-1">Busto</p>
                <small className="text-muted">
                  Alrededor de la parte más ancha del pecho
                </small>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center p-3">
                <div style={{ fontSize: "2rem", animation: "float 3.5s ease-in-out infinite" }}>📍</div>
                <p className="fw-bold mb-1">Cintura</p>
                <small className="text-muted">
                  En la parte más angosta del torso
                </small>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center p-3">
                <div style={{ fontSize: "2rem", animation: "float 4s ease-in-out infinite" }}>📏</div>
                <p className="fw-bold mb-1">Cadera</p>
                <small className="text-muted">
                  Alrededor de la parte más ancha de la cadera
                </small>
              </div>
            </Col>
          </Row>
        </div>

        {/* Cambios y Devoluciones */}
        <div className="text-center mb-5 reveal">
          <h2 className="fw-bold" style={{ color: "#f85606" }}>
            🔄 Cambios y Devoluciones
          </h2>
          <p className="text-muted">Tu satisfacción es nuestra prioridad</p>
        </div>

        <Row className="g-4 mb-5">
          <Col md={4}>
            <div
              className="text-center p-4 rounded-4 bg-white shadow-sm h-100 reveal help-card"
              style={{
                transitionDelay: "0.1s",
              }}
            >
              <div style={{ animation: "float 3s ease-in-out infinite" }}>
                <FaExchangeAlt size={36} style={{ color: "#f85606" }} className="mb-3" />
              </div>
              <h4 className="fw-bold" style={{ color: "#f85606" }}>
                14 días de cambio
              </h4>
              <p className="text-muted small">
                Tenés 14 días corridos desde que recibís el producto para solicitar un cambio.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div
              className="text-center p-4 rounded-4 bg-white shadow-sm h-100 reveal help-card"
              style={{
                transitionDelay: "0.2s",
              }}
            >
              <div style={{ animation: "float 3.5s ease-in-out infinite" }}>
                <FaBoxOpen size={36} style={{ color: "#f85606" }} className="mb-3" />
              </div>
              <h4 className="fw-bold" style={{ color: "#f85606" }}>
                Condiciones
              </h4>
              <p className="text-muted small">
                Producto sin uso, con etiquetas originales y en su packaging.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div
              className="text-center p-4 rounded-4 bg-white shadow-sm h-100 reveal help-card"
              style={{
                transitionDelay: "0.3s",
              }}
            >
              <div style={{ animation: "float 4s ease-in-out infinite" }}>
                <FaCreditCard size={36} style={{ color: "#f85606" }} className="mb-3" />
              </div>
              <h4 className="fw-bold" style={{ color: "#f85606" }}>
                Reembolso
              </h4>
              <p className="text-muted small">
                Si el producto tiene falla, te devolvemos el 100% o reponemos sin cargo.
              </p>
            </div>
          </Col>
        </Row>

        {/* Preguntas frecuentes */}
        <div className="text-center mb-5 reveal">
          <h2 className="fw-bold" style={{ color: "#f85606" }}>
            ❓ Preguntas frecuentes
          </h2>
          <p className="text-muted">Lo que más nos consultan</p>
        </div>

        <Accordion
          defaultActiveKey="0"
          className="mb-5 reveal"
          style={{ transitionDelay: "0.1s" }}
        >
          {[
            { key: "0", question: "🚚 ¿Cuánto tarda el envío?", answer: "Los envíos tardan entre 3 a 7 días hábiles según tu ubicación. Envío gratis en compras superiores a $100,000." },
            { key: "1", question: "💳 ¿Qué medios de pago aceptan?", answer: "Aceptamos efectivo (en sucursal), tarjetas de crédito/débito, Mercado Pago y transferencia bancaria." },
            { key: "2", question: "👗 ¿Los talles son reales?", answer: "Sí, trabajamos con talles reales (1X a 4X, Plus S a Plus XL) diseñados especialmente para cuerpos reales. Consultá nuestra guía de talles." },
            { key: "3", question: "👠 ¿Los zapatos son anchos?", answer: "Sí, nuestro calzado está diseñado con horma ancha especial (EE y EEE). Ideales para pies anchos." },
            { key: "4", question: "🔄 ¿Puedo cambiar un producto?", answer: "Sí, tenés 14 días corridos para cambiar de talle o producto. Contactanos por WhatsApp o email para coordinar." },
            { key: "5", question: "📍 ¿Dónde está la sucursal?", answer: "Estamos en Buenos Aires 190, San Miguel de Tucumán. Te esperamos de lunes a viernes de 10 a 20hs, sábados de 10 a 17hs." },
          ].map((item) => (
            <Accordion.Item
              key={item.key}
              eventKey={item.key}
              style={{
                border: "none",
                marginBottom: "10px",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <Accordion.Header
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                }}
              >
                <strong>{item.question}</strong>
              </Accordion.Header>
              <Accordion.Body
                style={{
                  backgroundColor: "white",
                  borderRadius: "0 0 12px 12px",
                }}
              >
                {item.answer}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        {/* Contacto */}
        <div className="text-center mb-5 reveal">
          <h2 className="fw-bold" style={{ color: "#f85606" }}>
            📞 ¿Necesitás ayuda?
          </h2>
          <p className="text-muted">
            Estamos disponibles para resolver tus dudas
          </p>
        </div>

        <Row className="g-4 mb-5">
          <Col md={6}>
            <div
              className="text-center p-4 rounded-4 bg-white shadow-sm h-100 reveal help-card"
              style={{
                transitionDelay: "0.1s",
              }}
            >
              <div style={{ animation: "float 3s ease-in-out infinite" }}>
                <FaUserCheck size={36} style={{ color: "#f85606" }} className="mb-3" />
              </div>
              <h4 className="fw-bold" style={{ color: "#f85606" }}>
                📧 Email
              </h4>
              <p className="text-muted">hola@pinups.com.ar</p>
              <p className="small text-muted">Respondemos en menos de 24 horas hábiles</p>
            </div>
          </Col>
          <Col md={6}>
            <div
              className="text-center p-4 rounded-4 bg-white shadow-sm h-100 reveal help-card"
              style={{
                transitionDelay: "0.2s",
              }}
            >
              <div style={{ animation: "float 3.5s ease-in-out infinite" }}>
                <FaHeart size={36} style={{ color: "#f85606" }} className="mb-3" />
              </div>
              <h4 className="fw-bold" style={{ color: "#f85606" }}>
                📍 Sucursal
              </h4>
              <p className="text-muted">
                Buenos Aires 190, San Miguel de Tucumán
              </p>
              <p className="small text-muted">Lunes a Viernes 10-20hs · Sábados 10-17hs</p>
            </div>
          </Col>
        </Row>

        {/* Frase motivacional */}
        <div className="text-center mt-4 reveal">
          <div
            className="p-4 rounded-4"
            style={{
              background: "linear-gradient(135deg, #f85606, #ff6b35)",
              color: "white",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.01)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <div style={{ animation: "pulseIcon 2s ease-in-out infinite" }}>
              <FaHeart size={36} className="mb-3 opacity-75" />
            </div>
            <p className="fs-5 fw-semibold">
              Estamos acá para vos, siempre con una sonrisa y la mejor onda 💖
            </p>
            <p className="mb-0 small opacity-75">— El equipo de Pin Ups</p>
          </div>
        </div>

        {/* Botón volver */}
        <div className="text-center mt-5 reveal" style={{ transitionDelay: "0.2s" }}>
          <Link to="/">
            <button
              className="btn rounded-pill px-4 py-2"
              style={{
                backgroundColor: "#f85606",
                color: "white",
                border: "none",
                transition: "all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(248,86,6,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              ← Volver a la tienda
            </button>
          </Link>
        </div>
      </Container>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }

        @keyframes pulseIcon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .particle {
          pointer-events: none;
          animation: float 4s ease-in-out infinite;
        }

        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.7s cubic-bezier(0.2, 0.9, 0.4, 1);
        }

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .help-hero {
          position: relative;
          overflow: hidden;
        }

        .rounded-4 {
          border-radius: 16px !important;
        }

        .shadow-sm {
          box-shadow: 0 2px 12px rgba(0,0,0,0.04) !important;
        }

        /* ============================================
           BORDE VERDE EN CARDS - IGUAL QUE PRODUCTOS
           ============================================ */
        .help-card {
          border: 2px solid transparent !important;
          transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1) !important;
        }

        .help-card:hover {
          border-color: #4CAF50 !important;
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(76, 175, 80, 0.08) !important;
        }

        .bg-white {
          transition: all 0.4s ease;
        }

        .accordion-button:not(.collapsed) {
          background-color: #fef6f0;
          color: #f85606;
        }

        .accordion-button:focus {
          box-shadow: none;
          border-color: #f85606;
        }

        .accordion-button {
          transition: all 0.3s ease;
        }

        .accordion-button:hover {
          background-color: #fef6f0;
        }

        table {
          font-size: 0.85rem;
        }

        th, td {
          padding: 8px;
        }

        .btn {
          transition: all 0.4s ease;
        }
      `}</style>
    </div>
  );
};

export default HelpCenter;