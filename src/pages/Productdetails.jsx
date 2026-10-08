// src/pages/ProductDetails.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { MdStar, MdStarHalf, MdStarOutline } from 'react-icons/md';
import { CiDeliveryTruck, CiHeart } from 'react-icons/ci';
import { BsShieldCheck, BsArrowLeft } from 'react-icons/bs';
import { PiKeyReturnFill } from 'react-icons/pi';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import productList from '../data/products.json';
import { isLoggedIn as isSessionActive, getSessionUser } from '../utils/session';
import './ProductDetails.css';

const ProductDetails = () => {
  const loggedIn = isSessionActive();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Estados de selección del cliente
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [allColors, setAllColors] = useState([]);
  const [allSizes, setAllSizes] = useState([]);
  const [currentStock, setCurrentStock] = useState(0);

  // Cargar producto y sus variantes desde Supabase
  useEffect(() => {
    const fetchProductAndVariants = async () => {
      setLoading(true);
      setActiveImage(0);
      setSelectedColor('');
      setSelectedSize('');
      setCurrentStock(0);
      
      try {
        const query = isNaN(id) 
          ? supabase.from('products').select('*').eq('id', id).single()
          : supabase.from('products').select('*').eq('id', parseInt(id)).single();

        const { data: productData, error: productError } = await query;
        
        if (!productError && productData) {
          setProduct(productData);

          // Cargar variantes desde Supabase
          const { data: variantsData, error: variantsError } = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', productData.id);

          if (!variantsError && variantsData && variantsData.length > 0) {
            setVariants(variantsData);
            // Extraer todos los colores y talles únicos disponibles para este producto
            setAllColors([...new Set(variantsData.map(v => v.color))]);
            setAllSizes([...new Set(variantsData.map(v => v.size))]);
          } else {
            setVariants([]);
            setAllColors([]);
            setAllSizes([]);
          }
        } else {
          // Fallback a JSON local si no está en Supabase
          const found = productList.find(p => p.id === parseInt(id) || p.id === id);
          setProduct(found);
          setVariants([]);
        }
      } catch (err) {
        console.error('Error al cargar producto:', err);
        const found = productList.find(p => p.id === parseInt(id) || p.id === id);
        setProduct(found);
        setVariants([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductAndVariants();
  }, [id]);

  // Actualizar stock cuando cambian color o talle
  useEffect(() => {
    if (selectedColor && selectedSize && variants.length > 0) {
      const match = variants.find(v => v.color === selectedColor && v.size === selectedSize);
      setCurrentStock(match ? match.stock : 0);
    }
  }, [selectedColor, selectedSize, variants]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ color: '#f85606' }}>
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

  const discount = product.discountPercentage || product.discount_percentage || 0;
  const price = product.price || 0;
  const precioFinal = discount > 0 
    ? Math.round(price - (price * discount / 100))
    : price;
  const rating = product.rating || 0;
  const brand = product.brand || 'Pin Ups';
  const title = product.name || product.title || 'Producto';

  let imagesArray = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    imagesArray = product.images;
  } else if (typeof product.images === 'string' && product.images.trim() !== '') {
    imagesArray = [product.images];
  } else if (product.thumbnail) {
    imagesArray = [product.thumbnail];
  } else if (product.image) {
    imagesArray = [product.image];
  } else {
    imagesArray = ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'];
  }

  const currentImage = imagesArray[activeImage] || imagesArray[0];

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
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const validarSeleccion = () => {
    if (variants.length > 0) {
      if (!selectedColor) {
        alert('⚠️ Por favor selecciona un color.');
        return false;
      }
      if (!selectedSize) {
        alert('⚠️ Por favor selecciona un talle.');
        return false;
      }
      if (currentStock <= 0) {
        alert('⚠️ Lo sentimos, la combinación seleccionada no tiene stock disponible.');
        return false;
      }
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!loggedIn) {
      alert('💄 Iniciá sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }
    if (!validarSeleccion()) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existIndex = cart.findIndex(
      i => i.id === product.id && i.selectedSize === selectedSize && i.selectedColor === selectedColor
    );

    if (existIndex !== -1) {
      cart[existIndex].quantity += count;
    } else {
      cart.push({ 
        ...product, 
        title: title, 
        thumbnail: imagesArray[0], 
        quantity: count, 
        discount_percentage: discount, 
        price: price,
        selectedSize: selectedSize || 'Único',
        selectedColor: selectedColor || 'Único'
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`🛍️ ¡Agregado al carrito!\n• ${title}\n• Color: ${selectedColor}\n• Talle: ${selectedSize}`);
  };

  const handleBuyNow = () => {
    if (!loggedIn) {
      alert('💄 Iniciá sesión para realizar la compra');
      navigate('/login');
      return;
    }
    if (!validarSeleccion()) return;

    const user = getSessionUser() || {};
    const telefonoUsuario = user.phone || user.telefono || 'No especificado';
    const emailUsuario = user.email || 'No especificado';
    const nombreUsuario =
      user.nombre ||
      (user.fName && user.lName ? `${user.fName} ${user.lName}` : user.fName) ||
      'Cliente Pin Ups';

    const precioUnitario = precioFinal;
    const subtotal = precioUnitario * count;

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
        talle: selectedSize || 'Único',
        color: selectedColor || 'Único',
        cantidad: count,
        precioUnitario: precioUnitario,
        subtotal: subtotal
      },
      total: subtotal,
      observaciones: `Prenda con Talle: ${selectedSize || 'Único'} y Color: ${selectedColor || 'Único'}. Factura tipo A/B/C.`,
      estado: 'pendiente'
    };

    const ordenes = JSON.parse(localStorage.getItem('ordenes')) || [];
    ordenes.push(orden);
    localStorage.setItem('ordenes', JSON.stringify(ordenes));
    localStorage.setItem('ultimaOrden', JSON.stringify(orden));
    
    navigate('/orden-confirmada');
  };

  return (
    <Container className="py-4 py-md-5">
      <div className="mb-4 d-flex align-items-center gap-2 text-muted small">
        <BsArrowLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <span>Volver</span>
        <span className="mx-1">/</span>
        <span className="text-dark fw-semibold text-truncate" style={{ maxWidth: '250px' }}>
          {title}
        </span>
      </div>

      <Row className="g-4 g-lg-5">
        <Col lg={6}>
          <div className="position-relative">
            <div className="overflow-hidden rounded-4 shadow-sm" style={{ backgroundColor: '#fef6f0' }}>
              <img
                src={currentImage}
                alt={title}
                className="img-fluid w-100"
                style={{ objectFit: 'contain', height: 'auto', maxHeight: '450px', minHeight: '300px' }}
                onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600')}
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
            {imagesArray.map((img, idx) => (
              <div
                key={idx}
                className={`border rounded-3 p-1 ${activeImage === idx ? 'border-warning shadow-sm' : 'border-light'}`}
                style={{ width: '70px', cursor: 'pointer', backgroundColor: '#fff' }}
                onClick={() => setActiveImage(idx)}
              >
                <img src={img} alt={`Ángulo ${idx + 1}`} className="w-100 rounded-2" style={{ height: '60px', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </Col>

        <Col lg={6}>
          <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
            <span className="text-uppercase small fw-semibold text-muted tracking-wide">{brand}</span>
            <span className="text-muted">•</span>
            <div className="d-flex align-items-center gap-1">
              {renderStars(rating)} <span className="text-muted small ms-1">({rating})</span>
            </div>
          </div>

          <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)' }}>{title}</h1>
          
          <p className="text-muted mb-4" style={{ lineHeight: 1.6 }}>
            {product.description || '👗 Prenda pensada para talles reales y curvy. Comodidad, estilo y amor propio.'}
          </p>

          <div className="mb-4">
            <span className="fw-bold" style={{ color: '#f85606', fontSize: 'clamp(1.8rem, 5vw, 2.2rem)' }}>
              {formatear(precioFinal)}
            </span>
            {discount > 0 && (
              <span className="text-muted text-decoration-line-through ms-2">{formatear(price)}</span>
            )}
          </div>

          {/* ========================================================== */}
          {/* SELECTORES DE COLOR Y TALLE VISIBLES DIRECTAMENTE */}
          {/* ========================================================== */}
          {allColors.length > 0 && (
            <div className="mb-3 p-3 bg-light rounded-4 border">
              <label className="fw-bold text-dark mb-2 d-block">
                🎨 Seleccioná el Color: <span className="text-primary fw-normal">{selectedColor || 'Ninguno'}</span>
              </label>
              <div className="d-flex flex-wrap gap-2">
                {allColors.map((color) => (
                  <Button
                    key={color}
                    size="sm"
                    variant={selectedColor === color ? "dark" : "outline-secondary"}
                    className="rounded-pill px-3 py-2 fw-semibold"
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {allSizes.length > 0 && (
            <div className="mb-4 p-3 bg-light rounded-4 border">
              <label className="fw-bold text-dark mb-2 d-block">
                📏 Seleccioná el Talle: <span className="text-primary fw-normal">{selectedSize || 'Ninguno'}</span>
              </label>
              <div className="d-flex flex-wrap gap-2">
                {allSizes.map((size) => (
                  <Button
                    key={size}
                    size="sm"
                    variant={selectedSize === size ? "dark" : "outline-secondary"}
                    className="rounded-pill px-3 py-2 fw-semibold"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>

              {selectedColor && selectedSize && (
                <div className="mt-3">
                  {currentStock > 0 ? (
                    <Badge bg="success" className="px-3 py-2">
                      ✅ Stock disponible: {currentStock} unidades
                    </Badge>
                  ) : (
                    <Badge bg="danger" className="px-3 py-2">
                      ❌ Sin stock para esta combinación exacta
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="d-flex flex-wrap align-items-center gap-4 mb-4">
            <span className="fw-semibold">Cantidad</span>
            <div className="d-flex align-items-center border rounded-3 overflow-hidden bg-white">
              <button className="border-0 px-3 py-2 bg-light" onClick={() => setCount(Math.max(1, count - 1))}>−</button>
              <span className="px-4 py-2" style={{ minWidth: '50px', textAlign: 'center' }}>{count}</span>
              <button className="border-0 px-3 py-2 bg-light" onClick={() => setCount(count + 1)}>+</button>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row gap-3 mb-5">
            <Button
              className="flex-fill py-3 rounded-pill fw-bold border-0 shadow-sm"
              style={{ backgroundColor: '#f85606', color: 'white' }}
              onClick={handleAddToCart}
            >
              🛒 Agregar al carrito
            </Button>
            <Button 
              variant="outline-secondary" 
              className="flex-fill py-3 rounded-pill fw-bold shadow-sm"
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
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;