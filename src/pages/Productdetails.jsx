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

// Paleta chocolate Pin Ups
const THEME = {
  primary: "#3E2723",
  primaryDark: "#2D1B15",
  background: "#FFFFFF",
  backgroundAlt: "#F5F0EB",
  textPrimary: "#1A1A1A",
  textSecondary: "#4E342E",
  textMuted: "#8D6E63",
  border: "#D7CCC8",
  borderLight: "#EFEBE9",
};

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

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [allColors, setAllColors] = useState([]);
  const [allSizes, setAllSizes] = useState([]);
  const [currentStock, setCurrentStock] = useState(0);
  const [structuredImages, setStructuredImages] = useState([]);

  // -------------------- Cargar producto y variantes --------------------
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

          const rawImgs = Array.isArray(productData.images)
            ? productData.images
            : productData.images
            ? [productData.images]
            : [];

          const processedImgs = rawImgs
            .map((item) => {
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
            })
            .filter(Boolean);

          setStructuredImages(
            processedImgs.length > 0
              ? processedImgs
              : [
                  {
                    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
                    color: 'General',
                  },
                ]
          );

          const { data: variantsData, error: variantsError } = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', productData.id);

          if (!variantsError && variantsData && variantsData.length > 0) {
            setVariants(variantsData);
            setAllColors([...new Set(variantsData.map((v) => v.color))]);
            setAllSizes([...new Set(variantsData.map((v) => v.size))]);
          } else {
            setVariants([]);
            setAllColors([]);
            setAllSizes([]);
          }
        } else {
          const found = productList.find(
            (p) => p.id === parseInt(id) || p.id === id
          );
          setProduct(found);
          setStructuredImages([
            {
              url:
                found?.image ||
                found?.thumbnail ||
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
              color: 'General',
            },
          ]);
          setVariants([]);
        }
      } catch (err) {
        console.error('Error al cargar producto:', err);
        const found = productList.find(
          (p) => p.id === parseInt(id) || p.id === id
        );
        setProduct(found);
        setStructuredImages([
          {
            url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
            color: 'General',
          },
        ]);
        setVariants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndVariants();
  }, [id]);

  // -------------------- Extraer colores/talles del texto --------------------
  useEffect(() => {
    if (allColors.length === 0 && structuredImages.length > 0) {
      const imgColors = [...new Set(structuredImages.map((img) => img.color))].filter(
        (c) => c && c !== 'General'
      );
      if (imgColors.length > 0) setAllColors(imgColors);
    }

    if (allSizes.length === 0 && product?.description?.includes('Talles:')) {
      const parts = product.description.split('|');
      parts.forEach((part) => {
        if (part.includes('Talles:')) {
          const extractedSizes = part
            .replace('Talles:', '')
            .trim()
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
          setAllSizes(extractedSizes);
        }
        if (part.includes('Colores:') && allColors.length === 0) {
          const extractedColors = part
            .replace('Colores:', '')
            .trim()
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean);
          setAllColors(extractedColors);
        }
      });
    }
  }, [product, structuredImages, allColors.length, allSizes.length]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const imageIndex = structuredImages.findIndex(
      (img) => img.color.toLowerCase() === color.toLowerCase()
    );
    if (imageIndex !== -1) {
      setActiveImage(imageIndex);
    }
  };

  // -------------------- Actualizar stock --------------------
  useEffect(() => {
    if (selectedColor && selectedSize && variants.length > 0) {
      const match = variants.find(
        (v) =>
          v.color.toLowerCase() === selectedColor.toLowerCase() &&
          v.size.toLowerCase() === selectedSize.toLowerCase()
      );
      setCurrentStock(match ? match.stock : 10);
    } else {
      setCurrentStock(product?.stock || 10);
    }
  }, [selectedColor, selectedSize, variants, product]);

  if (loading) {
    return (
      <Container className="py-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div
          className="spinner-border"
          role="status"
          style={{ color: THEME.primary, width: '3rem', height: '3rem' }}
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 fw-medium tracking-wide" style={{ color: THEME.textMuted }}>
          Inspirando tu estilo...
        </p>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="fs-1 mb-2">✨</div>
        <h3 className="fw-bold" style={{ color: THEME.textPrimary }}>
          Prenda no encontrada
        </h3>
        <p style={{ color: THEME.textMuted }}>
          Parece que esta pieza ya no está disponible.
        </p>
        <Button
          onClick={() => navigate('/')}
          className="mt-3 rounded-pill px-5 py-2 shadow-sm border-0"
          style={{ backgroundColor: THEME.primary, color: '#FFFFFF' }}
        >
          Volver a la tienda
        </Button>
      </Container>
    );
  }

  const discount = product.discountPercentage || product.discount_percentage || 0;
  const price = product.price || 0;
  const precioFinal =
    discount > 0 ? Math.round(price - (price * discount) / 100) : price;
  const rating = product.rating || 5;
  const brand = product.brand || 'Pin Ups';
  const title = product.name || product.title || 'Producto';

  const currentImageObj = structuredImages[activeImage] || structuredImages[0];
  const currentImage =
    currentImageObj?.url ||
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600';

  const formatear = (val) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating)
        stars.push(<MdStar key={i} style={{ color: THEME.primary }} size={18} />);
      else if (i - 0.5 === rating)
        stars.push(<MdStarHalf key={i} style={{ color: THEME.primary }} size={18} />);
      else
        stars.push(
          <MdStarOutline
            key={i}
            style={{ color: THEME.textMuted, opacity: 0.5 }}
            size={18}
          />
        );
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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const validarSeleccion = () => {
    if (allColors.length > 0 && !selectedColor) {
      alert('⚠️ Por favor seleccioná un color antes de continuar.');
      return false;
    }
    if (allSizes.length > 0 && !selectedSize) {
      alert('⚠️ Por favor seleccioná un talle antes de continuar.');
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

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existIndex = cart.findIndex(
      (i) =>
        i.id === product.id &&
        i.selectedSize === selectedSize &&
        i.selectedColor === selectedColor
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
        selectedColor: selectedColor || 'Único',
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(
      `🛍️ ¡Agregado al carrito!\n\nPrenda: ${title}\nColor: ${
        selectedColor || 'Único'
      }\nTalle: ${selectedSize || 'Único'}\nCantidad: ${count}`
    );
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
        telefono: telefonoUsuario,
      },
      producto: {
        id: product.id,
        titulo: title,
        talle: selectedSize || 'Único',
        color: selectedColor || 'Único',
        cantidad: count,
        precioUnitario: precioUnitario,
        subtotal: subtotal,
      },
      total: subtotal,
      observaciones: `Prenda con Talle: ${selectedSize || 'Único'} y Color: ${
        selectedColor || 'Único'
      }.`,
      estado: 'pendiente',
    };

    const ordenes = JSON.parse(localStorage.getItem('ordenes')) || [];
    ordenes.push(orden);
    localStorage.setItem('ordenes', JSON.stringify(ordenes));
    localStorage.setItem('ultimaOrden', JSON.stringify(orden));

    navigate('/orden-confirmada');
  };

  return (
    <Container className="py-4 py-md-5 product-details-container">
      {/* Migas de pan */}
      <div
        className="mb-4 d-flex align-items-center gap-2 small cursor-pointer"
        onClick={() => navigate(-1)}
        style={{ width: 'fit-content', color: THEME.textMuted }}
      >
        <BsArrowLeft size={16} />
        <span className="fw-medium">Volver</span>
        <span className="mx-1">/</span>
        <span
          className="fw-semibold text-truncate"
          style={{ maxWidth: '280px', color: THEME.textPrimary }}
        >
          {title}
        </span>
      </div>

      <Row className="g-4 g-lg-5 align-items-start">
        {/* Imágenes */}
        <Col lg={6}>
          <div className="position-relative sticky-top" style={{ top: '2rem' }}>
            <div
              className="overflow-hidden rounded-5 shadow-sm position-relative"
              style={{
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: THEME.background,
                border: `1px solid ${THEME.borderLight}`,
              }}
            >
              <img
                src={currentImage}
                alt={title}
                className="img-fluid w-100 transition-transform duration-300"
                style={{ objectFit: 'contain', maxHeight: '520px', padding: '1rem' }}
                onError={(e) =>
                  (e.target.src =
                    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600')
                }
              />

              {discount > 0 && (
                <div
                  className="position-absolute top-0 start-0 mt-3 ms-3 px-3 py-1 rounded-pill fw-bold small shadow-sm"
                  style={{ backgroundColor: THEME.primary, color: '#FFFFFF' }}
                >
                  -{discount}% OFF
                </div>
              )}

              <div
                className="position-absolute top-0 end-0 mt-3 me-3 rounded-circle p-2 shadow-sm"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                }}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <CiHeart
                  size={24}
                  style={{
                    color: isFavorite ? THEME.primary : THEME.textPrimary,
                    fill: isFavorite ? THEME.primary : 'none',
                    strokeWidth: 1,
                  }}
                />
              </div>
            </div>

            {structuredImages.length > 1 && (
              <div className="d-flex gap-2 mt-3 justify-content-center flex-wrap">
                {structuredImages.map((imgObj, idx) => (
                  <div
                    key={idx}
                    className="rounded-4 overflow-hidden transition-all text-center p-1"
                    style={{
                      width: '80px',
                      cursor: 'pointer',
                      backgroundColor: THEME.background,
                      border:
                        activeImage === idx
                          ? `2px solid ${THEME.primary}`
                          : `1px solid ${THEME.border}`,
                      opacity: activeImage === idx ? 1 : 0.75,
                    }}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img
                      src={imgObj.url}
                      alt={`Vista ${idx + 1}`}
                      className="w-100 rounded-2"
                      style={{ height: '55px', objectFit: 'cover' }}
                    />
                    <span
                      className="d-block text-truncate mt-1"
                      style={{ fontSize: '10px', color: THEME.textMuted }}
                    >
                      {imgObj.color}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>

        {/* Info y compra */}
        <Col lg={6}>
          <div className="ps-lg-3">
            <div className="mb-2 d-flex flex-wrap align-items-center justify-content-between">
              <span
                className="text-uppercase small fw-bold tracking-wider"
                style={{ color: THEME.textMuted }}
              >
                {brand}
              </span>
              <div
                className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                style={{ backgroundColor: THEME.backgroundAlt }}
              >
                {renderStars(rating)}
                <span className="fw-bold small ms-1" style={{ color: THEME.textPrimary }}>
                  ({rating}.0)
                </span>
              </div>
            </div>

            <h1
              className="fw-bold mb-3"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                letterSpacing: '-0.5px',
                color: THEME.textPrimary,
              }}
            >
              {title}
            </h1>

            <p
              className="mb-4 fs-6"
              style={{ lineHeight: 1.7, color: THEME.textSecondary }}
            >
              {product.description ||
                '👗 Prenda pensada para talles reales y curvy. Comodidad, estilo y amor propio en cada detalle.'}
            </p>

            <div className="mb-4 d-flex align-items-baseline gap-3">
              <span
                className="fw-extrabold"
                style={{
                  color: THEME.primary,
                  fontSize: 'clamp(2rem, 4vw, 2.4rem)',
                }}
              >
                {formatear(precioFinal)}
              </span>
              {discount > 0 && (
                <span
                  className="text-decoration-line-through fs-5"
                  style={{ color: THEME.textMuted }}
                >
                  {formatear(price)}
                </span>
              )}
            </div>

            {/* Color */}
            {allColors.length > 0 && (
              <div
                className="mb-3 p-3 rounded-4"
                style={{
                  backgroundColor: THEME.background,
                  border: `1px solid ${THEME.borderLight}`,
                }}
              >
                <label
                  className="fw-bold mb-2 d-block small text-uppercase tracking-wide"
                  style={{ color: THEME.textPrimary }}
                >
                  🎨 Color:{" "}
                  <span className="fw-bold text-capitalize" style={{ color: THEME.primary }}>
                    {selectedColor || 'Elegí una opción'}
                  </span>
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {allColors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <Button
                        key={color}
                        size="sm"
                        className="rounded-pill px-4 py-2 fw-semibold text-capitalize"
                        onClick={() => handleColorSelect(color)}
                        style={{
                          backgroundColor: isSelected ? THEME.primary : 'transparent',
                          color: isSelected ? '#FFFFFF' : THEME.textPrimary,
                          border: `1px solid ${
                            isSelected ? THEME.primary : THEME.border
                          }`,
                        }}
                      >
                        {color}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Talle */}
            {allSizes.length > 0 && (
              <div
                className="mb-4 p-3 rounded-4"
                style={{
                  backgroundColor: THEME.background,
                  border: `1px solid ${THEME.borderLight}`,
                }}
              >
                <label
                  className="fw-bold mb-2 d-block small text-uppercase tracking-wide"
                  style={{ color: THEME.textPrimary }}
                >
                  📏 Talle:{" "}
                  <span className="fw-bold" style={{ color: THEME.primary }}>
                    {selectedSize || 'Elegí una opción'}
                  </span>
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {allSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <Button
                        key={size}
                        size="sm"
                        className="rounded-pill px-4 py-2 fw-semibold"
                        onClick={() => setSelectedSize(size)}
                        style={{
                          backgroundColor: isSelected ? THEME.primary : 'transparent',
                          color: isSelected ? '#FFFFFF' : THEME.textPrimary,
                          border: `1px solid ${
                            isSelected ? THEME.primary : THEME.border
                          }`,
                        }}
                      >
                        {size}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cantidad */}
            <div className="d-flex align-items-center gap-4 mb-4">
              <span
                className="fw-bold small text-uppercase"
                style={{ color: THEME.textMuted }}
              >
                Cantidad
              </span>
              <div
                className="d-flex align-items-center rounded-pill overflow-hidden"
                style={{
                  backgroundColor: THEME.background,
                  border: `1px solid ${THEME.border}`,
                }}
              >
                <button
                  className="border-0 px-3 py-2 bg-transparent fw-bold"
                  style={{ color: THEME.textPrimary }}
                  onClick={() => setCount(Math.max(1, count - 1))}
                >
                  −
                </button>
                <span
                  className="px-3 py-1 fw-bold"
                  style={{ minWidth: '40px', textAlign: 'center', color: THEME.textPrimary }}
                >
                  {count}
                </span>
                <button
                  className="border-0 px-3 py-2 bg-transparent fw-bold"
                  style={{ color: THEME.textPrimary }}
                  onClick={() => setCount(count + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Botones */}
            <div className="d-flex flex-column flex-sm-row gap-3 mb-5">
              <Button
                className="flex-fill py-3 rounded-pill fw-bold border-0 shadow"
                style={{
                  backgroundColor: THEME.primary,
                  color: '#FFFFFF',
                  letterSpacing: '0.5px',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = THEME.primaryDark)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = THEME.primary)
                }
                onClick={handleAddToCart}
              >
                🛒 Agregar al carrito
              </Button>

              <Button
                className="flex-fill py-3 rounded-pill fw-bold shadow-sm border-0"
                style={{
                  backgroundColor: THEME.primaryDark,
                  color: '#FFFFFF',
                  letterSpacing: '0.5px',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#1A0F0A')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = THEME.primaryDark)
                }
                onClick={handleBuyNow}
              >
                💳 Comprar ahora
              </Button>
            </div>

            {/* Beneficios */}
            <div
              className="border-top pt-4"
              style={{ borderColor: THEME.borderLight }}
            >
              <Row className="g-3 text-center text-sm-start">
                <Col xs={4} className="d-flex flex-column align-items-center align-items-sm-start">
                  <div
                    className="p-2 rounded-3 mb-2"
                    style={{ backgroundColor: THEME.backgroundAlt, color: THEME.textPrimary }}
                  >
                    <CiDeliveryTruck size={22} />
                  </div>
                  <p className="small fw-bold mb-0" style={{ color: THEME.textPrimary }}>
                    Envíos país
                  </p>
                  <span
                    className="small d-none d-sm-block"
                    style={{ color: THEME.textMuted }}
                  >
                    3 a 7 días hábiles
                  </span>
                </Col>

                <Col xs={4} className="d-flex flex-column align-items-center align-items-sm-start">
                  <div
                    className="p-2 rounded-3 mb-2"
                    style={{ backgroundColor: THEME.backgroundAlt, color: THEME.textPrimary }}
                  >
                    <PiKeyReturnFill size={22} />
                  </div>
                  <p className="small fw-bold mb-0" style={{ color: THEME.textPrimary }}>
                    Cambios
                  </p>
                  <span
                    className="small d-none d-sm-block"
                    style={{ color: THEME.textMuted }}
                  >
                    14 días sin cargo
                  </span>
                </Col>

                <Col xs={4} className="d-flex flex-column align-items-center align-items-sm-start">
                  <div
                    className="p-2 rounded-3 mb-2"
                    style={{ backgroundColor: THEME.backgroundAlt, color: THEME.textPrimary }}
                  >
                    <BsShieldCheck size={22} />
                  </div>
                  <p className="small fw-bold mb-0" style={{ color: THEME.textPrimary }}>
                    Pago seguro
                  </p>
                  <span
                    className="small d-none d-sm-block"
                    style={{ color: THEME.textMuted }}
                  >
                    Mercado Pago
                  </span>
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