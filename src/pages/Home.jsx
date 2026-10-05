import { useState, useEffect } from 'react';
import Slider from '../../src/components/Slider';
import ProductContainer from '../../src/components/JustForYou';
import { Container } from 'react-bootstrap';
import Categories from '../components/Categories';
import OfertaPopup from '../components/OfertaPopup';
import { supabase } from '../config/supabase';

const Home = () => {
  const [bannerUrl, setBannerUrl] = useState('/pin-ups-baner.png');

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('banner_image_url')
          .eq('id', 1)
          .single();

        if (data && data.banner_image_url && data.banner_image_url.trim() !== '') {
          setBannerUrl(data.banner_image_url);
        } else {
          setBannerUrl('/pin-ups-baner.png');
        }
      } catch (error) {
        console.log('Usando banner por defecto o tabla no creada aún:', error);
        setBannerUrl('/pin-ups-baner.png');
      }
    };

    fetchBanner();
  }, []);

  return (
    <>
      {/* Slider - ancho completo con un margen superior (mt-3) para separarlo del navbar */}
      <div className="w-100 mt-3">
        <Slider />
      </div>
      
      <Categories />

      {/* Contenido con container para mantener márgenes */}
      <Container>
        <div className="banner mt-3">
          <img 
            src={bannerUrl} 
            alt="Banner Image" 
            style={{ 
              width: '100%', 
              height: '180px',            
              maxHeight: '180px',         
              borderRadius: '8px', 
              objectFit: 'cover',         
              objectPosition: 'center'    
            }} 
            onError={(e) => { e.target.src = '/pin-ups-baner.png'; }} 
          />
        </div>
        <OfertaPopup />
        <ProductContainer />
      </Container>
    </>
  );
};

export default Home;