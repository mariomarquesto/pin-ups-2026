import Slider from '../../src/components/Slider';
import ProductContainer from '../../src/components/JustForYou';
import { Container } from 'react-bootstrap';
import Categories from '../components/Categories';
import OfertaPopup from '../components/OfertaPopup';



const Home = () => {
  return (
    <>
      {/* Slider - ancho completo, fuera del container */}
      <div className="w-100">
        <Slider />
      </div>
      <Categories />
      {/* Contenido con container para mantener márgenes */}
      <Container>
        <div className="banner mt-3">
          <img src='./pin-ups-baner.png' alt="Banner Image" style={{ width: '100%' }} />
        </div>
        <OfertaPopup />
        <ProductContainer />
        
     
      
      </Container>
    </>
  );
};

export default Home;