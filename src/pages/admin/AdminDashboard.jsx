import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { supabase } from '../../config/supabase';
import { FaBoxOpen, FaClipboardList, FaStore, FaArrowRight, FaChartLine, FaImages, FaTrash, FaUpload, FaLayerGroup, FaBullhorn } from 'react-icons/fa';

// Imagen local por defecto como respaldo seguro
import popUps1 from '../../images/pop-ups1.png';

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
  const [slides, setSlides] = useState([]);
  const [bannerUrl, setBannerUrl] = useState('/pin-ups-baner.png');
  const [popupUrl, setPopupUrl] = useState(popUps1);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingPopup, setUploadingPopup] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Productos
      try {
        const { count, error } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        if (!error && count !== null) setStats(prev => ({ ...prev, totalProducts: count }));
      } catch (e) { console.warn('Tabla products no disponible'); }

      // 2. Órdenes
      try {
        const { data: ordData, error } = await supabase.from('orders').select('*');
        if (!error && Array.isArray(ordData)) {
          const pending = ordData.filter(ord => (ord?.status || 'pendientes').toLowerCase() !== 'entregado').length;
          const salesSum = ordData.reduce((acc, ord) => acc + (Number(ord?.total_amount || ord?.total) || 0), 0);
          setStats(prev => ({ ...prev, pendingOrders: pending, totalSales: salesSum }));
        }
      } catch (e) { console.warn('Tabla orders no disponible'); }

      // 3. Slider Images
      try {
        const { data: sliderData, error } = await supabase
          .from('slider_images')
          .select('*')
          .order('order_index', { ascending: true });
        if (!error && Array.isArray(sliderData)) setSlides(sliderData);
      } catch (e) { console.warn('Tabla slider_images no disponible'); }

      // 4. Config (Banner y Popup)
      try {
        const { data: configData, error } = await supabase
          .from('site_config')
          .select('banner_image_url, popup_image_url')
          .eq('id', 1)
          .single();

        if (!error && configData) {
          if (configData.banner_image_url?.trim()) {
            setBannerUrl(configData.banner_image_url);
          } else {
            setBannerUrl('/pin-ups-baner.png');
          }

          if (configData.popup_image_url?.trim()) {
            setPopupUrl(configData.popup_image_url);
          } else {
            setPopupUrl(popUps1);
          }
        }
      } catch (e) { console.warn('Tabla site_config no disponible'); }

    } catch (err) {
      console.error('Error general en dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUploadNewSlide = async (event) => {
    try {
      const files = event?.target?.files;
      if (!files || files.length === 0) return;
      const file = files[0];
      setUploading(true);
      const fileName = `slide-${Date.now()}.${file.name.split('.').pop()}`;

      const { error: uploadError } = await supabase.storage.from('sliders').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('sliders').getPublicUrl(fileName);
      const nextOrder = slides.length > 0 ? Math.max(...slides.map(s => Number(s?.order_index) || 0)) + 1 : 1;

      const { error: dbError } = await supabase.from('slider_images').insert([{ image_url: publicUrlData.publicUrl, order_index: nextOrder }]);
      if (dbError) throw dbError;

      await fetchDashboardData();
    } catch (error) {
      alert('Error al subir slide: ' + error.message);
    } finally {
      setUploading(false);
      if (event?.target) event.target.value = '';
    }
  };

  const handleDeleteSlide = async (id) => {
    if (!id || !window.confirm('¿Estás seguro de eliminar este slide?')) return;
    try {
      const { error } = await supabase.from('slider_images').delete().eq('id', id);
      if (error) throw error;
      await fetchDashboardData();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  const handleUploadBanner = async (event) => {
    try {
      const files = event?.target?.files;
      if (!files || files.length === 0) return;
      const file = files[0];
      setUploadingBanner(true);
      const fileName = `banner-${Date.now()}.${file.name.split('.').pop()}`;

      const { error: uploadError } = await supabase.storage.from('sliders').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('sliders').getPublicUrl(fileName);
      const { error: dbError } = await supabase.from('site_config').upsert({ id: 1, banner_image_url: publicUrlData.publicUrl });
      if (dbError) throw dbError;

      setBannerUrl(publicUrlData.publicUrl);
    } catch (error) {
      alert('Error al actualizar el banner: ' + error.message);
    } finally {
      setUploadingBanner(false);
      if (event?.target) event.target.value = '';
    }
  };

  const handleRemoveBanner = async () => {
    if (!window.confirm('¿Deseas quitar la imagen personalizada y volver al banner por defecto?')) return;
    try {
      const { error } = await supabase.from('site_config').upsert({ id: 1, banner_image_url: '' });
      if (error) throw error;
      setBannerUrl('/pin-ups-baner.png');
      alert('Banner restablecido al valor por defecto.');
    } catch (error) {
      alert('Error al quitar el banner: ' + error.message);
    }
  };

  const handleUploadPopup = async (event) => {
    try {
      const files = event?.target?.files;
      if (!files || files.length === 0) return;
      const file = files[0];
      setUploadingPopup(true);
      const fileName = `popup-${Date.now()}.${file.name.split('.').pop()}`;

      const { error: uploadError } = await supabase.storage.from('sliders').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('sliders').getPublicUrl(fileName);
      const { error: dbError } = await supabase.from('site_config').upsert({ id: 1, popup_image_url: publicUrlData.publicUrl });
      if (dbError) throw dbError;

      setPopupUrl(publicUrlData.publicUrl);
    } catch (error) {
      alert('Error al actualizar el popup: ' + error.message);
    } finally {
      setUploadingPopup(false);
      if (event?.target) event.target.value = '';
    }
  };

  const handleRemovePopup = async () => {
    if (!window.confirm('¿Deseas quitar la imagen personalizada y volver al popup por defecto?')) return;
    try {
      const { error } = await supabase.from('site_config').upsert({ id: 1, popup_image_url: '' });
      if (error) throw error;
      setPopupUrl(popUps1);
      alert('Popup restablecido al valor por defecto.');
    } catch (error) {
      alert('Error al quitar el popup: ' + error.message);
    }
  };

  return (
    <Container className="py-5">
      {/* Encabezado */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <h1 className="fw-bold text-dark mb-1">Panel de Administración</h1>
          <p className="text-muted mb-0">Bienvenida de nuevo. Aquí tienes el resumen general de tu tienda.</p>
        </div>
        <Link to="/" className="btn btn-outline-dark d-flex align-items-center gap-2 align-self-start align-self-md-auto px-4 py-2 shadow-sm rounded-pill">
          <FaStore /> Ver Tienda Pública
        </Link>
      </div>
      
      {/* Tarjetas de Estadísticas */}
      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100 py-3 bg-white border-start border-primary border-4 rounded-4">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted text-uppercase small fw-bold mb-1">Productos Activos</p>
                <h3 className="fw-bold text-dark mb-0">{loading ? '...' : stats.totalProducts}</h3>
              </div>
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle"><FaBoxOpen size={24} /></div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100 py-3 bg-white border-start border-warning border-4 rounded-4">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted text-uppercase small fw-bold mb-1">Pedidos Pendientes</p>
                <h3 className="fw-bold text-dark mb-0">{loading ? '...' : stats.pendingOrders}</h3>
              </div>
              <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-circle"><FaClipboardList size={24} /></div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100 py-3 bg-white border-start border-success border-4 rounded-4">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted text-uppercase small fw-bold mb-1">Ventas Totales</p>
                <h3 className="fw-bold text-success mb-0">{loading ? '...' : formatearPrecio(stats.totalSales)}</h3>
              </div>
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle"><FaChartLine size={24} /></div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Accesos rápidos */}
      <h4 className="fw-bold text-dark mb-3">Accesos Directos</h4>
      <Row className="g-4 mb-5">
        <Col md={6}>
          <Card as={Link} to="/admin/products" className="border-0 shadow-sm h-100 text-decoration-none text-dark bg-white rounded-4 p-2">
            <Card.Body className="d-flex justify-content-between align-items-center p-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2"><span className="fs-3">👕</span><h3 className="h5 fw-bold mb-0">Gestionar Productos</h3></div>
                <p className="text-muted small mb-0">Agregá nuevas prendas, editá precios, talles o eliminá artículos.</p>
              </div>
              <div className="text-dark p-2 bg-light rounded-circle"><FaArrowRight size={16} /></div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card as={Link} to="/admin/orders" className="border-0 shadow-sm h-100 text-decoration-none text-dark bg-white rounded-4 p-2">
            <Card.Body className="d-flex justify-content-between align-items-center p-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2"><span className="fs-3">📦</span><h3 className="h5 fw-bold mb-0">Ver Pedidos</h3></div>
                <p className="text-muted small mb-0">Revisá las compras realizadas y actualizá el estado de envíos.</p>
              </div>
              <div className="text-dark p-2 bg-light rounded-circle"><FaArrowRight size={16} /></div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 1. Gestor del Slider */}
      <Card className="border-0 shadow-sm bg-white rounded-4 p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2"><FaImages className="text-primary" /> Carrusel Principal (Slider)</h4>
            <p className="text-muted small mb-0">Sube o elimina las imágenes principales que rotan en la portada.</p>
          </div>
          <div>
            <label htmlFor="upload-slider-input" className="btn btn-dark d-flex align-items-center gap-2 mb-0 px-4 py-2 rounded-pill shadow-sm" style={{ cursor: 'pointer' }}>
              <FaUpload /> {uploading ? 'Subiendo...' : 'Agregar Slide'}
            </label>
            <input id="upload-slider-input" type="file" accept="image/*" onChange={handleUploadNewSlide} disabled={uploading} className="d-none" />
          </div>
        </div>

        {(!Array.isArray(slides) || slides.length === 0) ? (
          <div className="text-center py-5 bg-light rounded-4 border border-dashed">
            <FaLayerGroup size={36} className="text-muted mb-2 opacity-50" />
            <p className="text-dark fw-semibold mb-1">No hay slides activos</p>
          </div>
        ) : (
          <Row className="g-3">
            {slides.map((slide, idx) => (
              <Col key={slide?.id || idx} md={4} lg={3}>
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-light h-100">
                  <div className="position-relative" style={{ height: '140px' }}>
                    <img src={slide?.image_url || '/pin-ups-baner.png'} alt={`Slide ${idx + 1}`} className="w-100 h-100" style={{ objectFit: 'cover' }} onError={(e) => { e.target.src = '/pin-ups-baner.png'; }} />
                    <span className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75 px-2 py-1 rounded-pill small">#{slide?.order_index || (idx + 1)}</span>
                  </div>
                  <div className="p-2.5 d-flex justify-content-between align-items-center bg-white">
                    <span className="text-muted small text-truncate pe-2">Slide {idx + 1}</span>
                    <Button variant="light" size="sm" className="text-danger p-1 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }} onClick={() => handleDeleteSlide(slide?.id)}>
                      <FaTrash size={13} />
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* 2. Gestor del Banner Principal */}
      <Card className="border-0 shadow-sm bg-white rounded-4 p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">🖼 Banner Promocional Principal</h4>
            <p className="text-muted small mb-0">Personaliza la imagen que se destaca debajo de las categorías.</p>
          </div>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <label htmlFor="upload-banner-input" className="btn btn-dark d-flex align-items-center gap-2 mb-0 px-4 py-2 rounded-pill shadow-sm" style={{ cursor: 'pointer' }}>
              <FaUpload /> {uploadingBanner ? 'Subiendo...' : 'Cambiar Banner'}
            </label>
            <input id="upload-banner-input" type="file" accept="image/*" onChange={handleUploadBanner} disabled={uploadingBanner} className="d-none" />
            
            <Button variant="outline-danger" className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm" onClick={handleRemoveBanner}>
              <FaTrash size={13} /> Eliminar imagen y usar defecto
            </Button>
          </div>
        </div>
        <div className="bg-light p-3 rounded-4 border border-light text-center">
          <div className="position-relative mx-auto rounded-3 overflow-hidden shadow-sm" style={{ maxWidth: '800px', height: '180px' }}>
            <img src={bannerUrl || '/pin-ups-baner.png'} alt="Banner" className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'center' }} onError={(e) => { e.target.src = '/pin-ups-baner.png'; }} />
          </div>
        </div>
      </Card>

      {/* 3. Gestor del Popup de Oferta */}
      <Card className="border-0 shadow-sm bg-white rounded-4 p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2"><FaBullhorn className="text-danger" /> Popup de Oferta (Emergente)</h4>
            <p className="text-muted small mb-0">Personaliza la imagen que aparece automáticamente cuando los clientes ingresan a la tienda.</p>
          </div>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <label htmlFor="upload-popup-input" className="btn btn-dark d-flex align-items-center gap-2 mb-0 px-4 py-2 rounded-pill shadow-sm" style={{ cursor: 'pointer' }}>
              <FaUpload /> {uploadingPopup ? 'Subiendo...' : 'Cambiar Popup'}
            </label>
            <input id="upload-popup-input" type="file" accept="image/*" onChange={handleUploadPopup} disabled={uploadingPopup} className="d-none" />
            
            <Button variant="outline-danger" className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm" onClick={handleRemovePopup}>
              <FaTrash size={13} /> Eliminar imagen y usar defecto
            </Button>
          </div>
        </div>
        <div className="bg-light p-3 rounded-4 border border-light text-center">
          <div className="position-relative mx-auto rounded-3 overflow-hidden shadow-sm" style={{ maxWidth: '350px', height: '220px' }}>
            <img src={popupUrl || popUps1} alt="Popup" className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'center' }} onError={(e) => { e.target.src = popUps1; }} />
          </div>
          <span className="text-muted small mt-2 d-inline-block">Vista previa adaptada del popup</span>
        </div>
      </Card>
    </Container>
  );
};

export default AdminDashboard;