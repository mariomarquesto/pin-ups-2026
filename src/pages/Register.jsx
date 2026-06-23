import { Card, Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaMapMarkerAlt, FaUserPlus } from "react-icons/fa";
import { MdEmail, MdLockOutline } from "react-icons/md";

const Register = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [input, setInput] = useState({
    fName: "",
    lName: "",
    address: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Verificar si el email ya existe
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    if (existingUsers.email === input.email) {
      alert("⚠️ Este email ya está registrado. Por favor, usá otro.");
      return;
    }

    localStorage.setItem("users", JSON.stringify(input));
    alert("🎉 ¡Registro exitoso! Ahora podés iniciar sesión.");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container fluid className="py-4 py-md-5" style={{ backgroundColor: '#fef6f0', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header decorativo */}
            <div className="text-center pt-4 pb-2" style={{ backgroundColor: '#f85606' }}>
              <FaUserPlus size={40} className="text-white mb-2" />
              <h4 className="text-white mb-0">Creá tu cuenta</h4>
              <p className="text-white-50 small mb-0">Unite a la comunidad Pin Ups</p>
            </div>

            <Card.Body className="p-4 p-md-5">
              <Form noValidate validated={validated} onSubmit={handleRegister}>
                {/* Nombre y Apellido */}
                <Row className="mb-3 g-3">
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small text-muted">
                        <FaUser className="me-1" size={12} /> Nombre
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Tu nombre"
                        name="fName"
                        value={input.fName}
                        onChange={handleInputChange}
                        className="rounded-3 py-2"
                      />
                      <Form.Control.Feedback type="invalid">
                        Por favor, ingresá tu nombre.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small text-muted">
                        <FaUser className="me-1" size={12} /> Apellido
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Tu apellido"
                        name="lName"
                        value={input.lName}
                        onChange={handleInputChange}
                        className="rounded-3 py-2"
                      />
                      <Form.Control.Feedback type="invalid">
                        Por favor, ingresá tu apellido.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Dirección */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-muted">
                    <FaMapMarkerAlt className="me-1" size={12} /> Dirección
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Tu dirección"
                    name="address"
                    value={input.address}
                    onChange={handleInputChange}
                    className="rounded-3 py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    Por favor, ingresá tu dirección.
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-muted">
                    <MdEmail className="me-1" size={14} /> Correo electrónico
                  </Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light border-end-0 rounded-3">
                      <MdEmail className="text-muted" />
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
                      Ingresá un email válido.
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
                      placeholder="Mínimo 6 caracteres"
                      name="password"
                      value={input.password}
                      onChange={handleInputChange}
                      className="border-start-0 rounded-3 py-2"
                    />
                    <Button
                      variant="light"
                      onClick={() => setShowPassword(!showPassword)}
                      className="border rounded-3 ms-1"
                      style={{ cursor: 'pointer' }}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      La contraseña es requerida.
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted small">
                    Mínimo 6 caracteres
                  </Form.Text>
                </Form.Group>

                {/* Términos y condiciones */}
                <Form.Group className="mb-4">
                  <Form.Check
                    required
                    type="checkbox"
                    label={
                      <span className="small">
                        Acepto los <a href="#" className="text-decoration-none">términos y condiciones</a> y la{' '}
                        <a href="#" className="text-decoration-none">política de privacidad</a>
                      </span>
                    }
                    feedback="Debés aceptar los términos para continuar."
                    feedbackType="invalid"
                  />
                </Form.Group>

                {/* Botón de registro */}
                <div className="d-grid gap-2 mb-3">
                  <Button 
                    type="submit" 
                    className="py-2 rounded-pill fw-semibold border-0"
                    style={{ backgroundColor: '#f85606', color: 'white' }}
                  >
                    Registrarme 🛍️
                  </Button>
                </div>

                {/* Link a login */}
                <div className="text-center">
                  <p className="small text-muted mb-0">
                    ¿Ya tenés cuenta?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#f85606' }}>
                      Iniciar sesión
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;