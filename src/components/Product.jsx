import { useEffect, useRef, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import './Product.css';
import productList from '../data/products.json';

const formatearPrecio = (precio) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
};

function Product() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardsRef = useRef([]);

  // Cargar productos desde Supabase (y fallback a JSON)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Intentar cargar desde Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data && data.length > 0) {
          console.log('✅ Productos cargados desde Supabase:', data.length);
          setProductos(data);
        } else {
          // Fallback: usar JSON local
          console.log('📦 Usando productos locales (JSON)');
          setProductos(productList);
        }
      } catch (err) {
        console.error('Error al cargar de Supabase, usando JSON local:', err);
        setProductos(productList);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Efecto cascada con Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('card-visible');
          }, index * 100);
        }
      });
    }, { threshold: 0.1 });

    cardsRef.current.forEach((card) => card && observer.observe(card));
    
    return () => observer.disconnect();
  }, [productos]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-2">Cargando colección Pin-Ups...</p>
      </div>
    );
  }

  if (!productos || productos.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className='d-flex flex-wrap justify-content-center gap-4 py-4'>
      {productos.map((item, index) => {
        // Manejar descuento (funciona con JSON o Supabase)
        const discount = item.discountPercentage || item.discount_percentage || 0;
        const price = item.price || 0;
        const finalPrice = discount > 0 
          ? Math.round(price - (price * discount / 100))
          : price;
        const imageUrl = item.thumbnail || item.image || 'https://via.placeholder.com/300';
        const title = item.title || 'Producto';
        const brand = item.brand || '';
        const rating = item.rating || 0;
        const productId = item.id;
        
        return (
          <div 
            key={productId} 
            ref={el => cardsRef.current[index] = el} 
            className="card-cascade"
          >
            <Link to={`/productdetails/${productId}`} className='product-link'>
              <Card className='product-card h-100 border-0 shadow-sm'>
                <div className="img-container position-relative overflow-hidden">
                  {discount > 0 && (
                    <span className="position-absolute top-0 end-0 m-2 px-2 py-1 bg-danger text-white rounded-pill small fw-bold">
                      -{discount}%
                    </span>
                  )}
                  <Card.Img 
                    variant="top" 
                    src={imageUrl} 
                    className='product-img' 
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  {brand && (
                    <p className="text-muted small mb-1">{brand}</p>
                  )}
                  <Card.Title className='fs-6 fw-bold text-dark mb-2'>
                    {title}
                  </Card.Title>
                  {rating > 0 && (
                    <div className="d-flex align-items-center gap-1 mb-2">
                      <span className="text-warning">★</span>
                      <span className="small text-muted">{rating}</span>
                    </div>
                  )}
                  <div className="mt-auto">
                    <div className="d-flex align-items-center gap-2">
                      <span className='fw-bold price-pulse' style={{ color: '#f85606', fontSize: '1.2rem' }}>
                        {formatearPrecio(finalPrice)}
                      </span>
                      {discount > 0 && (
                        <span className="text-decoration-line-through text-muted small">
                          {formatearPrecio(price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default Product;