// src/components/OfertaPopup.jsx

import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { supabase } from '../config/supabase';

// Imagen local por defecto como respaldo seguro
import popUps1 from '../images/pop-ups1.png';

// Paleta chocolate Pin Ups
const THEME = {
  primary: "#3E2723",       // chocolate oscuro (marca principal)
  primaryDark: "#2D1B15",   // chocolate más oscuro (hover)
  background: "#FFFFFF",    // blanco puro
  backgroundAlt: "#F5F0EB", // blanco chocolate (fondo de la imagen)
  textLight: "#F5F0EB",     // blanco chocolate (textos sobre fondo oscuro)
  textSecondary: "#4E342E", // chocolate medio (textos secundarios)
  border: "#D7CCC8",        // chocolate claro (bordes)
};

function OfertaPopup() {
  const [show, setShow] = useState(false);
  const [popupUrl, setPopupUrl] = useState(popUps1);

  useEffect(() => {
    const fetchPopupConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('popup_image_url')
          .eq('id', 1)
          .single();

        if (!error && data && data.popup_image_url && data.popup_image_url.trim() !== '') {
          setPopupUrl(data.popup_image_url);
        }
      } catch (err) {
        console.log('Usando popup por defecto local:', err);
      }
    };

    fetchPopupConfig();

    // Mostrar el popup a los 3 segundos de ingresar
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal show={show} onHide={() => setShow(false)} centered size="md">
      <Modal.Body className="text-center p-0 position-relative rounded-4 overflow-hidden bg-white">
        {/* Botón cerrar */}
        <button
          onClick={() => setShow(false)}
          className="position-absolute top-0 end-0 m-3 border-0 rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: '32px',
            height: '32px',
            zIndex: 10,
            cursor: 'pointer',
            backgroundColor: 'rgba(62, 39, 35, 0.7)',
            color: THEME.textLight,
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'rgba(62, 39, 35, 1)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'rgba(62, 39, 35, 0.7)')
          }
        >
          &times;
        </button>

        {/* Imagen */}
        <div
          style={{
            width: '100%',
            height: '240px',
            backgroundColor: THEME.backgroundAlt,
          }}
        >
          <img
            src={popupUrl}
            alt="Oferta Especial Pin Ups"
            className="w-100 h-100"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            onError={(e) => {
              e.target.src = popUps1;
            }}
          />
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h2
            className="fw-bold mb-2"
            style={{ color: THEME.primary, fontSize: '1.5rem' }}
          >
            ¡Edición Limitada!
          </h2>

          <p className="small mb-3" style={{ color: THEME.textSecondary }}>
            Selección exclusiva para tus curvas por tiempo limitado.
          </p>

          <Button
            className="px-5 py-2 w-100 rounded-pill fw-semibold shadow-sm"
            style={{
              backgroundColor: THEME.primary,
              border: 'none',
              color: THEME.textLight,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = THEME.primaryDark)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = THEME.primary)
            }
            onClick={() => setShow(false)}
          >
            Comprar Ahora
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default OfertaPopup;