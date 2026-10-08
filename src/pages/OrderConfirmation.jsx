// src/pages/OrderConfirmation.jsx

import { Container, Row, Col, Button, Card, Table, Badge, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaArrowLeft,
  FaShoppingBag,
  FaMoneyBillWave
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  const [orden, setOrden] = useState(null);
  const [confirmada, setConfirmada] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  // Estados de pago y entrega
  const [paymentMethod, setPaymentMethod] = useState("Transferencia");
  const [deliveryMethod, setDeliveryMethod] = useState("Retiro por sucursal");

  // Estados independientes para los descuentos configurados por el Admin
  const [cashDiscount, setCashDiscount] = useState(20);
  const [transferDiscount, setTransferDiscount] = useState(15);

  useEffect(() => {
    const ultimaOrden = JSON.parse(
      localStorage.getItem("ultimaOrden")
    );

    if (ultimaOrden) {
      setOrden(ultimaOrden);
      if (ultimaOrden.estado === "Confirmada" && ultimaOrden.dbSaved) {
        setConfirmada(true);
        if (ultimaOrden.paymentMethod) setPaymentMethod(ultimaOrden.paymentMethod);
        if (ultimaOrden.deliveryMethod) setDeliveryMethod(ultimaOrden.deliveryMethod);
      }
    } else {
      navigate("/");
    }

    // Cargar los porcentajes de descuento independientes desde Supabase
    const fetchDiscounts = async () => {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('key, value')
          .in('key', ['cash_discount', 'transfer_discount']);

        if (!error && data) {
          data.forEach(item => {
            if (item.key === 'cash_discount') {
              setCashDiscount(parseFloat(item.value) || 20);
            }
            if (item.key === 'transfer_discount') {
              setTransferDiscount(parseFloat(item.value) || 15);
            }
          });
        }
      } catch (err) {
        console.error("No se pudieron cargar los descuentos del admin:", err);
      }
    };

    fetchDiscounts();
  }, [navigate]);

  const formatear = (valor) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor || 0);

  // Calcular el total aplicando el descuento correspondiente
  const calcularTotalFinal = () => {
    if (!orden) return 0;
    const subtotalOriginal = orden.total || 0;
    
    if (paymentMethod === "Efectivo") {
      const descuento = (subtotalOriginal * cashDiscount) / 100;
      return Math.round(subtotalOriginal - descuento);
    } 
    
    if (paymentMethod === "Transferencia") {
      const descuento = (subtotalOriginal * transferDiscount) / 100;
      return Math.round(subtotalOriginal - descuento);
    }
    
    // Si es Tarjeta, queda el precio de lista original sin descuento
    return subtotalOriginal;
  };

  const totalFinal = calcularTotalFinal();

  const confirmarPedido = async () => {
    setLoadingSave(true);
    try {
      const numeroOrdenFinal = orden.numeroOrden || `PU-${Date.now()}`;
      const fechaFinal = orden.fecha || new Date().toLocaleString("es-AR");

      const payloadSupabase = {
        numero_orden: numeroOrdenFinal,
        fecha: fechaFinal,
        cliente: orden.cliente || {},
        productos: orden.productos || [orden.producto].filter(Boolean),
        subtotal: orden.total || 0,
        envio: orden.envio || 0,
        total: totalFinal,
        payment_method: paymentMethod,
        delivery_method: deliveryMethod,
        observaciones: orden.observaciones || '',
        estado: 'Confirmada'
      };

      const { error } = await supabase
        .from('orders')
        .insert([payloadSupabase]);

      if (error) {
        throw new Error(error.message);
      }

      console.log('✅ Orden guardada exitosamente en la Base de Datos');

      const nuevaOrden = {
        ...orden,
        numeroOrden: numeroOrdenFinal,
        fecha: fechaFinal,
        paymentMethod,
        deliveryMethod,
        total: totalFinal,
        estado: "Confirmada",
        dbSaved: true
      };

      localStorage.setItem("ultimaOrden", JSON.stringify(nuevaOrden));
      localStorage.removeItem("cart");

      setOrden(nuevaOrden);
      setConfirmada(true);
      alert("🎉 ¡Pedido confirmado y registrado correctamente en el servidor!");

    } catch (err) {
      console.error('Error crítico al registrar orden en Supabase:', err);
      alert('❌ Error al registrar el pedido en la Base de Datos. Por favor, verifica tu conexión e inténtalo nuevamente.');
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
          style={{ color: "#f85606" }}
        >
          <span className="visually-hidden">
            Cargando...
          </span>
        </div>
      </Container>
    );
  }

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
                color={confirmada ? "#28a745" : "#f85606"}
              />

              <h1
                className="fw-bold mt-3"
                style={{ color: "#f85606" }}
              >
                {confirmada ? "¡Pedido Confirmado en Base de Datos!" : "Finalizar tu Pedido"}
              </h1>

              <p className="text-muted">
                Orden N°: <strong>{orden?.numeroOrden}</strong> • Fecha: {orden?.fecha}
              </p>
            </div>

            {/* Datos del Cliente */}
            <Card className="shadow-sm border-0 rounded-4 mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3 text-secondary">
                  👤 Datos de Contacto
                </h5>
                <Row className="mb-0">
                  <Col md={4}>
                    <p className="mb-1 text-muted small">Cliente</p>
                    <p className="fw-semibold mb-2 mb-md-0">{orden?.cliente?.nombre || "No especificado"}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-1 text-muted small">Email</p>
                    <p className="fw-semibold mb-2 mb-md-0">{orden?.cliente?.email || "No especificado"}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-1 text-muted small">Teléfono</p>
                    <p className="fw-semibold mb-0">{orden?.cliente?.telefono || "No especificado"}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* SELECCIÓN DE FORMA DE PAGO Y MÉTODO DE ENTREGA */}
            {!confirmada && (
              <Card className="shadow-sm border-0 rounded-4 mb-4 border-start border-4 border-warning">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-3 text-secondary d-flex align-items-center gap-2">
                    <FaMoneyBillWave style={{ color: "#f85606" }} /> Forma de Pago y Envío
                  </h5>

                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small text-muted">
                          Forma de Pago
                        </Form.Label>
                        <Form.Select 
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="rounded-3 py-2"
                        >
                          <option value="Transferencia">Transferencia ({transferDiscount}% OFF)</option>
                          <option value="Efectivo">Abonando en Efectivo ({cashDiscount}% OFF)</option>
                          <option value="Tarjeta">Tarjeta (Precio de lista)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small text-muted">Método de Entrega</Form.Label>
                        <Form.Select 
                          value={deliveryMethod}
                          onChange={(e) => setDeliveryMethod(e.target.value)}
                          className="rounded-3 py-2"
                        >
                          <option value="Retiro por sucursal">Retiro por sucursal</option>
                          <option value="Envío por Correo Argentino">Envío por Correo Argentino</option>
                          <option value="Moto Uber">Moto Uber</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {confirmada && (
              <Card className="shadow-sm border-0 rounded-4 mb-4 bg-light">
                <Card.Body className="p-3 text-center">
                  <p className="mb-1">💳 <strong>Forma de Pago:</strong> {paymentMethod}</p>
                  <p className="mb-0">📦 <strong>Método de Entrega:</strong> {deliveryMethod}</p>
                </Card.Body>
              </Card>
            )}

            {/* Detalle de las Prendas */}
            <Card className="shadow-sm border-0 rounded-4 mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3 text-secondary d-flex align-items-center gap-2">
                  <FaShoppingBag style={{ color: "#f85606" }} /> Detalle de las Prendas Seleccionadas
                </h5>
                
                <div className="table-responsive">
                  <Table className="align-middle mb-4">
                    <thead className="bg-light">
                      <tr>
                        <th className="py-3">Prenda / Artículo</th>
                        <th className="text-center py-3">Talle / Color</th>
                        <th className="text-center py-3">Cant.</th>
                        <th className="text-end py-3">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaProductos.map((prod, idx) => (
                        <tr key={idx}>
                          <td className="fw-semibold text-dark">
                            {prod.titulo || prod.name}
                          </td>
                          <td className="text-center">
                            <div className="d-flex flex-column align-items-center gap-1">
                              <Badge bg="dark" className="px-2 py-1 fw-normal">
                                Talle: {prod.talle || prod.selectedSize || "Único"}
                              </Badge>
                              <Badge bg="secondary" className="px-2 py-1 fw-normal">
                                Color: {prod.color || prod.selectedColor || "Único"}
                              </Badge>
                            </div>
                          </td>
                          <td className="text-center fw-semibold">
                            {prod.cantidad || prod.quantity || 1}
                          </td>
                          <td className="text-end fw-bold" style={{ color: "#f85606" }}>
                            {formatear(prod.subtotal || (prod.precioUnitario || prod.price) * (prod.cantidad || prod.quantity || 1))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {paymentMethod === "Efectivo" && (
                  <div className="alert alert-success py-2 px-3 small mb-3">
                    ✨ ¡Descuento de efectivo del <strong>{cashDiscount}%</strong> aplicado correctamente!
                  </div>
                )}

                {paymentMethod === "Transferencia" && (
                  <div className="alert alert-success py-2 px-3 small mb-3">
                    ✨ ¡Descuento de transferencia del <strong>{transferDiscount}%</strong> aplicado correctamente!
                  </div>
                )}

                {paymentMethod === "Tarjeta" && (
                  <div className="alert alert-info py-2 px-3 small mb-3">
                    💳 Pago con <strong>Tarjeta</strong> (Precio de lista regular sin descuento).
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <h5 className="mb-0 text-secondary">Total a Abonar</h5>
                  <h3
                    className="fw-bold mb-0"
                    style={{ color: "#f85606" }}
                  >
                    {formatear(totalFinal)}
                  </h3>
                </div>
              </Card.Body>
            </Card>

            {/* Botones de acción */}
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              {!confirmada ? (
                <Button
                  onClick={confirmarPedido}
                  disabled={loadingSave}
                  size="lg"
                  className="rounded-pill px-5 fw-bold border-0 shadow-sm"
                  style={{ backgroundColor: "#f85606" }}
                >
                  {loadingSave ? "Registrando en Base de Datos..." : "✅ Confirmar Pedido en Servidor"}
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="lg"
                  className="rounded-pill px-5 fw-bold shadow-sm"
                  onClick={() => window.print()}
                >
                  🖨️ Imprimir Comprobante de Compra
                </Button>
              )}

              <Button
                variant="outline-dark"
                size="lg"
                className="rounded-pill px-4 fw-semibold"
                onClick={volverAlInicio}
              >
                <FaArrowLeft className="me-2" /> Volver a la tienda
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderConfirmation;