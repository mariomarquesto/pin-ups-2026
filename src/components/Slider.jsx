import Carousel from 'react-bootstrap/Carousel';

function Slider() {
  return (
    <div className="container-fluid p-0 m-0" style={{width: '100%'}}>
        <Carousel data-bs-theme="dark">
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src='./pin-ups1.png'
                    alt="First slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
          className="d-block w-100"
          src='./pin-ups2.png'
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src='./pin-ups3.png'
          alt="Third slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src='./pin-ups4.png'
          alt="Fourth slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src='./pin-ups5.png'
          alt="Fifth slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src='./pin-ups6.png'
          alt="Sixth slide"
        />
      </Carousel.Item>
    </Carousel>
    </div>
    
  );
}

export default Slider;