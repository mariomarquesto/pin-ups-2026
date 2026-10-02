import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { FaArrowLeft, FaCheckCircle, FaClock } from 'react-icons/fa';

const formatearPrecio = (precio) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio || 0);
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Cargar órdenes reales desde Supabase
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error al cargar órdenes:', err.message);
      setErrorMsg('No se pudieron cargar los pedidos o la tabla aún está vacía.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Actualizar el estado en Supabase y en el estado local
  const updateStatus = async (id, newStatus) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
      setSuccessMsg(`Pedido #${id.slice(0, 8)} actualizado a "${newStatus}"`);
    } catch (err) {
      console.error('Error al actualizar estado:', err.message);
      setErrorMsg('No se pudo actualizar el estado del pedido.');
    }
  };

  return (
    <Container className="py-5">
      <div className="mb-4">
        <Link to="/admin" className="text-decoration-none text-muted d-flex align-items-center gap-1 mb-2">
          <FaArrowLeft size={14} /> Volver al Panel
        </Link>
        <h1 className="fw-bold text-dark mb-1">Gestión de Pedidos</h1>
        <p className="text-muted">Administrá las compras de los clientes y actualizá los estados de envío.</p>
      </div>

      {errorMsg && <Alert variant="danger" onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert>}
      {successMsg && <Alert variant="success" onClose={() => setSuccessMsg('')} dismissible>{successMsg}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="dark" />
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-4 overflow-hidden border border-light">
          <div className="table-responsive">
            <Table hover align="middle" className="mb-0">
              <thead className="table-light text-uppercase fs-7 text-muted">
                <tr>
                  <th className="py-3 px-4">ID Pedido</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No hay pedidos registrados en Supabase todavía.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const statusText = order.status || 'Pendiente';
                    const isEnviado = statusText.toLowerCase() === 'enviado' || statusText.toLowerCase() === 'entregado';

                    return (
                      <tr key={order.id}>
                        <td className="px-4 fw-bold text-muted small">#{order.id.slice(0, 8)}</td>
                        <td className="px-4 text-dark fw-semibold">
                          {order.customer_email || order.shipping_address?.email || order.customer || 'Cliente Web'}
                        </td>
                        <td className="px-4 fw-bold text-success">
                          {formatearPrecio(order.total_amount || order.total)}
                        </td>
                        <td className="px-4 text-muted small">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/D'}
                        </td>
                        <td className="px-4">
                          <Badge 
                            bg={isEnviado ? 'success' : 'warning'} 
                            text={isEnviado ? 'light' : 'dark'}
                            className="px-3 py-2 rounded-pill fw-normal d-inline-flex align-items-center gap-1"
                          >
                            {isEnviado ? <FaCheckCircle size={12} /> : <FaClock size={12} />}
                            {statusText}
                          </Badge>
                        </td>
                        <td className="px-4 text-end">
                          {!isEnviado ? (
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              className="rounded-pill px-3 py-1 fw-semibold"
                              onClick={() => updateStatus(order.id, 'Enviado')}
                            >
                              Marcar Enviado
                            </Button>
                          ) : (
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              className="rounded-pill px-3 py-1 fw-semibold"
                              onClick={() => updateStatus(order.id, 'Pendiente')}
                            >
                              Marcar Pendiente
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </Container>
  );
};

export default AdminOrders;