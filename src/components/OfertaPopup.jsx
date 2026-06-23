import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// 1. Cambiamos el nombre de la variable (sin guiones)
import popUps1 from '../images/pop-ups1.png';

function OfertaPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal show={show} onHide={() => setShow(false)} centered size="lg">
      <Modal.Body className="text-center p-0 position-relative">
        <button 
          onClick={() => setShow(false)}
          className="position-absolute top-0 end-0 m-3 border-0 bg-transparent fs-4"
          style={{ zIndex: 1 }}
        >
          &times;
        </button>
        
        {/* 2. Usamos la variable importada aquí */}
        <img 
            src={popUps1} 
            alt="Oferta Especial Pin Ups" 
            className="img-fluid rounded" 
        />
        
        <div className="p-4">
          <h2 style={{ color: '#f85606' }}>¡Edición Limitada!</h2>
          <p className="fs-5 text-muted">Selección exclusiva para tus curvas por tiempo limitado.</p>
          <Button 
              className="px-5 py-2 mt-2"
              style={{ backgroundColor: '#f85606', border: 'none', borderRadius: '50px' }} 
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