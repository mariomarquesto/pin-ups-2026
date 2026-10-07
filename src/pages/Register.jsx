import { Card, Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaUserPlus } from "react-icons/fa";
import { MdEmail, MdLockOutline } from "react-icons/md";
import { supabase } from "../config/supabase";

const Register = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);

    // 1. Creamos el usuario en Supabase Auth y pasamos el nombre en los metadatos
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        data: {
          nombre: input.nombre.trim(),
          role: 'client' // Los auto-registros siempre entran como clientes por seguridad
        }
      }
    });

    setLoading(false);

    if (error) {
      alert("❌ Error al registrarse: " + error.message);
      return;
    }

    if (data?.user) {
      alert("🎉 ¡Registro exitoso! Ya podés iniciar sesión.");
      navigate("/login");
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
            <div className="text-center pt-4 pb-2" style={{ backgroundColor: '#f85606' }}>
              <FaUserPlus size={35} className="text-white mb-2" />
              <h4 className="text-white mb-0">Crear Cuenta</h4>
              <p className="text-white-50 small mb-0">Unite a Pin Ups</p>
            </div>

            <Card.Body className="p-4 p-md-5">
              <Form noValidate validated={validated} onSubmit={handleRegister}>
                {/* Nombre */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-muted">Nombre completo</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light border-end-0 rounded-3">
                      <FaUser className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Tu nombre"
                      name="nombre"
                      value={input.nombre}
                      onChange={handleInputChange}
                      className="border-start-0 rounded-3 py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, ingresá tu nombre.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-muted">Correo electrónico</Form.Label>
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
                      Por favor, ingresá un email válido.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Contraseña */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold small text-muted">Contraseña</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light border-end-0 rounded-3">
                      <MdLockOutline className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      name="password"
                      minLength={6}
                      value={input.password}
                      onChange={handleInputChange}
                      className="border-start-0 rounded-3 py-2"
                    />
                    <Form.Control.Feedback type="invalid">
                      La contraseña debe tener al menos 6 caracteres.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <div className="d-grid gap-2 mb-3">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="py-2 rounded-pill fw-semibold border-0"
                    style={{ backgroundColor: '#f85606', color: 'white' }}
                  >
                    {loading ? "Registrando..." : "Registrarse 💖"}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="small text-muted mb-0">
                    ¿Ya tenés cuenta?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#f85606' }}>
                      Iniciá sesión
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