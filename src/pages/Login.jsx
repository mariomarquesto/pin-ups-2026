import { Card, Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail, MdLockOutline } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const loggedUser = JSON.parse(localStorage.getItem("users"));
    
    if (!loggedUser) {
      alert("📝 No tenés una cuenta registrada. Registrate primero.");
      navigate("/register");
      return;
    }

    if (input.email === loggedUser.email && input.password === loggedUser.password) {
      localStorage.setItem("loggedIn", JSON.stringify(true));
      localStorage.setItem("currentUser", JSON.stringify(loggedUser));
      alert("🎉 ¡Bienvenida a Pin Ups! Inicio de sesión exitoso.");
      navigate("/");
    } else {
      alert("❌ Email o contraseña incorrectos. Por favor, verificá tus datos.");
    }
  };

  const handleInputChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container fluid className="py-4 py-md-5" style={{ backgroundColor: '#fef6f0', minHeight: '100vh' }}>
      <Row className="justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 3rem)' }}>
        <Col xs={12} sm={10} md={8} lg={5} xl={4}>
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header decorativo */}
            <div className="text-center pt-4 pb-2" style={{ backgroundColor: '#f85606' }}>
              <FaSignInAlt size={35} className="text-white mb-2" />
              <h4 className="text-white mb-0">¡Bienvenida!</h4>
              <p className="text-white-50 small mb-0">Iniciá sesión en tu cuenta</p>
            </div>

            <Card.Body className="p-4 p-md-5">
              <Form noValidate validated={validated} onSubmit={handleLogin}>
                {/* Email */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold small text-muted">
                    <MdEmail className="me-1" size={14} /> Correo electrónico
                  </Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light border-end-0 rounded-3">
                      <FaEnvelope className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type="email"
                      placeholder="tucorreo@ejemplo.com"
                      name="email"
                      value={input.email}
                      onChange={handleInputChange}
                      className="border-start-0 rounded-3 py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, ingresá tu email.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Contraseña */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold small text-muted">
                    <MdLockOutline className="me-1" size={14} /> Contraseña
                  </Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light border-end-0 rounded-3">
                      <FaLock className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      name="password"
                      value={input.password}
                      onChange={handleInputChange}
                      className="border-start-0 rounded-3 py-2"
                    />
                    <Button
                      variant="light"
                      onClick={() => setShowPassword(!showPassword)}
                      className="border rounded-3 ms-1 d-flex align-items-center justify-content-center"
                      style={{ cursor: 'pointer', width: '45px' }}
                      type="button"
                    >
                      {showPassword ? <FaEyeSlash className="text-muted" /> : <FaEye className="text-muted" />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      Por favor, ingresá tu contraseña.
                    </Form.Control.Feedback>
                  </InputGroup>
                  <div className="text-end mt-1">
                    <a href="#" className="small text-decoration-none" style={{ color: '#f85606' }}>
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                </Form.Group>

                {/* Botón de login */}
                <div className="d-grid gap-2 mb-3">
                  <Button 
                    type="submit" 
                    className="py-2 rounded-pill fw-semibold border-0"
                    style={{ backgroundColor: '#f85606', color: 'white' }}
                  >
                    Ingresar 💖
                  </Button>
                </div>

                {/* Link a registro */}
                <div className="text-center">
                  <p className="small text-muted mb-0">
                    ¿No tenés cuenta?{' '}
                    <Link to="/register" className="text-decoration-none fw-semibold" style={{ color: '#f85606' }}>
                      Registrate acá
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
          
          {/* Mensaje motivacional */}
          <p className="text-center text-muted small mt-4">
            👗 Moda para talles reales • Curvy friendly • Envíos a todo el país
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;