import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { supabase } from '../config/supabase';

// Imagen local por defecto como respaldo seguro
import popUps1 from '../images/pop-ups1.png';

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
        <button 
          onClick={() => setShow(false)}
          className="position-absolute top-0 end-0 m-3 border-0 bg-dark bg-opacity-50 text-white rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: '32px', height: '32px', zIndex: 10, cursor: 'pointer' }}
        >
          &times;
        </button>
        
        {/* Contenedor de imagen con tamaño estricto y controlado */}
        <div style={{ width: '100%', height: '240px', backgroundColor: '#f8f9fa' }}>
          <img 
              src={popupUrl} 
              alt="Oferta Especial Pin Ups" 
              className="w-100 h-100" 
              style={{ objectFit: 'cover', objectPosition: 'center' }} 
              onError={(e) => { e.target.src = popUps1; }}
          />
        </div>
        
        <div className="p-4">
          <h2 className="fw-bold mb-2" style={{ color: '#f85606', fontSize: '1.5rem' }}>¡Edición Limitada!</h2>
          <p className="text-muted small mb-3">Selección exclusiva para tus curvas por tiempo limitado.</p>
          <Button 
              className="px-5 py-2 w-100 rounded-pill fw-semibold shadow-sm"
              style={{ backgroundColor: '#f85606', border: 'none' }} 
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