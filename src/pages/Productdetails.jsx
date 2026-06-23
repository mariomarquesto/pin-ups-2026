// src/pages/ProductDetails.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { MdStar, MdStarHalf, MdStarOutline } from 'react-icons/md';
import { CiDeliveryTruck, CiHeart } from 'react-icons/ci';
import { BsShieldCheck, BsArrowLeft } from 'react-icons/bs';
import { PiKeyReturnFill } from 'react-icons/pi';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import productList from '../data/products.json';
import './ProductDetails.css';

const ProductDetails = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Cargar producto desde Supabase (y fallback a JSON)
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      
      try {
        // Intentar cargar desde Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id))
          .single();
        
        if (!error && data) {
          console.log('✅ Producto cargado desde Supabase');
          setProduct(data);
        } else {
          // Fallback: buscar en JSON local
          console.log('📦 Usando producto local (JSON)');
          const found = productList.find(p => p.id === parseInt(id));
          setProduct(found);
        }
      } catch (err) {
        console.error('Error al cargar producto:', err);
        // Fallback a JSON
        const found = productList.find(p => p.id === parseInt(id));
        setProduct(found);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-2">Cargando detalles de la prenda...</p>
      </Container>
    );
  }

  if (!product) return (
    <Container className="py-5 text-center">
      <h3 className="fs-4">✨ Prenda no encontrada</h3>
      <Button variant="outline-warning" onClick={() => navigate('/')} className="mt-3 rounded-pill px-4">
        Volver a tienda
      </Button>
    </Container>
  );

  // Manejar campos según origen (Supabase o JSON)
  const discount = product.discountPercentage || product.discount_percentage || 0;
  const price = product.price || 0;
  const precioFinal = discount > 0 
    ? Math.round(price - (price * discount / 100))
    : price;
  const rating = product.rating || 0;
  const brand = product.brand || 'Pin Ups';
  const thumbnail = product.thumbnail || product.image || 'https://via.placeholder.com/400';
  const title = product.title || 'Producto';
  
  const formatear = (val) => new Intl.NumberFormat('es-AR', { 
    style: 'currency', 
    currency: 'ARS', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(val);

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) stars.push(<MdStar key={i} className="text-warning" size={16} />);
      else if (i - 0.5 === rating) stars.push(<MdStarHalf key={i} className="text-warning" size={16} />);
      else stars.push(<MdStarOutline key={i} className="text-secondary" size={16} />);
    }
    return stars;
  };

  // ============================================================
  // FUNCIONES PARA LA ORDEN DE COMPRA
  // ============================================================

  const generarNumeroOrden = () => {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PIN-${anio}${mes}${dia}-${random}`;
  };

  const formatearFecha = () => {
    const fecha = new Date();
    return fecha.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert('💄 Iniciá sesión para agregar productos');
      navigate('/login');
      return;
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exist = cart.findIndex(i => i.id === product.id);
    if (exist !== -1) cart[exist].quantity += count;
    else cart.push({ ...product, quantity: count, discount_percentage: discount, price: price });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`🛍️ ${title} agregado al carrito`);
  };

  const enviarOrdenPorWhatsApp = (orden) => {
    const telefonoEmpresa = "5493813471147";
    const mensaje = encodeURIComponent(
      `🛍️ *NUEVA ORDEN DE COMPRA - PIN UPS* 🛍️\n\n` +
      `📋 *NÚMERO DE ORDEN:* ${orden.numeroOrden}\n` +
      `📅 *FECHA:* ${orden.fecha}\n` +
      `👤 *CLIENTE:* ${orden.cliente.nombre}\n` +
      `📧 *EMAIL:* ${orden.cliente.email}\n` +
      `📞 *TELÉFONO:* ${orden.cliente.telefono}\n\n` +
      `📦 *PRODUCTO:*\n` +
      `   • ${orden.producto.titulo}\n` +
      `   • Cantidad: ${orden.producto.cantidad}\n` +
      `   • Precio unitario: ${formatear(orden.producto.precioUnitario)}\n` +
      `   • Subtotal: ${formatear(orden.producto.subtotal)}\n\n` +
      `💰 *TOTAL DE LA COMPRA:* ${formatear(orden.total)}\n\n` +
      `📝 *OBSERVACIONES:* ${orden.observaciones || 'Sin observaciones'}\n\n` +
      `✨ *ESTADO:* Pendiente de confirmación\n\n` +
      `🔗 *PARA CONFIRMAR LA ORDEN, RESPONDER ESTE MENSAJE*`
    );
    
    window.open(`https://wa.me/${telefonoEmpresa}?text=${mensaje}`, '_blank');
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      alert('💄 Iniciá sesión para realizar la compra');
      navigate('/login');
      return;
    }

    const user = JSON.parse(localStorage.getItem('users'));
    const telefonoUsuario = user?.phone || 'No especificado';
    const emailUsuario = user?.email || 'No especificado';
    const nombreUsuario = user?.fName && user?.lName 
      ? `${user.fName} ${user.lName}` 
      : user?.fName || 'Cliente Pin Ups';

    const precioUnitario = precioFinal;
    const subtotal = precioUnitario * count;
    const total = subtotal;

    const orden = {
      numeroOrden: generarNumeroOrden(),
      fecha: formatearFecha(),
      cliente: {
        nombre: nombreUsuario,
        email: emailUsuario,
        telefono: telefonoUsuario
      },
      producto: {
        id: product.id,
        titulo: title,
        cantidad: count,
        precioUnitario: precioUnitario,
        subtotal: subtotal
      },
      total: total,
      observaciones: `Cliente solicita factura tipo A/B/C. Contactar para coordinar pago y envío.`,
      estado: 'pendiente'
    };

    const ordenes = JSON.parse(localStorage.getItem('ordenes')) || [];
    ordenes.push(orden);
    localStorage.setItem('ordenes', JSON.stringify(ordenes));
    localStorage.setItem('ultimaOrden', JSON.stringify(orden));
    
    enviarOrdenPorWhatsApp(orden);
    navigate('/orden-confirmada');
  };

  return (
    <Container className="py-4 py-md-5">
      {/* Breadcrumb */}
      <div className="mb-4 d-flex align-items-center gap-2 text-muted small">
        <BsArrowLeft 
          className="cursor-pointer" 
          onClick={() => navigate(-1)} 
          style={{ cursor: 'pointer' }} 
        />
        <span>Volver</span>
        <span className="mx-1">/</span>
        <span className="text-dark fw-semibold text-truncate" style={{ maxWidth: '250px' }}>
          {title}
        </span>
      </div>

      <Row className="g-4 g-lg-5">
        {/* Columna imagen */}
        <Col lg={6}>
          <div className="position-relative">
            <div className="overflow-hidden rounded-4 shadow-sm" style={{ backgroundColor: '#fef6f0' }}>
              <img
                src={thumbnail}
                alt={title}
                className="img-fluid w-100"
                style={{ 
                  objectFit: 'contain', 
                  height: 'auto',
                  maxHeight: '450px',
                  minHeight: '300px',
                  transition: '0.3s'
                }}
                onError={(e) => (e.target.src = '/images/placeholder.jpg')}
              />
            </div>
            
            {discount > 0 && (
              <div className="position-absolute top-0 start-0 mt-3 ms-3 bg-danger text-white px-3 py-1 rounded-pill fw-semibold small">
                -{discount}%
              </div>
            )}
            
            <div 
              className="position-absolute top-0 end-0 mt-3 me-3 bg-white rounded-circle p-2 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <CiHeart 
                size={22} 
                className={isFavorite ? 'text-danger' : 'text-muted'} 
                style={{ fill: isFavorite ? '#f85606' : 'none' }}
              />
            </div>
          </div>
          
          <div className="d-flex gap-2 mt-3 justify-content-center flex-wrap">
            {[thumbnail, thumbnail, thumbnail].map((img, idx) => (
              <div
                key={idx}
                className={`border rounded-3 p-1 ${activeImage === idx ? 'border-warning' : 'border-light'}`}
                style={{ width: '70px', cursor: 'pointer' }}
                onClick={() => setActiveImage(idx)}
              >
                <img 
                  src={img} 
                  alt="thumb" 
                  className="w-100 rounded-2" 
                  style={{ height: '60px', objectFit: 'cover' }} 
                />
              </div>
            ))}
          </div>
        </Col>

        {/* Columna detalles */}
        <Col lg={6}>
          <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
            <span className="text-uppercase small fw-semibold text-muted tracking-wide">
              {brand}
            </span>
            <span className="text-muted">•</span>
            <div className="d-flex align-items-center gap-1">
              {renderStars(rating)} 
              <span className="text-muted small ms-1">({rating})</span>
            </div>
          </div>

          <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)' }}>
            {title}
          </h1>
          
          <p className="text-muted mb-4" style={{ lineHeight: 1.6 }}>
            👗 Prenda pensada para talles reales y curvy. Comodidad, estilo y amor propio.
          </p>

          <div className="mb-4">
            <span className="fw-bold text-primary" style={{ color: '#f85606', fontSize: 'clamp(1.8rem, 5vw, 2.2rem)' }}>
              {formatear(precioFinal)}
            </span>
            {discount > 0 && (
              <span className="text-muted text-decoration-line-through ms-2">
                {formatear(price)}
              </span>
            )}
          </div>

          <div className="d-flex flex-wrap align-items-center gap-4 mb-4">
            <span className="fw-semibold">Cantidad</span>
            <div className="d-flex align-items-center border rounded-3 overflow-hidden">
              <button 
                className="border-0 px-3 py-2 bg-light" 
                onClick={() => setCount(Math.max(1, count - 1))}
              >
                −
              </button>
              <span className="px-4 py-2" style={{ minWidth: '50px', textAlign: 'center' }}>
                {count}
              </span>
              <button 
                className="border-0 px-3 py-2 bg-light" 
                onClick={() => setCount(count + 1)}
              >
                +
              </button>
            </div>
            <span className="text-muted small">stock disponible</span>
          </div>

          <div className="d-flex flex-column flex-sm-row gap-3 mb-5">
            <Button
              className="flex-fill py-2 rounded-pill fw-semibold border-0"
              style={{ backgroundColor: '#f85606', color: 'white' }}
              onClick={handleAddToCart}
            >
              🛒 Agregar al carrito
            </Button>
            <Button 
              variant="outline-secondary" 
              className="flex-fill py-2 rounded-pill fw-semibold"
              onClick={handleBuyNow}
            >
              💳 Comprar ahora
            </Button>
          </div>

          <div className="border-top pt-4">
            <Row className="g-3 text-center text-sm-start">
              <Col xs={4}>
                <CiDeliveryTruck size={24} className="text-muted mb-1" />
                <p className="small fw-semibold mb-0">Envíos a todo el país</p>
                <span className="small text-muted d-none d-sm-block">3 a 7 días</span>
              </Col>
              <Col xs={4}>
                <PiKeyReturnFill size={24} className="text-muted mb-1" />
                <p className="small fw-semibold mb-0">14 días de cambio</p>
                <span className="small text-muted d-none d-sm-block">sin cargo</span>
              </Col>
              <Col xs={4}>
                <BsShieldCheck size={24} className="text-muted mb-1" />
                <p className="small fw-semibold mb-0">Compra segura</p>
                <span className="small text-muted d-none d-sm-block">Mercado Pago</span>
              </Col>
            </Row>
          </div>

          <div className="mt-4 text-center text-sm-start">
            <span className="badge bg-light text-dark rounded-pill px-3 py-2 fw-normal">
              👗 Talle real • Curvy friendly • Moda sin tabúes
            </span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;