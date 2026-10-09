// src/components/NavbarAdmin.jsx

import { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaBox,
  FaShoppingBag,
  FaChartLine,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import { supabase } from "../config/supabase";

// Paleta chocolate Pin Ups
const THEME = {
  primary: "#3E2723",       // chocolate oscuro (marca principal)
  primaryDark: "#2D1B15",   // chocolate más oscuro (activo)
  background: "#FFFFFF",    // blanco puro
  textLight: "#F5F0EB",     // blanco chocolate (textos sobre fondo oscuro)
  border: "#D7CCC8",        // chocolate claro (bordes)
};

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState({
    nombre: "Admin",
    email: "",
    role: "admin",
  });

  // -------------------- Cargar usuario --------------------
  useEffect(() => {
    const loadUser = async () => {
      // 1. Sesión de Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const user = session.user;

        // 2. Buscar en profiles
        let profile = null;
        try {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();
          profile = data;
        } catch (err) {
          console.warn("No se pudo leer profiles:", err);
        }

        // 3. Armar nombre (columna "nombre" en profiles)
        const nombre =
          profile?.nombre ||
          user.user_metadata?.nombre ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Admin";

        const role =
          profile?.role || user.user_metadata?.role || "admin";

        setCurrentUser({
          id: user.id,
          email: user.email,
          nombre,
          role,
        });

        // Sincronizamos localStorage para otras partes de la app
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: user.id,
            email: user.email,
            nombre,
            role,
          })
        );
      } else {
        // Fallback: localStorage
        const stored = JSON.parse(localStorage.getItem("currentUser") || "{}");
        if (stored.id) {
          setCurrentUser({
            nombre: stored.nombre || stored.email?.split("@")[0] || "Admin",
            email: stored.email || "",
            role: stored.role || "admin",
          });
        }
      }
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      /* ignora si no hay sesión */
    }
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  const linkClass = (path) =>
    `rounded-pill px-3 fw-semibold ${
      location.pathname === path ? "" : "opacity-75"
    }`;

  const linkStyle = (path) => ({
    backgroundColor:
      location.pathname === path ? THEME.primaryDark : "transparent",
    color: THEME.textLight,
    transition: "background-color 0.2s ease, opacity 0.2s ease",
  });

  return (
    <Navbar
      expand="lg"
      className="shadow-sm mb-4"
      style={{
        backgroundColor: THEME.primary,
        boxShadow: "0 2px 10px rgba(62, 39, 35, 0.25)",
      }}
      variant="dark"
    >
      <Container fluid className="px-4">
        <Navbar.Brand
          as={Link}
          to="/admin"
          className="fw-bold d-flex align-items-center gap-2"
          style={{ color: THEME.textLight }}
        >
          👑 <span>Pin Ups | Panel Admin</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="admin-navbar-nav"
          style={{ borderColor: THEME.border }}
        />

        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto gap-2">
            <Nav.Link
              as={Link}
              to="/admin"
              className={linkClass("/admin")}
              style={linkStyle("/admin")}
            >
              <FaChartLine className="me-1" /> Dashboard
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/admin/products"
              className={linkClass("/admin/products")}
              style={linkStyle("/admin/products")}
            >
              <FaBox className="me-1" /> Productos
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/admin/orders"
              className={linkClass("/admin/orders")}
              style={linkStyle("/admin/orders")}
            >
              <FaShoppingBag className="me-1" /> Pedidos
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/admin/crm"
              className={linkClass("/admin/crm")}
              style={linkStyle("/admin/crm")}
            >
              <FaUsers className="me-1" /> CRM
            </Nav.Link>
          </Nav>

          <Nav className="align-items-center gap-3">
            <span className="small d-none d-md-inline" style={{ color: THEME.textLight }}>
              Hola,{" "}
              <strong>
                {currentUser.nombre || currentUser.email || "Admin"}
              </strong>
              <span
                className="badge text-uppercase ms-2"
                style={{
                  backgroundColor: THEME.textLight,
                  color: THEME.primary,
                }}
              >
                {currentUser.role || "admin"}
              </span>
            </span>

            <Button
              size="sm"
              onClick={handleLogout}
              className="d-flex align-items-center gap-1 rounded-pill px-3"
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${THEME.textLight}`,
                color: THEME.textLight,
              }}
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