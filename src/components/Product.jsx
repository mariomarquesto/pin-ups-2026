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
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data && data.length > 0) {
          console.log('✅ Productos cargados desde Supabase:', data.length);
          setProductos(data);
        } else {
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
        // Soporte tanto para Supabase (name, images[], compare_at_price) como para JSON antiguo
        const title = item.name || item.title || 'Producto';
        const price = item.price || 0;
        
        // Manejo de imágenes (si es array de Supabase usa la primera, si es string usa esa, o un fallback seguro)
        let imageUrl = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600';
        if (Array.isArray(item.images) && item.images.length > 0) {
          imageUrl = item.images[0];
        } else if (item.thumbnail) {
          imageUrl = item.thumbnail;
        } else if (item.image) {
          imageUrl = item.image;
        }

        // Cálculo de descuento basado en compare_at_price si existe
        let discount = item.discountPercentage || item.discount_percentage || 0;
        if (!discount && item.compare_at_price && item.compare_at_price > price) {
          discount = Math.round(((item.compare_at_price - price) / item.compare_at_price) * 100);
        }

        const finalPrice = price;
        const brand = item.brand || 'Pin-Ups Indumentaria';
        const rating = item.rating || 5;
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
                      {item.compare_at_price && item.compare_at_price > price && (
                        <span className="text-decoration-line-through text-muted small">
                          {formatearPrecio(item.compare_at_price)}
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