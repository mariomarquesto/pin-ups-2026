// src/pages/admin/AdminOrders.jsx

import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Table, Button, Spinner, Form } from "react-bootstrap";
import { FaShoppingBag, FaArrowLeft, FaSyncAlt, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";

const BRAND = "#f85606";
const BRAND_DARK = "#e04a00";
const CREAM = "#fef6f0";

const ESTADOS = ["pendiente", "confirmada", "pagado", "enviado", "entregado", "cancelado"];

const estadoVariant = (estado) => {
  const e = (estado || "").toLowerCase();
  switch (e) {
    case "pagado":
    case "entregado":
    case "confirmada":
      return "success";
    case "enviado":
      return "info";
    case "cancelado":
      return "danger";
    default:
      return "warning";
  }
};

const formatearFecha = (orden) => {
  const cruda = orden?.date || orden?.created_at;
  if (!cruda) return "Sin fecha";
  const d = new Date(cruda);
  if (Number.isNaN(d.getTime())) return String(cruda);
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const nombreCliente = (orden) => {
  return orden?.customer_name || orden?.cliente?.nombre || orden?.customer_email || "Sin nombre";
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [orderItemsMap, setOrderItemsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // 1. Cargar pedidos de la tabla orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      setOrders(ordersData || []);

      // 2. Cargar los ítems relacionados de order_items junto con el nombre del producto
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select(`
          id,
          order_id,
          quantity,
          price_at_purchase,
          products (
            name,
            colors,
            sizes
          )
        `);

      if (!itemsError && itemsData) {
        const map = {};
        itemsData.forEach(item => {
          if (!map[item.order_id]) {
            map[item.order_id] = [];
          }
          map[item.order_id].push(item);
        });
        setOrderItemsMap(map);
      }
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleEstado = async (index, nuevoEstado) => {
    const target = orders[index];
    const updated = orders.map((o, i) => (i === index ? { ...o, status: nuevoEstado } : o));
    setOrders(updated);

    if (target?.id) {
      try {
        await supabase
          .from("orders")
          .update({ status: nuevoEstado })
          .eq("id", target.id);
      } catch (err) {
        console.error("Error al actualizar estado en Supabase:", err);
      }
    }
  };

  return (
    <Container fluid className="px-4 pb-5" style={{ backgroundColor: CREAM, minHeight: "100vh" }}>
      <Row className="align-items-center mb-4 pt-4">
        <Col>
          <h2 className="fw-bold d-flex align-items-center gap-2" style={{ color: BRAND_DARK }}>
            <FaShoppingBag style={{ color: BRAND }} /> Pedidos
          </h2>
          <p className="text-muted mb-0">Historial y gestión de compras realizadas en la tienda.</p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={loadOrders}
            className="d-flex align-items-center gap-1 rounded-pill px-3"
          >
            <FaSyncAlt /> Actualizar
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate("/admin")}
            className="d-flex align-items-center gap-1 rounded-pill px-3"
          >
            <FaArrowLeft /> Volver
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: BRAND }} />
        </div>
      ) : orders.length === 0 ? (
        <Card className="shadow-sm text-center py-5 border-0 rounded-4">
          <Card.Body>
            <h5 className="fw-bold" style={{ color: BRAND_DARK }}>
              Todavía no hay pedidos
            </h5>
            <p className="text-muted mb-0">Cuando un cliente compre, el pedido aparecerá acá automáticamente.</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {orders.map((orden, index) => {
            const estadoActual = orden.status || "Pendiente";
            const numeroOrdenMostrar = `ORD-${orden.id}`;
            const itemsDeEstaOrden = orderItemsMap[orden.id] || [];

            return (
              <Col key={orden.id} xs={12} className="mb-3">
                <Card className="shadow-sm border-0 rounded-4">
                  <Card.Body className="p-4">
                    <Row className="align-items-center g-3">
                      <Col md={3}>
                        <div className="fw-bold" style={{ color: BRAND_DARK }}>
                          #{numeroOrdenMostrar}
                        </div>
                        <div className="text-muted small">{formatearFecha(orden)}</div>
                      </Col>

                      <Col md={3}>
                        <div className="fw-semibold">{nombreCliente(orden)}</div>
                        <div className="text-muted small">
                          {orden.customer_email || "Sin email"}
                        </div>
                      </Col>

                      <Col md={2}>
                        <Badge bg={estadoVariant(estadoActual)} className="text-uppercase px-3 py-2">
                          {estadoActual}
                        </Badge>
                      </Col>

                      <Col md={2} className="fw-bold text-end fs-5" style={{ color: BRAND_DARK }}>
                        ${Number(orden.total || 0).toLocaleString("es-AR")}
                      </Col>

                      <Col md={2} className="text-end">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="rounded-pill px-3 d-inline-flex align-items-center gap-1"
                          onClick={() => setExpanded(expanded === index ? null : index)}
                        >
                          <FaEye /> {expanded === index ? "Ocultar" : "Ver detalles"}
                        </Button>
                      </Col>
                    </Row>

                    {expanded === index && (
                      <>
                        <hr className="my-4" />
                        <Row className="g-4">
                          <Col md={6}>
                            <h6 className="fw-bold mb-2" style={{ color: BRAND_DARK }}>
                              👤 Información del Cliente
                            </h6>
                            <div className="text-muted small bg-light p-3 rounded-3">
                              <div><strong>Nombre:</strong> {nombreCliente(orden)}</div>
                              <div><strong>Email:</strong> {orden.customer_email || "Sin email"}</div>
                              <div><strong>Teléfono:</strong> {orden.customer_phone || "No especificado"}</div>
                              <div><strong>Método de Pago:</strong> {orden.payment_method || "No especificado"}</div>
                              <div><strong>Método de Envío:</strong> {orden.delivery_method || orden.shipping_address || "No especificado"}</div>
                            </div>
                          </Col>

                          <Col md={6}>
                            <h6 className="fw-bold mb-2" style={{ color: BRAND_DARK }}>
                              ⚙️ Actualizar Estado del Pedido
                            </h6>
                            <Form.Select
                              value={estadoActual}
                              onChange={(e) => handleEstado(index, e.target.value)}
                              className="rounded-3 py-2"
                            >
                              {ESTADOS.map((est) => (
                                <option key={est} value={est}>
                                  {est.charAt(0).toUpperCase() + est.slice(1)}
                                </option>
                              ))}
                            </Form.Select>
                          </Col>

                          <Col xs={12}>
                            <h6 className="fw-bold mb-3" style={{ color: BRAND_DARK }}>
                              🛍️ Prendas de la Orden
                            </h6>
                            <Table responsive className="align-middle mb-0 border">
                              <thead className="bg-light">
                                <tr>
                                  <th className="py-2">Prenda</th>
                                  <th className="text-center py-2">Cant.</th>
                                  <th className="text-end py-2">Precio Unit.</th>
                                  <th className="text-end py-2">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {itemsDeEstaOrden.length === 0 ? (
                                  <tr>
                                    <td colSpan="4" className="text-center text-muted py-3">
                                      No hay detalles de prendas registrados para este pedido antiguo.
                                    </td>
                                  </tr>
                                ) : (
                                  itemsDeEstaOrden.map((item, pi) => {
                                    const nombrePrenda = item.products?.name || "Prenda Pin-Ups";
                                    const cantidad = item.quantity || 1;
                                    const precioUnit = item.price_at_purchase || 0;
                                    const subtotal = cantidad * precioUnit;

                                    return (
                                      <tr key={pi}>
                                        <td className="fw-semibold">{nombrePrenda}</td>
                                        <td className="text-center fw-semibold">{cantidad}</td>
                                        <td className="text-end">${Number(precioUnit).toLocaleString("es-AR")}</td>
                                        <td className="text-end fw-bold" style={{ color: BRAND_DARK }}>
                                          ${Number(subtotal).toLocaleString("es-AR")}
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </Table>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default AdminOrders;