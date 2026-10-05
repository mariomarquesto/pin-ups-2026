// src/pages/OrderConfirmation.jsx

import { Container, Row, Col, Button, Card, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaPrint,
  FaArrowLeft,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  const [orden, setOrden] = useState(null);
  const [confirmada, setConfirmada] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    const ultimaOrden = JSON.parse(
      localStorage.getItem("ultimaOrden")
    );

    if (ultimaOrden) {
      setOrden(ultimaOrden);
      // Si ya estaba confirmada previamente en esta sesión
      if (ultimaOrden.estado === "Confirmada" && ultimaOrden.dbSaved) {
        setConfirmada(true);
      }
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
    }).format(valor || 0);

  const confirmarPedido = async () => {
    setLoadingSave(true);
    try {
      const numeroOrdenFinal = orden.numeroOrden || `PU-${Date.now()}`;
      const fechaFinal = orden.fecha || new Date().toLocaleString("es-AR");

      const nuevaOrden = {
        ...orden,
        numeroOrden: numeroOrdenFinal,
        fecha: fechaFinal,
        estado: "Confirmada",
        dbSaved: true
      };

      // Guardar en Supabase para el panel de administración
      const payloadSupabase = {
        numero_orden: numeroOrdenFinal,
        fecha: fechaFinal,
        cliente: orden.cliente || {},
        productos: orden.productos || [orden.producto].filter(Boolean),
        subtotal: orden.subtotal || orden.total || 0,
        envio: orden.envio || 0,
        total: orden.total || 0,
        observaciones: orden.observaciones || '',
        estado: 'Confirmada'
      };

      const { error } = await supabase
        .from('orders')
        .insert([payloadSupabase]);

      if (error) {
        console.error('Error al guardar orden en Supabase:', error.message);
        alert('Hubo un error al registrar la orden en el servidor, pero se guardó localmente.');
      } else {
        console.log('✅ Orden guardada exitosamente en Supabase');
      }

      localStorage.setItem("ultimaOrden", JSON.stringify(nuevaOrden));
      localStorage.removeItem("cart"); // Limpiar carrito

      setOrden(nuevaOrden);
      setConfirmada(true);
    } catch (err) {
      console.error('Excepción al confirmar pedido:', err);
    } finally {
      setLoadingSave(false);
    }
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

  // Normalizar lista de productos (soporta compra de 1 producto o carrito múltiple)
  const listaProductos = orden.productos || (orden.producto ? [orden.producto] : []);

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
                Orden N°: <strong>{orden?.numeroOrden}</strong>
              </p>
            </div>

            <Card className="shadow-sm border-0 rounded-4 mb-4">
              <Card.Body className="p-4">
                <h4
                  className="fw-bold mb-3"
                  style={{ color: "#f85606" }}
                >
                  Datos del Cliente
                </h4>
                <Row className="mb-4">
                  <Col md={4}>
                    <p className="mb-1 text-muted small">Cliente</p>
                    <p className="fw-semibold">{orden?.cliente?.nombre || "No especificado"}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-1 text-muted small">Email</p>
                    <p className="fw-semibold">{orden?.cliente?.email || "No especificado"}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-1 text-muted small">Teléfono</p>
                    <p className="fw-semibold">{orden?.cliente?.telefono || "No especificado"}</p>
                  </Col>
                </Row>

                <h4
                  className="fw-bold mb-3"
                  style={{ color: "#f85606" }}
                >
                  Productos del Pedido
                </h4>
                
                <div className="table-responsive">
                  <Table className="align-middle mb-4">
                    <thead className="bg-light">
                      <tr>
                        <th>Producto</th>
                        <th className="text-center">Cant.</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaProductos.map((prod, idx) => (
                        <tr key={idx}>
                          <td>{prod.titulo || prod.name}</td>
                          <td className="text-center">{prod.cantidad || 1}</td>
                          <td className="text-end">{formatear(prod.subtotal || (prod.price * (prod.quantity || 1)))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {orden?.subtotal && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span>{formatear(orden?.subtotal)}</span>
                  </div>
                )}
                {orden?.envio !== undefined && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Envío</span>
                    <span>{orden?.envio === 0 ? "Gratis 🎉" : formatear(orden?.envio)}</span>
                  </div>
                )}

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

                <div className="mb-2">✅ Orden Generada</div>
                <div className="mb-2">
                  {confirmada ? "✅" : "⏳"} Datos Confirmados y Registrados en el Sistema
                </div>
                <div className="mb-2">⏳ Pago Pendiente</div>
                <div className="mb-2">⏳ Preparando Pedido</div>
                <div>⏳ Pedido Entregado</div>
              </Card.Body>
            </Card>

            <div className="d-flex gap-3 justify-content-center flex-wrap">
              {!confirmada && (
                <Button
                  onClick={confirmarPedido}
                  disabled={loadingSave}
                  size="lg"
                  style={{
                    backgroundColor: "#f85606",
                    borderColor: "#f85606",
                  }}
                >
                  {loadingSave ? "Guardando..." : "Confirmar Pedido"}
                </Button>
              )}

              {confirmada && (
                <Button
                  disabled
                  variant="success"
                  size="lg"
                >
                  ✅ Pedido Confirmado y Guardado en Base de Datos
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