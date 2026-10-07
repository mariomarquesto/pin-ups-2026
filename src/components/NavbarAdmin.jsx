import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBox, FaShoppingBag, FaChartLine, FaSignOutAlt } from "react-icons/fa";
import { supabase } from "../config/supabase";
import { getSessionUser } from "../utils/session";

const NAV_BG = "#f85606";
const NAV_ACTIVE = "#e04a00";

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = getSessionUser() || {};

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      /* si no hay sesión de Supabase, igual limpiamos lo local */
    }
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  const linkClass = (path) =>
    `rounded-pill px-3 fw-semibold ${
      location.pathname === path ? "text-white" : "text-white-50"
    }`;

  const linkStyle = (path) => ({
    backgroundColor: location.pathname === path ? NAV_ACTIVE : "transparent",
    transition: "background-color 0.2s ease",
  });

  return (
    <Navbar expand="lg" className="shadow-sm mb-4" style={{ backgroundColor: NAV_BG }} variant="dark">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/admin" className="fw-bold d-flex align-items-center gap-2 text-white">
          👑 <span>Pin Ups | Panel Admin</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="admin-navbar-nav" />

        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto gap-2">
            <Nav.Link as={Link} to="/admin" className={linkClass("/admin")} style={linkStyle("/admin")}>
              <FaChartLine className="me-1" /> Dashboard
            </Nav.Link>

            <Nav.Link as={Link} to="/admin/products" className={linkClass("/admin/products")} style={linkStyle("/admin/products")}>
              <FaBox className="me-1" /> Productos
            </Nav.Link>

            <Nav.Link as={Link} to="/admin/orders" className={linkClass("/admin/orders")} style={linkStyle("/admin/orders")}>
              <FaShoppingBag className="me-1" /> Pedidos
            </Nav.Link>
          </Nav>

          <Nav className="align-items-center gap-3">
            <span className="text-white small d-none d-md-inline">
              Hola, <strong>{currentUser.nombre || currentUser.email || "Admin"}</strong>
              <span className="badge bg-white text-uppercase ms-2" style={{ color: NAV_BG }}>
                {currentUser.role || "admin"}
              </span>
            </span>

            <Button
              variant="outline-light"
              size="sm"
              onClick={handleLogout}
              className="d-flex align-items-center gap-1 rounded-pill px-3"
            >
              <FaSignOutAlt /> Salir
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarAdmin;
