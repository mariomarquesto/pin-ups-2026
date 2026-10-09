// src/components/Slider.jsx

import { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { supabase } from '../config/supabase';

// Paleta chocolate Pin Ups
const THEME = {
  primary: "#3E2723",
  primaryDark: "#2D1B15",
  backgroundAlt: "#F5F0EB",
  border: "#D7CCC8",
};

const fallbackImages = [
  '/pin-ups1.png',
  '/pin-ups2.png',
  '/pin-ups3.png',
  '/pin-ups4.png',
  '/pin-ups5.png',
  '/pin-ups6.png',
];

function Slider() {
  const [slides, setSlides] = useState(fallbackImages);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const { data, error } = await supabase
          .from('slider_images')
          .select('image_url')
          .order('order_index', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const urls = data.map((item) => item.image_url);
          setSlides(urls);
        }
      } catch (err) {
        console.error('Error al cargar imágenes de Supabase:', err);
      }
    }

    fetchSlides();
  }, []);

  return (
    <div className="container-fluid p-0 m-0" style={{ width: '100%' }}>
      <Carousel
        data-bs-theme="dark"
        interval={4000}
        style={{
          backgroundColor: THEME.backgroundAlt,
        }}
      >
        {slides.map((url, index) => (
          <Carousel.Item key={index}>
            <div
              style={{
                width: '100%',
                height: '450px',
                overflow: 'hidden',
                backgroundColor: THEME.backgroundAlt,
              }}
            >
              <img
                className="d-block w-100 h-100"
                src={url}
                alt={`Slide ${index + 1}`}
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default Slider;