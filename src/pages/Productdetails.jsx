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
  
  // Array estructurado de imágenes con sus colores asociados [{url, color}]
  const [structuredImages, setStructuredImages] = useState([]);

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

          // Procesar imágenes estructuradas (JSON o Strings directos)
          const rawImgs = Array.isArray(productData.images) ? productData.images : (productData.images ? [productData.images] : []);
          const processedImgs = rawImgs.map(item => {
            if (typeof item !== 'string') return null;
            const trimmed = item.trim();
            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
              try {
                const parsed = JSON.parse(trimmed);
                return { url: parsed.url || '', color: parsed.color || 'General' };
              } catch (e) {
                return { url: trimmed, color: 'General' };
              }
            }
            return trimmed ? { url: trimmed, color: 'General' } : null;
          }).filter(Boolean);

          setStructuredImages(processedImgs.length > 0 ? processedImgs : [{ url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600', color: 'General' }]);

          // Cargar variantes desde Supabase
          const { data: variantsData, error: variantsError } = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', productData.id);

          if (!variantsError && variantsData && variantsData.length > 0) {
            setVariants(variantsData);
            setAllColors([...new Set(variantsData.map(v => v.color))]);
            setAllSizes([...new Set(variantsData.map(v => v.size))]);
          } else {
            setVariants([]);
            setAllColors([]);
            setAllSizes([]);
          }
        } else {
          const found = productList.find(p => p.id === parseInt(id) || p.id === id);
          setProduct(found);
          setStructuredImages([{ url: found?.image || found?.thumbnail || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600', color: 'General' }]);
          setVariants([]);
        }
      } catch (err) {
        console.error('Error al cargar producto:', err);
        const found = productList.find(p => p.id === parseInt(id) || p.id === id);
        setProduct(found);
        setStructuredImages([{ url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600', color: 'General' }]);
        setVariants([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductAndVariants();
  }, [id]);

  // Extraer colores y talles del texto estructurado de la descripción si no vienen de variantes de tabla
  useEffect(() => {
    if (allColors.length === 0 && structuredImages.length > 0) {
      const imgColors = [...new Set(structuredImages.map(img => img.color))].filter(c => c && c !== 'General');
      if (imgColors.length > 0) setAllColors(imgColors);
    }
    
    if (allSizes.length === 0 && product?.description?.includes('Talles:')) {
      const parts = product.description.split('|');
      parts.forEach(part => {
        if (part.includes('Talles:')) {
          const extractedSizes = part.replace('Talles:', '').trim().split(',').map(s => s.trim()).filter(Boolean);
          setAllSizes(extractedSizes);
        }
        if (part.includes('Colores:') && allColors.length === 0) {
          const extractedColors = part.replace('Colores:', '').trim().split(',').map(c => c.trim()).filter(Boolean);
          setAllColors(extractedColors);
        }
      });
    }
  }, [product, structuredImages, allColors.length, allSizes.length]);

  // Cambiar foto automáticamente al elegir color
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const imageIndex = structuredImages.findIndex(img => img.color.toLowerCase() === color.toLowerCase());
    if (imageIndex !== -1) {
      setActiveImage(imageIndex);
    }
  };

  // Actualizar stock cuando cambian color o talle
  useEffect(() => {
    if (selectedColor && selectedSize && variants.length > 0) {
      const match = variants.find(v => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size.toLowerCase() === selectedSize.toLowerCase());
      setCurrentStock(match ? match.stock : 10);
    } else {
      setCurrentStock(product?.stock || 10);
    }
  }, [selectedColor, selectedSize, variants, product]);

  if (loading) {
    return (
      <Container className="py-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="spinner-border" role="status" style={{ color: '#f85606', width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-3 fw-medium tracking-wide">Inspirando tu estilo...</p>
      </Container>
    );
  }

  if (!product) return (
    <Container className="py-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="fs-1 mb-2">✨</div>
      <h3 className="fw-bold text-dark">Prenda no encontrada</h3>
      <p className="text-muted">Parece que esta pieza ya no está disponible.</p>
      <Button variant="dark" onClick={() => navigate('/')} className="mt-3 rounded-pill px-5 py-2 shadow-sm">
        Volver a la tienda
      </Button>
    </Container>
  );

  const discount = product.discountPercentage || product.discount_percentage || 0;
  const price = product.price || 0;
  const precioFinal = discount > 0 
    ? Math.round(price - (price * discount / 100))
    : price;
  const rating = product.rating || 5;
  const brand = product.brand || 'Pin Ups';
  const title = product.name || product.title || 'Producto';

  const currentImageObj = structuredImages[activeImage] || structuredImages[0];
  const currentImage = currentImageObj?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600';

  const formatear = (val) => new Intl.NumberFormat('es-AR', { 
    style: 'currency', 
    currency: 'ARS', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(val);

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) stars.push(<MdStar key={i} className="text-warning" size={18} />);
      else if (i - 0.5 === rating) stars.push(<MdStarHalf key={i} className="text-warning" size={18} />);
      else stars.push(<MdStarOutline key={i} className="text-muted opacity-50" size={18} />);
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

  // VALIDACIÓN ESTRICTA DE SELECCIÓN DE TALLE Y COLOR
  const validarSeleccion = () => {
    if (allColors.length > 0 && !selectedColor) {
      alert('⚠️ Por favor selecciona un color antes de continuar.');
      return false;
    }
    if (allSizes.length > 0 && !selectedSize) {
      alert('⚠️ Por favor selecciona un talle antes de continuar.');
      return false;
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
        thumbnail: currentImage, 
        quantity: count, 
        discount_percentage: discount, 
        price: price,
        selectedSize: selectedSize || 'Único',
        selectedColor: selectedColor || 'Único'
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`🛍️ ¡Agregado al carrito!\n\nPrenda: ${title}\nColor: ${selectedColor || 'Único'}\nTalle: ${selectedSize || 'Único'}\nCantidad: ${count}`);
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
      observaciones: `Prenda con Talle: ${selectedSize || 'Único'} y Color: ${selectedColor || 'Único'}.`,
      estado: 'pendiente'
    };

    const ordenes = JSON.parse(localStorage.getItem('ordenes')) || [];
    ordenes.push(orden);
    localStorage.setItem('ordenes', JSON.stringify(ordenes));
    localStorage.setItem('ultimaOrden', JSON.stringify(orden));
    
    navigate('/orden-confirmada');
  };

  return (
    <Container className="py-4 py-md-5 product-details-container">
      {/* Migas de pan / Volver */}
      <div className="mb-4 d-flex align-items-center gap-2 text-muted small cursor-pointer" onClick={() => navigate(-1)} style={{ width: 'fit-content' }}>
        <BsArrowLeft size={16} />
        <span className="fw-medium">Volver</span>
        <span className="mx-1 text-black-50">/</span>
        <span className="text-dark fw-semibold text-truncate" style={{ maxWidth: '280px' }}>
          {title}
        </span>
      </div>

      <Row className="g-4 g-lg-5 align-items-start">
        {/* Columna de Imágenes */}
        <Col lg={6}>
          <div className="position-relative sticky-top" style={{ top: '2rem' }}>
            <div className="overflow-hidden rounded-5 shadow-sm border border-light-subtle position-relative bg-white" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={currentImage}
                alt={title}
                className="img-fluid w-100 transition-transform duration-300"
                style={{ objectFit: 'contain', maxHeight: '520px', padding: '1rem' }}
                onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600')}
              />
              
              {discount > 0 && (
                <div className="position-absolute top-0 start-0 mt-3 ms-3 bg-dark text-white px-3 py-1 rounded-pill fw-bold small shadow-sm">
                  -{discount}% OFF
                </div>
              )}
              
              <div 
                className="position-absolute top-0 end-0 mt-3 me-3 bg-white bg-opacity-75 backdrop-blur rounded-circle p-2 shadow-sm transition-transform hover-scale"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <CiHeart 
                  size={24} 
                  className={isFavorite ? 'text-danger' : 'text-dark'} 
                  style={{ fill: isFavorite ? '#f85606' : 'none', strokeWidth: 1 }}
                />
              </div>
            </div>
            
            {/* Miniaturas con etiqueta de color */}
            {structuredImages.length > 1 && (
              <div className="d-flex gap-2 mt-3 justify-content-center flex-wrap">
                {structuredImages.map((imgObj, idx) => (
                  <div
                    key={idx}
                    className={`rounded-4 overflow-hidden border transition-all text-center p-1 ${activeImage === idx ? 'border-dark shadow-sm ring-2' : 'border-light opacity-75'}`}
                    style={{ width: '80px', cursor: 'pointer', backgroundColor: '#fff' }}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img src={imgObj.url} alt={`Vista ${idx + 1}`} className="w-100 rounded-2" style={{ height: '55px', objectFit: 'cover' }} />
                    <span className="d-block text-truncate text-muted mt-1" style={{ fontSize: '10px' }}>{imgObj.color}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>

        {/* Columna de Información y Compra */}
        <Col lg={6}>
          <div className="ps-lg-3">
            <div className="mb-2 d-flex flex-wrap align-items-center justify-content-between">
              <span className="text-uppercase small fw-bold tracking-wider text-muted">{brand}</span>
              <div className="d-flex align-items-center gap-1 bg-light px-2 py-1 rounded-pill">
                {renderStars(rating)} 
                <span className="text-dark fw-bold small ms-1">({rating}.0)</span>
              </div>
            </div>

            <h1 className="fw-bold mb-3 text-dark" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.5px' }}>
              {title}
            </h1>
            
            <p className="text-secondary mb-4 fs-6" style={{ lineHeight: 1.7 }}>
              {product.description || '👗 Prenda pensada para talles reales y curvy. Comodidad, estilo y amor propio en cada detalle.'}
            </p>

            <div className="mb-4 d-flex align-items-baseline gap-3">
              <span className="fw-extrabold" style={{ color: '#f85606', fontSize: 'clamp(2rem, 4vw, 2.4rem)' }}>
                {formatear(precioFinal)}
              </span>
              {discount > 0 && (
                <span className="text-muted text-decoration-line-through fs-5">{formatear(price)}</span>
              )}
            </div>

            {/* SELECCIÓN DE COLOR */}
            {allColors.length > 0 && (
              <div className="mb-3 p-3 bg-white rounded-4 border border-light-subtle shadow-2xs">
                <label className="fw-bold text-dark mb-2 d-block small text-uppercase tracking-wide">
                  🎨 Color: <span className="text-primary fw-bold text-capitalize">{selectedColor || 'Elegí una opción'}</span>
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {allColors.map((color) => (
                    <Button
                      key={color}
                      size="sm"
                      variant={selectedColor === color ? "dark" : "outline-light"}
                      className={`rounded-pill px-4 py-2 fw-semibold text-capitalize ${selectedColor === color ? 'shadow-sm' : 'text-dark border-secondary-subtle'}`}
                      onClick={() => handleColorSelect(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* SELECCIÓN DE TALLE */}
            {allSizes.length > 0 && (
              <div className="mb-4 p-3 bg-white rounded-4 border border-light-subtle shadow-2xs">
                <label className="fw-bold text-dark mb-2 d-block small text-uppercase tracking-wide">
                  📏 Talle: <span className="text-primary fw-bold">{selectedSize || 'Elegí una opción'}</span>
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {allSizes.map((size) => (
                    <Button
                      key={size}
                      size="sm"
                      variant={selectedSize === size ? "dark" : "outline-light"}
                      className={`rounded-pill px-4 py-2 fw-semibold ${selectedSize === size ? 'shadow-sm' : 'text-dark border-secondary-subtle'}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* CANTIDAD */}
            <div className="d-flex align-items-center gap-4 mb-4">
              <span className="fw-bold small text-uppercase text-muted">Cantidad</span>
              <div className="d-flex align-items-center border border-secondary-subtle rounded-pill overflow-hidden bg-white shadow-2xs">
                <button className="border-0 px-3 py-2 bg-transparent text-dark fw-bold" onClick={() => setCount(Math.max(1, count - 1))}>−</button>
                <span className="px-3 py-1 fw-bold text-dark" style={{ minWidth: '40px', textAlign: 'center' }}>{count}</span>
                <button className="border-0 px-3 py-2 bg-transparent text-dark fw-bold" onClick={() => setCount(count + 1)}>+</button>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="d-flex flex-column flex-sm-row gap-3 mb-5">
              <Button
                className="flex-fill py-3 rounded-pill fw-bold border-0 shadow text-white"
                style={{ backgroundColor: '#f85606', letterSpacing: '0.5px' }}
                onClick={handleAddToCart}
              >
                🛒 Agregar al carrito
              </Button>
              <Button 
                variant="dark"
                className="flex-fill py-3 rounded-pill fw-bold shadow-sm"
                style={{ letterSpacing: '0.5px' }}
                onClick={handleBuyNow}
              >
                💳 Comprar ahora
              </Button>
            </div>

            {/* ICONOS / BENEFICIOS */}
            <div className="border-top pt-4 border-light-subtle">
              <Row className="g-3 text-center text-sm-start">
                <Col xs={4} className="d-flex flex-column align-items-center align-items-sm-start">
                  <div className="p-2 bg-light rounded-3 mb-2 text-dark">
                    <CiDeliveryTruck size={22} />
                  </div>
                  <p className="small fw-bold mb-0 text-dark">Envíos país</p>
                  <span className="small text-muted d-none d-sm-block">3 a 7 días hábiles</span>
                </Col>
                <Col xs={4} className="d-flex flex-column align-items-center align-items-sm-start">
                  <div className="p-2 bg-light rounded-3 mb-2 text-dark">
                    <PiKeyReturnFill size={22} />
                  </div>
                  <p className="small fw-bold mb-0 text-dark">Cambios</p>
                  <span className="small text-muted d-none d-sm-block">14 días sin cargo</span>
                </Col>
                <Col xs={4} className="d-flex flex-column align-items-center align-items-sm-start">
                  <div className="p-2 bg-light rounded-3 mb-2 text-dark">
                    <BsShieldCheck size={22} />
                  </div>
                  <p className="small fw-bold mb-0 text-dark">Pago seguro</p>
                  <span className="small text-muted d-none d-sm-block">Mercado Pago</span>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;