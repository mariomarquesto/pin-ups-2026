import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Table, Button, Spinner, Form } from "react-bootstrap";
import { FaShoppingBag, FaArrowLeft, FaSyncAlt, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";

const BRAND = "#f85606";
const BRAND_DARK = "#e04a00";
const CREAM = "#fef6f0";

const ESTADOS = ["pendiente", "pagado", "enviado", "entregado", "cancelado"];

const estadoVariant = (estado) => {
  switch (estado) {
    case "pagado":
    case "entregado":
      return "success";
    case "enviado":
      return "info";
    case "cancelado":
      return "danger";
    default:
      return "warning";
  }
};

// Fecha legible: usa la fecha de la orden y, si no existe, la de creación.
const formatearFecha = (orden) => {
  const cruda = orden?.fecha || orden?.created_at;
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
  const c = orden?.cliente || {};
  return c.nombre || c.email || orden?.customer_email || "Sin nombre";
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    const merged = [];

    // 1. Pedidos guardados en Supabase (fuente compartida entre dispositivos)
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && Array.isArray(data)) merged.push(...data);
    } catch {
      /* sin conexión a Supabase: seguimos con lo local */
    }

    // 2. Pedidos locales (legacy) que no estén ya en Supabase
    try {
      const legacy = JSON.parse(localStorage.getItem("ordenes")) || [];
      if (Array.isArray(legacy)) {
        legacy.forEach((o) => {
          const ya = merged.some(
            (m) => m.numero_orden && m.numero_orden === o.numeroOrden
          );
          if (!ya) merged.push(o);
        });
      }
    } catch {
      /* localStorage corrupto: se ignora */
    }

    setOrders(merged);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleEstado = async (index, nuevoEstado) => {
    const target = orders[index];
    const updated = orders.map((o, i) => (i === index ? { ...o, estado: nuevoEstado } : o));
    setOrders(updated);

    // Persistir en Supabase si el pedido existe allá
    if (target?.id) {
      try {
        await supabase.from("orders").update({ estado: nuevoEstado }).eq("id", target.id);
      } catch {
        /* sin conexión: queda solo en memoria/local */
      }
    }

    // Reflejar también en el listado local legacy
    try {
      const legacy = JSON.parse(localStorage.getItem("ordenes")) || [];
      if (Array.isArray(legacy)) {
        const next = legacy.map((o) =>
          o.numeroOrden && o.numeroOrden === (target?.numeroOrden || target?.numero_orden)
            ? { ...o, estado: nuevoEstado }
            : o
        );
        localStorage.setItem("ordenes", JSON.stringify(next));
      }
    } catch {
      /* almacenamiento lleno: se ignora */
    }
  };

  return (
    <Container fluid className="px-4 pb-5" style={{ backgroundColor: CREAM, minHeight: "100vh" }}>
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold d-flex align-items-center gap-2" style={{ color: BRAND_DARK }}>
            <FaShoppingBag style={{ color: BRAND }} /> Pedidos
          </h2>
          <p className="text-muted mb-0">Historial de compras realizadas en la tienda.</p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={loadOrders}
            className="d-flex align-items-center gap-1 rounded-pill"
          >
            <FaSyncAlt /> Actualizar
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate("/admin")}
            className="d-flex align-items-center gap-1 rounded-pill"
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
        <Card className="shadow-sm text-center py-5 border-0">
          <Card.Body>
            <h5 className="fw-bold" style={{ color: BRAND_DARK }}>
              Todavía no hay pedidos
            </h5>
            <p className="text-muted mb-0">Cuando un cliente compre, el pedido va a aparecer acá.</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {orders.map((orden, index) => (
            <Col key={orden.numero_orden || orden.numeroOrden || orden.id || index} xs={12} className="mb-3">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Row className="align-items-center g-2">
                    <Col md={3}>
                      <div className="fw-bold" style={{ color: BRAND_DARK }}>
                        #{orden.numero_orden || orden.numeroOrden || index + 1}
                      </div>
                      <div className="text-muted small">{formatearFecha(orden)}</div>
                    </Col>

                    <Col md={3}>
                      <div className="fw-semibold">{nombreCliente(orden)}</div>
                      <div className="text-muted small">
                        {orden.cliente?.email || orden.customer_email || "Sin email"}
                      </div>
                    </Col>

                    <Col md={2}>
                      <Badge bg={estadoVariant(orden.estado)} className="text-uppercase">
                        {orden.estado || "pendiente"}
                      </Badge>
                    </Col>

                    <Col md={2} className="fw-bold text-end" style={{ color: BRAND_DARK }}>
                      ${(orden.total || 0).toLocaleString("es-AR")}
                    </Col>

                    <Col md={2} className="text-end">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="rounded-pill d-inline-flex align-items-center gap-1"
                        onClick={() => setExpanded(expanded === index ? null : index)}
                      >
                        <FaEye /> {expanded === index ? "Ocultar" : "Ver"}
                      </Button>
                    </Col>
                  </Row>

                  {expanded === index && (
                    <>
                      <hr />
                      <Row className="g-3">
                        <Col md={6}>
                          <h6 className="fw-bold" style={{ color: BRAND_DARK }}>
                            Cliente
                          </h6>
                          <div className="text-muted small">
                            <div>Nombre: {nombreCliente(orden)}</div>
                            <div>Email: {orden.cliente?.email || orden.customer_email || "Sin email"}</div>
                            <div>Teléfono: {orden.cliente?.telefono || "Sin teléfono"}</div>
                          </div>
                        </Col>

                        <Col md={6}>
                          <h6 className="fw-bold" style={{ color: BRAND_DARK }}>
                            Estado del pedido
                          </h6>
                          <Form.Select
                            size="sm"
                            value={orden.estado || "pendiente"}
                            onChange={(e) => handleEstado(index, e.target.value)}
                          >
                            {ESTADOS.map((e) => (
                              <option key={e} value={e}>
                                {e}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>

                        <Col xs={12}>
                          <h6 className="fw-bold" style={{ color: BRAND_DARK }}>
                            Productos
                          </h6>
                          <Table size="sm" responsive className="align-middle mb-0">
                            <thead className="table-light">
                              <tr>
                                <th>Producto</th>
                                <th className="text-center">Cant.</th>
                                <th className="text-end">P. Unit.</th>
                                <th className="text-end">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(Array.isArray(orden.productos) ? orden.productos : [orden.producto])
                                .filter(Boolean)
                                .map((p, pi) => (
                                  <tr key={pi}>
                                    <td>{p.titulo || p.nombre || "Producto"}</td>
                                    <td className="text-center">{p.cantidad || 1}</td>
                                    <td className="text-end">
                                      ${(p.precioUnitario || 0).toLocaleString("es-AR")}
                                    </td>
                                    <td className="text-end">${(p.subtotal || 0).toLocaleString("es-AR")}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </Col>

                        {orden.observaciones && (
                          <Col xs={12}>
                            <h6 className="fw-bold" style={{ color: BRAND_DARK }}>
                              Observaciones
                            </h6>
                            <p className="text-muted small mb-0">{orden.observaciones}</p>
                          </Col>
                        )}
                      </Row>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AdminOrders;
