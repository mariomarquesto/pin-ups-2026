import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="pt-5 pb-4 mt-5"
      style={{
        backgroundColor: "#f85606",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="container">
        <div className="row g-4">
          {/* Columna 1: Atención al Cliente */}
          <div className="col-md-3 col-6">
            <h5
              className="fw-semibold mb-3"
              style={{
                color: "white",
                fontSize: "0.9rem",
                letterSpacing: "2px",
              }}
            >
              ATENCIÓN AL CLIENTE
            </h5>

            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/helpcenter"
                  className="text-white text-decoration-none small"
                  style={{ opacity: 0.8, transition: "opacity 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.opacity = "1")}
                  onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
                >
                  Centro de Ayuda
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/helpcenter"
                  className="text-white text-decoration-none small"
                  style={{ opacity: 0.8, transition: "opacity 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.opacity = "1")}
                  onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
                >
                  Guía de Talles Reales
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/helpcenter"
                  className="text-white text-decoration-none small"
                  style={{ opacity: 0.8, transition: "opacity 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.opacity = "1")}
                  onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
                >
                  Cambios y Devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 2: Pin Ups */}
          <div className="col-md-3 col-6">
            <h5
              className="fw-semibold mb-3"
              style={{
                color: "white",
                fontSize: "0.9rem",
                letterSpacing: "2px",
              }}
            >
              PIN UPS
            </h5>

            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/nosotras"
                  className="text-white text-decoration-none small"
                  style={{ opacity: 0.8, transition: "opacity 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.opacity = "1")}
                  onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Sobre Nosotras
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/location"
                  className="text-white text-decoration-none small"
                  style={{ opacity: 0.8, transition: "opacity 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.opacity = "1")}
                  onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  📍 Nuestra Sucursal
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/termsandconditions"
                  className="text-white text-decoration-none small"
                  style={{ opacity: 0.8, transition: "opacity 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.opacity = "1")}
                  onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Términos y Condiciones
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/privacypolicy"
                  className="text-white text-decoration-none small"
                  style={{ opacity: 0.8, transition: "opacity 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.opacity = "1")}
                  onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Métodos de Pago y Envíos */}
          <div className="col-md-3 col-6">
            <h5
              className="fw-semibold mb-3"
              style={{
                color: "white",
                fontSize: "0.9rem",
                letterSpacing: "2px",
              }}
            >
              MEDIOS DE PAGO
            </h5>

            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="badge bg-white text-dark px-3 py-2 fw-normal rounded-pill">
                Efectivo
              </span>
              <span className="badge bg-white text-dark px-3 py-2 fw-normal rounded-pill">
                Mercado Pago
              </span>
              <span className="badge bg-white text-dark px-3 py-2 fw-normal rounded-pill">
                Transferencia
              </span>
              <span className="badge bg-white text-dark px-3 py-2 fw-normal rounded-pill">
                Tarjetas
              </span>
            </div>

            <h5
              className="fw-semibold mb-3"
              style={{
                color: "white",
                fontSize: "0.9rem",
                letterSpacing: "2px",
              }}
            >
              ENVÍOS
            </h5>

            <p className="small text-white" style={{ opacity: 0.8 }}>
              Correo Argentino / Andreani. Envíos a todo el país.
            </p>
          </div>

          {/* Columna 4: Logo y Redes */}
          <div className="col-md-3 col-6 text-center text-md-start">
            <img
              src="/logo-ultimo.png"
              alt="Pin Ups Logo"
              width={55}
              height={55}
              className="rounded-circle mb-2"
              style={{
                objectFit: "cover",
                border: "2px solid white",
              }}
            />

            <p
              className="small fw-semibold mt-2"
              style={{ color: "white" }}
            >
              Calidad y estilo en talles reales
            </p>

            <h5
              className="fw-semibold mb-3 mt-3"
              style={{
                color: "white",
                fontSize: "0.9rem",
                letterSpacing: "2px",
              }}
            >
              SEGUINOS
            </h5>

            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <a
                href="https://www.facebook.com/pinupstuc"
                className="text-white fs-5"
                target="_blank"
                rel="noreferrer"
                style={{ opacity: 0.8, transition: "opacity 0.3s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
              >
                <i className="fa-brands fa-facebook"></i>
              </a>

              <a
                href="https://www.tiktok.com/@pinupstuc"
                className="text-white fs-5"
                target="_blank"
                rel="noreferrer"
                style={{ opacity: 0.8, transition: "opacity 0.3s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
              >
                <i className="fa-brands fa-tiktok"></i>
              </a>

              <a
                href="https://www.instagram.com/pinupstuc"
                className="text-white fs-5"
                target="_blank"
                rel="noreferrer"
                style={{ opacity: 0.8, transition: "opacity 0.3s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <hr
          className="mt-4"
          style={{
            borderColor: "rgba(255,255,255,0.2)",
          }}
        />

        <div className="text-center pt-3 pb-2">
          <p className="small text-white mb-0" style={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} Pin Ups · Moda para talles reales ·
            Hecho con 💖 para vos
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;