// src/pages/admin/AdminOrders.jsx
import { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { FaArrowLeft, FaEye, FaTrash } from 'react-icons/fa';

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
  
  // Estado para el modal de detalles de la orden
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Cargar órdenes desde Supabase
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
      setErrorMsg('No se pudieron cargar las órdenes desde el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('¿Estás segura de que querés eliminar este registro de orden?')) return;

    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      
      setSuccessMsg('Orden eliminada correctamente.');
      fetchOrders();
    } catch (err) {
      console.error('Error al eliminar orden:', err.message);
      setErrorMsg('No se pudo eliminar la orden.');
    }
  };

  return (
    <Container className="py-5">
      <div className="mb-4">
        <Link to="/admin" className="text-decoration-none text-muted d-flex align-items-center gap-1 mb-2">
          <FaArrowLeft size={14} /> Volver al Panel
        </Link>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h1 className="fw-bold text-dark mb-1">Gestión de Órdenes y Pedidos</h1>
            <p className="text-muted mb-0">Revisá los pedidos confirmados por los clientes en la tienda.</p>
          </div>
        </div>
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
                  <th className="py-3 px-4">N° Orden</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No hay órdenes registradas todavía.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const cliente = order.cliente || {};
                    return (
                      <tr key={order.id}>
                        <td className="px-4 fw-bold text-dark">{order.numero_orden}</td>
                        <td className="px-4 text-muted small">{order.fecha}</td>
                        <td className="px-4">
                          <div className="fw-semibold text-dark">{cliente.nombre || 'Sin nombre'}</div>
                          <div className="small text-muted">{cliente.telefono || 'Sin teléfono'}</div>
                        </td>
                        <td className="px-4 fw-bold text-success">{formatearPrecio(order.total)}</td>
                        <td className="px-4">
                          <Badge bg="success" className="px-2 py-1">
                            {order.estado || 'Confirmada'}
                          </Badge>
                        </td>
                        <td className="px-4 text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="rounded-circle p-2"
                              onClick={() => handleViewDetails(order)}
                              title="Ver detalles del pedido"
                            >
                              <FaEye size={14} />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="rounded-circle p-2"
                              onClick={() => handleDeleteOrder(order.id)}
                              title="Eliminar orden"
                            >
                              <FaTrash size={14} />
                            </Button>
                          </div>
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

      {/* Modal para ver detalles completos de la orden */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            Detalles de la Orden: {selectedOrder?.numero_orden}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {selectedOrder && (
            <div>
              <p className="text-muted small mb-3">Fecha del pedido: {selectedOrder.fecha}</p>
              
              <h5 className="fw-bold text-dark mb-2">Datos del Cliente</h5>
              <div className="bg-light p-3 rounded-3 mb-3">
                <p className="mb-1"><strong>Nombre:</strong> {selectedOrder.cliente?.nombre}</p>
                <p className="mb-1"><strong>Email:</strong> {selectedOrder.cliente?.email}</p>
                <p className="mb-0"><strong>Teléfono:</strong> {selectedOrder.cliente?.telefono}</p>
              </div>

              <h5 className="fw-bold text-dark mb-2">Productos Comprados</h5>
              <div className="table-responsive mb-3">
                <Table size="sm" className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.productos?.map((prod, idx) => (
                      <tr key={idx}>
                        <td>{prod.titulo || prod.name}</td>
                        <td className="text-center">{prod.cantidad || 1}</td>
                        <td className="text-end">{formatearPrecio(prod.subtotal || (prod.price * (prod.quantity || 1)))}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex justify-content-between mb-1">
                <span>Subtotal:</span>
                <span>{formatearPrecio(selectedOrder.subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <span>{selectedOrder.envio === 0 ? "Gratis" : formatearPrecio(selectedOrder.envio)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Total Final:</h5>
                <h5 className="fw-bold mb-0 text-success">{formatearPrecio(selectedOrder.total)}</h5>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="dark" className="px-4" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminOrders;