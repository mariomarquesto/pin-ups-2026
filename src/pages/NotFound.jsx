import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container
      className="py-5 text-center d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "70vh", backgroundColor: "#fef6f0" }}
    >
      <div style={{ fontSize: "6rem", lineHeight: 1 }}>🛍️</div>
      <h1 className="fw-bold mt-3" style={{ color: "#f85606" }}>
        404
      </h1>
      <h4 className="fw-semibold mb-3">Página no encontrada</h4>
      <p className="text-muted mb-4">
        La página que buscás no existe o fue movida. Volvé a la tienda para
        seguir comprando.
      </p>
      <Link to="/" className="text-decoration-none">
        <Button
          className="rounded-pill px-4 py-2 fw-semibold border-0"
          style={{ backgroundColor: "#f85606", color: "white" }}
        >
          ← Volver al inicio
        </Button>
      </Link>
    </Container>
  );
};

export default NotFound;
