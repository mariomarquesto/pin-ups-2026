// src/pages/OrderConfirmation.jsx

import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaWhatsapp,
  FaPrint,
  FaArrowLeft,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  const [orden, setOrden] = useState(null);
  const [confirmada, setConfirmada] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const ultimaOrden = JSON.parse(
      localStorage.getItem("ultimaOrden")
    );

    if (ultimaOrden) {
      setOrden(ultimaOrden);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const formatear = (valor) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);

  const confirmarPedido = () => {
    const nuevaOrden = {
      ...orden,
      numeroOrden:
        orden.numeroOrden || `PU-${Date.now()}`,
      fecha:
        orden.fecha ||
        new Date().toLocaleString("es-AR"),
      estado: "Confirmada",
    };

    localStorage.setItem(
      "ultimaOrden",
      JSON.stringify(nuevaOrden)
    );

    setOrden(nuevaOrden);
    setConfirmada(true);
  };

  const enviarPorWhatsApp = () => {
    const telefonoEmpresa = "5493813471147";

    const mensaje = encodeURIComponent(`
🛍️ NUEVO PEDIDO PIN UPS

━━━━━━━━━━━━━━━━━━

📋 ORDEN:
${orden.numeroOrden}

📅 FECHA:
${orden.fecha}

👤 CLIENTE:
${orden?.cliente?.nombre || ""}

📞 TELÉFONO:
${orden?.cliente?.telefono || ""}

📧 EMAIL:
${orden?.cliente?.email || ""}

━━━━━━━━━━━━━━━━━━

🛒 PRODUCTO

${orden?.producto?.titulo || ""}

Cantidad: ${orden?.producto?.cantidad || 0}

Precio Unitario:
${formatear(
  orden?.producto?.precioUnitario || 0
)}

Subtotal:
${formatear(
  orden?.producto?.subtotal || 0
)}

━━━━━━━━━━━━━━━━━━

💰 TOTAL:
${formatear(orden?.total || 0)}

━━━━━━━━━━━━━━━━━━

📝 OBSERVACIONES:

${orden?.observaciones || "Sin observaciones"}

━━━━━━━━━━━━━━━━━━

Estado:
Pendiente de Confirmación
`);

    window.open(
      `https://wa.me/${telefonoEmpresa}?text=${mensaje}`,
      "_blank"
    );

    setEnviado(true);
  };

  const volverAlInicio = () => {
    localStorage.removeItem("ultimaOrden");
    navigate("/");
  };

  if (!orden) {
    return (
      <Container className="py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Cargando...
          </span>
        </div>
      </Container>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#fef6f0",
        minHeight: "100vh",
      }}
    >
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="text-center mb-4">
              <FaCheckCircle
                size={70}
                color="#28a745"
              />

              <h1
                className="fw-bold mt-3"
                style={{ color: "#f85606" }}
              >
                ¡Orden Generada con Éxito!
              </h1>

              <p className="text-muted">
                Revisá los datos antes de enviarlos
              </p>
            </div>

            <Card className="shadow-sm border-0 rounded-4 mb-4">
              <Card.Body className="p-4">
                <h4
                  className="fw-bold mb-4"
                  style={{ color: "#f85606" }}
                >
                  Resumen de la Orden
                </h4>

                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Cliente:</strong>{" "}
                      {orden?.cliente?.nombre}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {orden?.cliente?.email}
                    </p>

                    <p>
                      <strong>Teléfono:</strong>{" "}
                      {orden?.cliente?.telefono}
                    </p>
                  </Col>

                  <Col md={6}>
                    <p>
                      <strong>Producto:</strong>{" "}
                      {orden?.producto?.titulo}
                    </p>

                    <p>
                      <strong>Cantidad:</strong>{" "}
                      {orden?.producto?.cantidad}
                    </p>

                    <p>
                      <strong>Subtotal:</strong>{" "}
                      {formatear(
                        orden?.producto?.subtotal || 0
                      )}
                    </p>
                  </Col>
                </Row>

                <hr />

                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Total</h4>

                  <h3
                    className="fw-bold mb-0"
                    style={{ color: "#f85606" }}
                  >
                    {formatear(orden?.total || 0)}
                  </h3>
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 rounded-4 mb-4">
              <Card.Body>
                <h5 className="fw-bold mb-3">
                  Estado del Pedido
                </h5>

                <div>✅ Orden Generada</div>

                <div>
                  {confirmada ? "✅" : "⏳"} Datos
                  Confirmados
                </div>

                <div>
                  {enviado ? "✅" : "⏳"} Pedido
                  Enviado por WhatsApp
                </div>

                <div>⏳ Pago Pendiente</div>

                <div>⏳ Preparando Pedido</div>

                <div>⏳ Pedido Entregado</div>
              </Card.Body>
            </Card>

            <div className="d-flex gap-3 justify-content-center flex-wrap">
              {!confirmada && (
                <Button
                  onClick={confirmarPedido}
                  size="lg"
                  style={{
                    backgroundColor: "#f85606",
                    borderColor: "#f85606",
                  }}
                >
                  Confirmar Pedido
                </Button>
              )}

              {confirmada && !enviado && (
                <Button
                  onClick={enviarPorWhatsApp}
                  size="lg"
                  style={{
                    backgroundColor: "#25D366",
                    borderColor: "#25D366",
                  }}
                >
                  <FaWhatsapp className="me-2" />
                  Enviar por WhatsApp
                </Button>
              )}

              {enviado && (
                <Button
                  disabled
                  variant="success"
                  size="lg"
                >
                  ✅ Pedido Enviado
                </Button>
              )}

              <Button
                variant="outline-secondary"
                onClick={() => window.print()}
              >
                <FaPrint className="me-2" />
                Imprimir
              </Button>

              <Button
                variant="dark"
                onClick={volverAlInicio}
              >
                <FaArrowLeft className="me-2" />
                Volver a la tienda
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderConfirmation;