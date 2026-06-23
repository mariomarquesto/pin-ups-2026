import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { GiShoppingCart } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const userName = JSON.parse(localStorage.getItem("users"));
  const isLoggedIn = JSON.parse(localStorage.getItem("loggedIn"));

  const handleLogOut = () => {
    localStorage.removeItem("loggedIn");
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
        backgroundColor: "#f85606",
    boxShadow: "0 2px 15px rgba(0,0,0,0.1)",
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
            }}
          />
        </Link>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-auto my-2 my-lg-0"
            navbarScroll
          >
            <Link
              to="/addtocart"
              className="text-white text-decoration-none me-3"
            >
              <GiShoppingCart
                style={{
                  fontSize: "36px",
                }}
              />
            </Link>
          </Nav>

          <Form
            className="d-flex"
            onSubmit={handleSearch}
          >
            <Form.Control
              type="search"
              placeholder="Buscar productos..."
              className="me-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button
              type="submit"
              variant="light"
            >
              Buscar
            </Button>
          </Form>

          {isLoggedIn ? (
            <NavDropdown
              title={`${userName?.fName || ""} ${userName?.lName || ""}`}
              id="basic-nav-dropdown"
              className="ms-3"
            >
              <NavDropdown.Item>
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
                className="ms-3 text-white text-decoration-none"
              >
                Login
              </Link>

              <span className="mx-2 text-white">|</span>

              <Link
                to="/register"
                className="text-white text-decoration-none"
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