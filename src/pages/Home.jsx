// src/pages/Home.jsx

import { useState, useEffect } from 'react';
import Slider from '../../src/components/Slider';
import ProductContainer from '../../src/components/JustForYou';
import { Container } from 'react-bootstrap';
import Categories from '../components/Categories';
import OfertaPopup from '../components/OfertaPopup';
import { supabase } from '../config/supabase';

// Paleta chocolate Pin Ups
const THEME = {
  primary: "#3E2723",
  background: "#FFFFFF",
  backgroundAlt: "#F5F0EB",
  border: "#D7CCC8",
};

const Home = () => {
  const [bannerUrl, setBannerUrl] = useState('/pin-ups-baner.png');

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const { data } = await supabase
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
    <div style={{ backgroundColor: THEME.backgroundAlt, minHeight: '100vh' }}>
      {/* Slider */}
      <div className="w-100 mt-3">
        <Slider />
      </div>

      <Categories />

      {/* Contenido con container */}
      <Container>
        <div className="banner mt-3">
          <img
            src={bannerUrl}
            alt="Banner Image"
            style={{
              width: '100%',
              height: '180px',
              maxHeight: '180px',
              borderRadius: '12px',
              objectFit: 'cover',
              objectPosition: 'center',
              border: `1px solid ${THEME.border}`,
              boxShadow: '0 4px 12px rgba(62, 39, 35, 0.08)',
            }}
            onError={(e) => {
              e.target.src = '/pin-ups-baner.png';
            }}
          />
        </div>

        <OfertaPopup />
        <ProductContainer />
      </Container>
    </div>
  );
};

export default Home;