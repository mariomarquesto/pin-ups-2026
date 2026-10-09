// src/pages/admin/AdminDashboard.jsx

import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Spinner, Form, InputGroup } from "react-bootstrap";
import { FaBox, FaShoppingBag, FaChartLine, FaPlus, FaImages, FaPercent, FaSave } from "react-icons/fa";
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

  // Estados para los descuentos configurables y su interruptor de encendido/apagado
  const [cashDiscount, setCashDiscount] = useState(30);
  const [transferDiscount, setTransferDiscount] = useState(15);
  const [discountsEnabled, setDiscountsEnabled] = useState(true);
  const [savingDiscounts, setSavingDiscounts] = useState(false);

  const currentUser = getSessionUser() || {};

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Cargar productos
        const { data: prodData } = await supabase.from("products").select("*");
        if (prodData) setProducts(prodData);
      } catch (err) {
        console.error("Error cargando productos:", err);
      }

      try {
        // Cargar pedidos
        const { data: ordData, error: ordError } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (!ordError && ordData && ordData.length > 0) {
          setOrders(ordData);
        } else {
          const legacy = JSON.parse(localStorage.getItem("ordenes")) || [];
          setOrders(Array.isArray(legacy) ? legacy : []);
        }
      } catch (err) {
        console.error("Error cargando pedidos:", err);
        const legacy = JSON.parse(localStorage.getItem("ordenes")) || [];
        setOrders(Array.isArray(legacy) ? legacy : []);
      }

      try {
        // Cargar ajustes de descuentos de store_settings
        const { data: settingsData } = await supabase
          .from("store_settings")
          .select("key, value");

        if (settingsData) {
          settingsData.forEach(item => {
            if (item.key === "cash_discount") setCashDiscount(parseFloat(item.value) || 30);
            if (item.key === "transfer_discount") setTransferDiscount(parseFloat(item.value) || 15);
            if (item.key === "discounts_enabled") setDiscountsEnabled(item.value === "true" || item.value === true);
          });
        }
      } catch (err) {
        console.error("Error cargando configuraciones:", err);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const handleSaveDiscounts = async (e) => {
    e.preventDefault();
    setSavingDiscounts(true);
    try {
      const { error } = await supabase
        .from("store_settings")
        .upsert([
          { key: "cash_discount", value: String(cashDiscount) },
          { key: "transfer_discount", value: String(transferDiscount) },
          { key: "discounts_enabled", value: String(discountsEnabled) }
        ], { onConflict: "key" });

      if (error) throw error;
      alert("¡Configuración de descuentos actualizada correctamente!");
    } catch (err) {
      console.error("Error al guardar descuentos:", err);
      alert("Hubo un error al guardar los descuentos.");
    } finally {
      setSavingDiscounts(false);
    }
  };

  return (
    <Container fluid className="px-4 pb-5" style={{ backgroundColor: CREAM, minHeight: "100vh" }}>
      <Row className="align-items-center mb-4 pt-4">
        <Col>
          <h2 className="fw-bold d-flex align-items-center gap-2" style={{ color: BRAND_DARK }}>
            <FaChartLine style={{ color: BRAND }} /> Dashboard
          </h2>
          <p className="text-muted mb-0">
            Bienvenida, <strong>{currentUser.nombre || currentUser.email || "Admin"}</strong>. Este es el
            resumen de tu tienda.
          </p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
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
        <>
          {/* Tarjetas de Estadísticas */}
          <Row className="g-4 mb-4">
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
                icon={FaImages}
                label="Banners y Popups"
                value="Editar"
                onClick={() => navigate("/admin/banners")}
              />
            </Col>
          </Row>

          {/* Panel de Configuración de Descuentos */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card className="shadow-sm border-0 rounded-4 border-start border-4 border-warning">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 text-secondary">
                      <FaPercent style={{ color: BRAND }} /> Configuración de Descuentos por Forma de Pago
                    </h5>
                    <Form.Check 
                      type="switch"
                      id="custom-switch-discounts"
                      label={discountsEnabled ? "🟢 Sistema de Descuentos ACTIVO" : "🔴 Sistema de Descuentos APAGADO"}
                      checked={discountsEnabled}
                      onChange={(e) => setDiscountsEnabled(e.target.checked)}
                      className="fw-bold text-dark"
                    />
                  </div>
                  <p className="text-muted small mb-3">
                    Define los porcentajes de descuento que se aplicarán automáticamente al finalizar la compra para efectivo y transferencia.
                  </p>

                  <Form onSubmit={handleSaveDiscounts}>
                    <Row className="g-3 align-items-end">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fw-semibold small text-muted">Descuento en Efectivo (%)</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="number"
                              min="0"
                              max="100"
                              disabled={!discountsEnabled}
                              value={cashDiscount}
                              onChange={(e) => setCashDiscount(e.target.value)}
                              className="rounded-start-3 py-2"
                            />
                            <InputGroup.Text>% OFF</InputGroup.Text>
                          </InputGroup>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fw-semibold small text-muted">Descuento por Transferencia (%)</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="number"
                              min="0"
                              max="100"
                              disabled={!discountsEnabled}
                              value={transferDiscount}
                              onChange={(e) => setTransferDiscount(e.target.value)}
                              className="rounded-start-3 py-2"
                            />
                            <InputGroup.Text>% OFF</InputGroup.Text>
                          </InputGroup>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Button
                          type="submit"
                          disabled={savingDiscounts}
                          className="w-100 rounded-pill py-2 fw-semibold border-0 text-white"
                          style={{ backgroundColor: BRAND }}
                        >
                          <FaSave className="me-1" /> {savingDiscounts ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Últimos Pedidos */}
          <Row>
            <Col>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0" style={{ color: BRAND_DARK }}>
                      Últimos pedidos recientes
                    </h5>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="rounded-pill px-3"
                      onClick={() => navigate("/admin/orders")}
                    >
                      Ver todos ({orders.length})
                    </Button>
                  </div>

                  {orders.length === 0 ? (
                    <p className="text-muted mb-0">Todavía no hay pedidos registrados.</p>
                  ) : (
                    orders
                      .slice(0, 10)
                      .map((o, i) => {
                        const clienteNombre = o.cliente?.nombre || o.customer_name || "Sin cliente";
                        const numeroOrd = o.numero_orden || o.numeroOrden || `ORD-${i + 1}`;
                        const estadoOrd = o.estado || o.status || "Confirmada";
                        const totalOrd = o.total || 0;
                        const lowerEstado = estadoOrd.toLowerCase();

                        return (
                          <div key={i} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                            <div>
                              <span className="fw-semibold">#{numeroOrd}</span>
                              <span className="text-muted ms-2 small">
                                {clienteNombre}
                              </span>
                              {o.payment_method && (
                                <div className="text-muted small text-secondary">Pago: {o.payment_method}</div>
                              )}
                            </div>
                            <div className="d-flex align-items-center gap-3">
                              <Badge
                                bg={
                                  lowerEstado.includes("cancelado")
                                    ? "danger"
                                    : lowerEstado.includes("entregado") || lowerEstado.includes("pagado")
                                    ? "success"
                                    : "warning"
                                }
                              >
                                {estadoOrd}
                              </Badge>
                              <span className="fw-bold" style={{ color: BRAND_DARK }}>
                                ${Number(totalOrd).toLocaleString("es-AR")}
                              </span>
                            </div>
                          </div>
                        );
                      })
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;