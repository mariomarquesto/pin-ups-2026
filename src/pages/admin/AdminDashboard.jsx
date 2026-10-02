import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { supabase } from '../../config/supabase';
import { FaBoxOpen, FaClipboardList, FaStore, FaArrowRight, FaChartLine } from 'react-icons/fa';

const formatearPrecio = (precio) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio || 0);
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Contar productos reales en Supabase
        const { count: prodCount, error: prodError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // 2. Obtener órdenes reales de Supabase (si la tabla existe)
        let ordersData = [];
        const { data: ordData, error: ordError } = await supabase
          .from('orders')
          .select('*');

        if (!ordError && ordData) {
          ordersData = ordData;
        }

        // Calcular pedidos pendientes y suma total de ventas
        const pending = ordersData.filter(ord => (ord.status || 'pendientes').toLowerCase() !== 'entregado').length;
        const salesSum = ordersData.reduce((acc, ord) => acc + (Number(ord.total_amount || ord.total) || 0), 0);

        setStats({
          totalProducts: prodCount || 0,
          pendingOrders: pending || 0,
          totalSales: salesSum
        });
      } catch (err) {
        console.error('Error al cargar métricas del dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container className="py-5">
      {/* Encabezado */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <h1 className="fw-bold text-dark mb-1">Panel de Administración</h1>
          <p className="text-muted mb-0">Bienvenida de nuevo. Aquí tienes el resumen general de tu tienda.</p>
        </div>
        <Link to="/" className="btn btn-outline-dark d-flex align-items-center gap-2 align-self-start align-self-md-auto px-4 py-2 shadow-sm">
          <FaStore /> Ver Tienda Pública
        </Link>
      </div>
      
      {/* Tarjetas de Estadísticas */}
      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100 py-3 bg-white border-start border-primary border-4">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted text-uppercase small fw-bold mb-1">Productos Activos</p>
                <h3 className="fw-bold text-dark mb-0">{loading ? '...' : stats.totalProducts}</h3>
              </div>
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                <FaBoxOpen size={26} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm h-100 py-3 bg-white border-start border-warning border-4">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted text-uppercase small fw-bold mb-1">Pedidos Pendientes</p>
                <h3 className="fw-bold text-warning text-dark mb-0">{loading ? '...' : stats.pendingOrders}</h3>
              </div>
              <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-circle">
                <FaClipboardList size={26} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm h-100 py-3 bg-white border-start border-success border-4">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted text-uppercase small fw-bold mb-1">Ventas Totales</p>
                <h3 className="fw-bold text-success mb-0">{loading ? '...' : formatearPrecio(stats.totalSales)}</h3>
              </div>
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle">
                <FaChartLine size={26} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Accesos rápidos polentas */}
      <h4 className="fw-bold text-dark mb-3">Accesos Directos</h4>
      <Row className="g-4">
        <Col md={6}>
          <Card as={Link} to="/admin/products" className="border-0 shadow-sm h-100 text-decoration-none text-dark bg-white hover-card p-2 transition-all">
            <Card.Body className="d-flex justify-content-between align-items-center p-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fs-3">👕</span>
                  <h3 className="h5 fw-bold mb-0">Gestionar Productos</h3>
                </div>
                <p className="text-muted small mb-0">Agregá nuevas prendas, editá precios, talles o eliminá artículos del catálogo.</p>
              </div>
              <div className="text-dark p-2">
                <FaArrowRight size={20} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card as={Link} to="/admin/orders" className="border-0 shadow-sm h-100 text-decoration-none text-dark bg-white hover-card p-2 transition-all">
            <Card.Body className="d-flex justify-content-between align-items-center p-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fs-3">📦</span>
                  <h3 className="h5 fw-bold mb-0">Ver Pedidos</h3>
                </div>
                <p className="text-muted small mb-0">Revisá las compras realizadas por los clientes y actualizá el estado de los envíos.</p>
              </div>
              <div className="text-dark p-2">
                <FaArrowRight size={20} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;