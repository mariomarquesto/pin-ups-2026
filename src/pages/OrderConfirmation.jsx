// src/pages/OrderConfirmation.jsx

import { Container, Row, Col, Button, Card, Table, Badge, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaArrowLeft,
  FaShoppingBag,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";

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
  success: "#4CAF50",
  danger: "#D32F2F",
  info: "#1976D2",
  warning: "#FF9800",
};

const OrderConfirmation = () => {
  const navigate = useNavigate();

  const [orden, setOrden] = useState(null);
  const [confirmada, setConfirmada] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  // Estados de pago y entrega
  const [paymentMethod, setPaymentMethod] = useState("Transferencia");
  const [deliveryMethod, setDeliveryMethod] = useState("Retiro por sucursal");

  // Descuentos cargados desde la base de datos
  const [cashDiscount, setCashDiscount] = useState(30);
  const [transferDiscount, setTransferDiscount] = useState(15);
  const [discountsEnabled, setDiscountsEnabled] = useState(true);

  useEffect(() => {
    const ultimaOrden = JSON.parse(localStorage.getItem("ultimaOrden"));

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

    const fetchDiscounts = async () => {
      try {
        const { data, error } = await supabase
          .from("store_settings")
          .select("key, value");

        if (!error && data) {
          data.forEach((item) => {
            const key = item.key.toLowerCase();
            const val = item.value;

            if (key.includes("cash") || key.includes("efectivo")) {
              setCashDiscount(parseFloat(val) || 0);
            }
            if (key.includes("transfer") || key.includes("transferencia")) {
              setTransferDiscount(parseFloat(val) || 0);
            }
            if (key.includes("enabled")) {
              setDiscountsEnabled(val === "true" || val === true);
            }
          });
        }
      } catch (err) {
        console.error("Error al sincronizar descuentos del admin:", err);
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

  const calcularTotalFinal = () => {
    if (!orden) return 0;
    const subtotalOriginal = orden.total || 0;

    if (!discountsEnabled) return subtotalOriginal;

    if (paymentMethod === "Efectivo" && cashDiscount > 0) {
      const descuento = (subtotalOriginal * cashDiscount) / 100;
      return Math.round(subtotalOriginal - descuento);
    }

    if (paymentMethod === "Transferencia" && transferDiscount > 0) {
      const descuento = (subtotalOriginal * transferDiscount) / 100;
      return Math.round(subtotalOriginal - descuento);
    }

    return subtotalOriginal;
  };

  const totalFinal = calcularTotalFinal();

  const confirmarPedido = async () => {
    setLoadingSave(true);
    try {
      // Sanitizador para campos NOT NULL
      const safeStr = (v, fallback) => {
        const s = (v ?? "").toString().trim();
        return s.length > 0 ? s : fallback;
      };

      const payloadOrden = {
        customer_name: safeStr(orden?.cliente?.nombre, "Cliente Pin Ups"),
        customer_email: safeStr(orden?.cliente?.email, "sin-email@pinups.com"),
        customer_phone: safeStr(orden?.cliente?.telefono, "No especificado"),
        shipping_address: safeStr(deliveryMethod, "Retiro por sucursal"),
        total: Number(totalFinal) || 0,
        status: "Confirmada",
        payment_method: safeStr(paymentMethod, "Transferencia"),
        delivery_method: safeStr(deliveryMethod, "Retiro por sucursal"),
      };

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([payloadOrden])
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);
      if (!orderData) throw new Error("No se devolvió la orden insertada");

      const newOrderId = orderData.id;

      const listaPrendas =
        orden.productos || (orden.producto ? [orden.producto] : []);

      if (listaPrendas.length > 0) {
        const itemsPayload = listaPrendas.map((prod) => ({
          order_id: newOrderId,
          product_id:
            prod.id && !isNaN(prod.id) ? parseInt(prod.id) : null,
          quantity: parseInt(prod.cantidad || prod.quantity || 1, 10) || 1,
          price_at_purchase:
            prod.subtotal && (prod.cantidad || prod.quantity)
              ? prod.subtotal / (prod.cantidad || prod.quantity)
              : prod.precioUnitario || prod.price || 0,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(itemsPayload);

        if (itemsError) {
          console.error("Error al guardar ítems de la orden:", itemsError);
        }
      }

      const nuevaOrden = {
        ...orden,
        id: newOrderId,
        paymentMethod,
        deliveryMethod,
        total: totalFinal,
        estado: "Confirmada",
        dbSaved: true,
      };

      localStorage.setItem("ultimaOrden", JSON.stringify(nuevaOrden));
      localStorage.removeItem("cart");

      setOrden(nuevaOrden);
      setConfirmada(true);
      alert("🎉 ¡Pedido confirmado y registrado correctamente en el servidor!");
    } catch (err) {
      console.error("Error crítico al registrar orden en Supabase:", err);
      alert(
        "❌ Error al registrar el pedido en la Base de Datos:\n\n" +
          (err.message || "Revisá la consola para más detalles.")
      );
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
          className="spinner-border"
          role="status"
          style={{ color: THEME.primary }}
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  const listaProductos =
    orden.productos || (orden.producto ? [orden.producto] : []);

  return (
    <div style={{ backgroundColor: THEME.backgroundAlt, minHeight: "100vh" }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="text-center mb-4">
              <FaCheckCircle
                size={70}
                color={confirmada ? THEME.success : THEME.primary}
              />

              <h1 className="fw-bold mt-3" style={{ color: THEME.primary }}>
                {confirmada
                  ? "¡Pedido Confirmado en Base de Datos!"
                  : "Finalizar tu Pedido"}
              </h1>

              <p style={{ color: THEME.textMuted }}>
                N° de orden: <strong>{orden?.numeroOrden || "PIN-UP"}</strong> |
                Fecha: {orden?.fecha || "Hoy"}
              </p>
            </div>

            {/* Datos del Cliente */}
            <Card
              className="shadow-sm border-0 rounded-4 mb-4"
              style={{ backgroundColor: THEME.background }}
            >
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3" style={{ color: THEME.textSecondary }}>
                  👤 Datos de Contacto
                </h5>
                <Row className="mb-0 g-3">
                  <Col md={4}>
                    <p className="mb-1 small" style={{ color: THEME.textMuted }}>
                      Cliente
                    </p>
                    <p
                      className="fw-semibold mb-0"
                      style={{ color: THEME.textPrimary }}
                    >
                      {orden?.cliente?.nombre || "No especificado"}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-1 small" style={{ color: THEME.textMuted }}>
                      Correo electrónico
                    </p>
                    <p
                      className="fw-semibold mb-0 text-break"
                      style={{ color: THEME.textPrimary }}
                    >
                      {orden?.cliente?.email || "No especificado"}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-1 small" style={{ color: THEME.textMuted }}>
                      Teléfono
                    </p>
                    <p
                      className="fw-semibold mb-0"
                      style={{ color: THEME.textPrimary }}
                    >
                      {orden?.cliente?.telefono || "No especificado"}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Forma de pago y envío */}
            {!confirmada ? (
              <Card
                className="shadow-sm border-0 rounded-4 mb-4"
                style={{
                  backgroundColor: THEME.background,
                  borderLeft: `4px solid ${THEME.warning}`,
                }}
              >
                <Card.Body className="p-4">
                  <h5
                    className="fw-bold mb-3 d-flex align-items-center gap-2"
                    style={{ color: THEME.textSecondary }}
                  >
                    <FaMoneyBillWave style={{ color: THEME.primary }} /> Forma de
                    Pago y Envío
                  </h5>

                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label
                          className="fw-semibold small"
                          style={{ color: THEME.textMuted }}
                        >
                          Forma de Pago
                        </Form.Label>
                        <Form.Select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="rounded-3 py-2"
                          style={{ borderColor: THEME.border }}
                        >
                          <option value="Transferencia">
                            Transferencia ({transferDiscount}% de descuento)
                          </option>
                          <option value="Efectivo">
                            Abonando en Efectivo ({cashDiscount}% OFF)
                          </option>
                          <option value="Tarjeta">
                            Tarjeta (Precio de lista)
                          </option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label
                          className="fw-semibold small"
                          style={{ color: THEME.textMuted }}
                        >
                          Método de Entrega
                        </Form.Label>
                        <Form.Select
                          value={deliveryMethod}
                          onChange={(e) => setDeliveryMethod(e.target.value)}
                          className="rounded-3 py-2"
                          style={{ borderColor: THEME.border }}
                        >
                          <option value="Retiro por sucursal">
                            Retiro por sucursal
                          </option>
                          <option value="Envío por Correo Argentino">
                            Envío por Correo Argentino
                          </option>
                          <option value="Moto Uber">Moto Uber</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ) : (
              <Card
                className="shadow-sm border-0 rounded-4 mb-4"
                style={{ backgroundColor: THEME.backgroundAlt }}
              >
                <Card.Body className="p-3 text-center">
                  <p className="mb-1" style={{ color: THEME.textPrimary }}>
                    💳 <strong>Forma de Pago:</strong> {paymentMethod}
                  </p>
                  <p className="mb-0" style={{ color: THEME.textPrimary }}>
                    📦 <strong>Método de Entrega:</strong> {deliveryMethod}
                  </p>
                </Card.Body>
              </Card>
            )}

            {/* Detalle de Prendas */}
            <Card
              className="shadow-sm border-0 rounded-4 mb-4"
              style={{ backgroundColor: THEME.background }}
            >
              <Card.Body className="p-4">
                <h5
                  className="fw-bold mb-3 d-flex align-items-center gap-2"
                  style={{ color: THEME.textSecondary }}
                >
                  <FaShoppingBag style={{ color: THEME.primary }} /> Detalle de
                  las Prendas Seleccionadas
                </h5>

                <div className="table-responsive">
                  <Table className="align-middle mb-4">
                    <thead style={{ backgroundColor: THEME.backgroundAlt }}>
                      <tr>
                        <th className="py-3" style={{ color: THEME.textSecondary }}>
                          Prenda / Artículo
                        </th>
                        <th
                          className="text-center py-3"
                          style={{ color: THEME.textSecondary }}
                        >
                          Talle / Color
                        </th>
                        <th
                          className="text-center py-3"
                          style={{ color: THEME.textSecondary }}
                        >
                          Cant.
                        </th>
                        <th
                          className="text-end py-3"
                          style={{ color: THEME.textSecondary }}
                        >
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaProductos.map((prod, idx) => (
                        <tr key={idx}>
                          <td
                            className="fw-semibold"
                            style={{ color: THEME.textPrimary }}
                          >
                            {prod.titulo || prod.name}
                          </td>
                          <td className="text-center">
                            <div className="d-flex flex-column align-items-center gap-1">
                              <Badge
                                className="px-2 py-1 fw-normal"
                                style={{
                                  backgroundColor: THEME.primary,
                                  color: "#FFFFFF",
                                }}
                              >
                                Talle:{" "}
                                {prod.talle || prod.selectedSize || "Único"}
                              </Badge>
                              <Badge
                                className="px-2 py-1 fw-normal"
                                style={{
                                  backgroundColor: THEME.textMuted,
                                  color: "#FFFFFF",
                                }}
                              >
                                Color:{" "}
                                {prod.color || prod.selectedColor || "Único"}
                              </Badge>
                            </div>
                          </td>
                          <td
                            className="text-center fw-semibold"
                            style={{ color: THEME.textPrimary }}
                          >
                            {prod.cantidad || prod.quantity || 1}
                          </td>
                          <td
                            className="text-end fw-bold"
                            style={{ color: THEME.primary }}
                          >
                            {formatear(
                              prod.subtotal ||
                                (prod.precioUnitario || prod.price) *
                                  (prod.cantidad || prod.quantity || 1)
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {paymentMethod === "Efectivo" && cashDiscount > 0 && (
                  <div
                    className="py-2 px-3 small mb-3 rounded-3"
                    style={{
                      backgroundColor: "rgba(76, 175, 80, 0.1)",
                      color: THEME.success,
                      border: `1px solid ${THEME.success}`,
                    }}
                  >
                    ✨ ¡Descuento en efectivo del <strong>{cashDiscount}%</strong>{" "}
                    aplicado correctamente!
                  </div>
                )}

                {paymentMethod === "Transferencia" && transferDiscount > 0 && (
                  <div
                    className="py-2 px-3 small mb-3 rounded-3"
                    style={{
                      backgroundColor: "rgba(76, 175, 80, 0.1)",
                      color: THEME.success,
                      border: `1px solid ${THEME.success}`,
                    }}
                  >
                    ✨ ¡Descuento de transferencia del{" "}
                    <strong>{transferDiscount}%</strong> aplicado correctamente!
                  </div>
                )}

                {paymentMethod === "Tarjeta" && (
                  <div
                    className="py-2 px-3 small mb-3 rounded-3"
                    style={{
                      backgroundColor: "rgba(25, 118, 210, 0.1)",
                      color: THEME.info,
                      border: `1px solid ${THEME.info}`,
                    }}
                  >
                    💳 Pago con <strong>Tarjeta</strong> (Precio de lista regular
                    sin descuento).
                  </div>
                )}

                <div
                  className="d-flex justify-content-between align-items-center border-top pt-3"
                  style={{ borderColor: THEME.border }}
                >
                  <h5 className="mb-0" style={{ color: THEME.textSecondary }}>
                    Total a Abonar
                  </h5>
                  <h3 className="fw-bold mb-0" style={{ color: THEME.primary }}>
                    {formatear(totalFinal)}
                  </h3>
                </div>
              </Card.Body>
            </Card>

            {/* Botones */}
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              {!confirmada ? (
                <Button
                  onClick={confirmarPedido}
                  disabled={loadingSave}
                  size="lg"
                  className="rounded-pill px-5 fw-bold border-0 shadow-sm"
                  style={{
                    backgroundColor: THEME.primary,
                    color: "#FFFFFF",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = THEME.primaryDark)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = THEME.primary)
                  }
                >
                  {loadingSave
                    ? "Registrando en Base de Datos..."
                    : "✅ Confirmar Pedido en Servidor"}
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="rounded-pill px-5 fw-bold shadow-sm border-0"
                  style={{
                    backgroundColor: THEME.success,
                    color: "#FFFFFF",
                  }}
                  onClick={() => window.print()}
                >
                  🖨️ Imprimir Comprobante de Compra
                </Button>
              )}

              <Button
                size="lg"
                className="rounded-pill px-4 fw-semibold"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid ${THEME.primary}`,
                  color: THEME.primary,
                }}
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