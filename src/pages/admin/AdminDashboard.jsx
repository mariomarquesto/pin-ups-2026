import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Spinner } from "react-bootstrap";
import { FaBox, FaShoppingBag, FaChartLine, FaUsers, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { getSessionUser } from "../../utils/session";

const BRAND = "#f85606";
const BRAND_DARK = "#e04a00";
const CREAM = "#fef6f0";

const StatCard = ({ icon: Icon, label, value, onClick }) => (
  <Card
    className="shadow-sm border-0 h-100"
    role="button"
    onClick={onClick}
    style={{ cursor: onClick ? "pointer" : "default", borderTop: `4px solid ${BRAND}` }}
  >
    <Card.Body className="d-flex align-items-center gap-3">
      <div
        className="rounded-circle d-flex align-items-center justify-content-center"
        style={{ width: 52, height: 52, backgroundColor: CREAM, color: BRAND }}
      >
        <Icon size={22} />
      </div>
      <div>
        <div className="text-muted small text-uppercase fw-semibold">{label}</div>
        <div className="fs-3 fw-bold" style={{ color: BRAND_DARK }}>
          {value}
        </div>
      </div>
    </Card.Body>
  </Card>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = getSessionUser() || {};

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (!error && data) setProducts(data);
      } catch {
        setProducts([]);
      }
      try {
        const legacy = JSON.parse(localStorage.getItem("ordenes")) || [];
        setOrders(Array.isArray(legacy) ? legacy : []);
      } catch {
        setOrders([]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const pendientes = orders.filter((o) => (o.estado || "pendiente") === "pendiente").length;

  const clientesUnicos = new Set(
    orders
      .map((o) => (o.cliente?.email || o.customer_email || o.cliente?.nombre || "").trim().toLowerCase())
      .filter(Boolean)
  ).size;

  return (
    <Container fluid className="px-4 pb-5" style={{ backgroundColor: CREAM, minHeight: "100vh" }}>
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold d-flex align-items-center gap-2" style={{ color: BRAND_DARK }}>
            <FaChartLine style={{ color: BRAND }} /> Dashboard
          </h2>
          <p className="text-muted mb-0">
            Bienvenida, <strong>{currentUser.nombre || currentUser.email || "Admin"}</strong>. Este es el
            resumen de tu tienda.
          </p>
        </Col>
        <Col xs="auto">
          <Button
            className="d-flex align-items-center gap-2 rounded-pill px-4"
            style={{ backgroundColor: BRAND, borderColor: BRAND }}
            onClick={() => navigate("/admin/products")}
          >
            <FaPlus /> Nuevo producto
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: BRAND }} />
        </div>
      ) : (
        <Row className="g-4">
          <Col md={6} lg={3}>
            <StatCard
              icon={FaBox}
              label="Productos"
              value={products.length}
              onClick={() => navigate("/admin/products")}
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={FaShoppingBag}
              label="Pedidos"
              value={orders.length}
              onClick={() => navigate("/admin/orders")}
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={FaChartLine}
              label="Pedidos pendientes"
              value={pendientes}
              onClick={() => navigate("/admin/orders")}
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={FaUsers}
              label="Clientas (CRM)"
              value={clientesUnicos}
              onClick={() => navigate("/admin/crm")}
            />
          </Col>
        </Row>
      )}

      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3" style={{ color: BRAND_DARK }}>
                Últimos pedidos
              </h5>
              {orders.length === 0 ? (
                <p className="text-muted mb-0">Todavía no hay pedidos registrados.</p>
              ) : (
                orders
                  .slice(-5)
                  .reverse()
                  .map((o, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div>
                        <span className="fw-semibold">#{o.numeroOrden || i + 1}</span>
                        <span className="text-muted ms-2 small">
                          {o.cliente?.nombre || o.cliente?.email || "Sin cliente"}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <Badge
                          bg={
                            o.estado === "cancelado"
                              ? "danger"
                              : o.estado === "entregado" || o.estado === "pagado"
                              ? "success"
                              : "warning"
                          }
                        >
                          {o.estado || "pendiente"}
                        </Badge>
                        <span className="fw-bold" style={{ color: BRAND_DARK }}>
                          ${(o.total || 0).toLocaleString("es-AR")}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
