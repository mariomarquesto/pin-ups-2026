// src/components/Header.jsx

import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { GiShoppingCart } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

// Paleta chocolate Pin Ups
const THEME = {
  primary: "#3E2723",       // chocolate oscuro (marca principal)
  primaryDark: "#2D1B15",   // chocolate más oscuro (hover)
  background: "#FFFFFF",    // blanco puro
  textLight: "#F5F0EB",     // blanco chocolate (textos sobre fondo oscuro)
  border: "#D7CCC8",        // chocolate claro (bordes)
};

function Header() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // -------------------- Cargar usuario --------------------
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const user = session.user;

        // Buscar en profiles (columna "nombre")
        let profile = null;
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          if (error) {
            console.warn("Error al leer profiles:", error.message);
          }
          profile = data;
        } catch (err) {
          console.warn("Excepción al leer profiles:", err);
        }

        // Nombre: priorizamos "nombre" de profiles, luego metadata, luego email
        const nombre =
          profile?.nombre ||
          user.user_metadata?.nombre ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Usuario";

        setUserName(nombre);
        setIsLoggedIn(true);
      } else {
        // Fallback: localStorage viejo (por si hay usuarios de antes)
        const storedUser = JSON.parse(localStorage.getItem("users") || "null");
        const storedLogged = JSON.parse(
          localStorage.getItem("loggedIn") || "false"
        );

        if (storedLogged && storedUser) {
          const nombre =
            storedUser.nombre ||
            storedUser.fName ||
            storedUser.email?.split("@")[0] ||
            "Usuario";
          setUserName(nombre);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUserName("");
        }
      }
    };

    loadUser();

    // Escuchar cambios de auth (login/logout en otra pestaña)
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      /* ignora */
    }
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("users");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/searchedproduct?q=${search}`);
  };

  return (
    <Navbar
      expand="lg"
      style={{
        backgroundColor: THEME.primary,
        boxShadow: "0 2px 15px rgba(62, 39, 35, 0.25)",
      }}
    >
      <Container>
        <Link to="/">
          <img
            src="/logo-ultimo.png"
            alt="logo"
            width={50}
            height={50}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${THEME.textLight}`,
            }}
          />
        </Link>

        <Navbar.Toggle
          aria-controls="navbarScroll"
          style={{ borderColor: THEME.border }}
        />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto my-2 my-lg-0" navbarScroll>
            <Link
              to="/addtocart"
              className="text-decoration-none me-3"
              style={{ color: THEME.textLight }}
            >
              <GiShoppingCart style={{ fontSize: "36px" }} />
            </Link>
          </Nav>

          <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Buscar productos..."
              className="me-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                borderColor: THEME.border,
              }}
            />

            <Button
              type="submit"
              style={{
                backgroundColor: THEME.textLight,
                color: THEME.primary,
                border: "none",
                fontWeight: 600,
              }}
            >
              Buscar
            </Button>
          </Form>

          {isLoggedIn ? (
            <NavDropdown
              title={`Hola, ${userName}`}
              id="basic-nav-dropdown"
              className="ms-3"
              style={{ color: THEME.textLight }}
            >
              <NavDropdown.Item onClick={() => navigate("/perfil")}>
                Mi Perfil
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item onClick={handleLogOut}>
                Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Link
                to="/login"
                className="ms-3 text-decoration-none"
                style={{ color: THEME.textLight }}
              >
                Login
              </Link>

              <span className="mx-2" style={{ color: THEME.textLight }}>
                |
              </span>

              <Link
                to="/register"
                className="text-decoration-none"
                style={{ color: THEME.textLight }}
              >
                Register
              </Link>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;