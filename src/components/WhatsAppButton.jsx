// src/components/WhatsAppButton.jsx
import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Obtener el nombre del usuario logueado
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('users'));
    if (loggedUser && loggedUser.fName) {
      setUserName(loggedUser.fName);
    } else {
      setUserName('cliente');
    }
  }, []);

  // Tu número de WhatsApp
  const phoneNumber = "5493813471147";
  
  // Mensaje personalizado con el nombre del usuario
  const message = encodeURIComponent(`¡Hola! 👋 Soy ${userName} de la web de Pin Ups y vi sus productos 😍 Me encantaría consultar sobre:`);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  // Detectar scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 300) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mostrar tooltip después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showTooltip && (
        <div className="whatsapp-tooltip">
          💬 ¡Escribinos! Te esperamos 💖
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`whatsapp-button ${isVisible ? 'whatsapp-visible' : 'whatsapp-hidden'}`}
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp className="whatsapp-icon" />
        <span className="whatsapp-pulse"></span>
      </a>

      <style>{`
        .whatsapp-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          background-color: #25D366;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          z-index: 1000;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .whatsapp-button:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
          background-color: #20b859;
        }

        .whatsapp-icon {
          width: 34px;
          height: 34px;
          color: white;
          transition: transform 0.2s ease;
        }

        .whatsapp-button:hover .whatsapp-icon {
          transform: scale(1.05);
        }

        .whatsapp-pulse {
          position: absolute;
          width: 60px;
          height: 60px;
          background-color: #25D366;
          border-radius: 50%;
          opacity: 0.6;
          animation: pulse 1.5s infinite;
          z-index: -1;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          70% {
            transform: scale(1.3);
            opacity: 0;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        .whatsapp-button:hover .whatsapp-pulse {
          animation: none;
          opacity: 0;
        }

        .whatsapp-tooltip {
          position: fixed;
          bottom: 90px;
          right: 20px;
          background-color: #1a1a1a;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          z-index: 999;
          animation: fadeInUp 0.3s ease;
          white-space: nowrap;
        }

        .whatsapp-tooltip::after {
          content: '';
          position: absolute;
          bottom: -8px;
          right: 20px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #1a1a1a;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .whatsapp-visible {
          opacity: 1;
          visibility: visible;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .whatsapp-hidden {
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        @media (max-width: 768px) {
          .whatsapp-button {
            width: 50px;
            height: 50px;
            bottom: 15px;
            right: 15px;
          }
          
          .whatsapp-icon {
            width: 28px;
            height: 28px;
          }
          
          .whatsapp-pulse {
            width: 50px;
            height: 50px;
          }
          
          .whatsapp-tooltip {
            bottom: 75px;
            right: 15px;
            font-size: 11px;
          }
        }
      `}</style>
    </>
  );
};

export default WhatsAppButton;