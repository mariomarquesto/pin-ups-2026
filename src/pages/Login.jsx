import { Card, Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { MdEmail, MdLockOutline } from "react-icons/md";
import { supabase } from "../config/supabase";

const Login = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  // Función para consultar el rol en la tabla profiles y redirigir
  const redirectBasedOnRole = async (user) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, nombre')
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        navigate("/");
        return;
      }

      // Guardamos la sesión actual en el localStorage para las rutas protegidas
      const currentUser = {
        id: user.id,
        email: user.email,
        nombre: profile.nombre || "Usuario",
        role: profile.role // 'admin', 'empleado', 'client'
      };
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // Redirección según el rol obtenido de Supabase
      if (profile.role === 'admin' || profile.role === 'empleado') {
        alert(`🔐 ¡Bienvenido al panel, ${currentUser.nombre}!`);
        navigate("/admin");
      } else {
        alert(`🎉 ¡Bienvenida a Pin Ups, ${currentUser.nombre}!`);
        navigate("/");
      }
    } catch (err) {
      console.error("Error al obtener el rol:", err);
      navigate("/");
    }
  };

  // Inicio de sesión con Email y Contraseña (Supabase Auth)
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email.trim(),
      password: input.password,
    });

    setLoading(false);

    if (error) {
      alert("❌ Error al iniciar sesión: " + error.message);
      return;
    }

    if (data?.user) {
      await redirectBasedOnRole(data.user);
    }
  };

  // Inicio de sesión con Google OAuth (Supabase Auth)
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      alert("❌ No se pudo iniciar sesión con Google: " + error.message);
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
              {/* Botón de Google OAuth */}
              <div className="d-grid mb-3">
                <Button 
                  variant="outline-dark" 
                  onClick={handleGoogleLogin}
                  className="py-2 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  <FaGoogle className="text-danger" /> Continuar con Google
                </Button>
              </div>

              <div className="d-flex align-items-center my-3">
                <hr className="flex-grow-1 text-muted" />
                <span className="px-2 small text-muted">o con tu email</span>
                <hr className="flex-grow-1 text-muted" />
              </div>

              <Form noValidate validated={validated} onSubmit={handleLogin}>
                {/* Email */}
                <Form.Group className="mb-4">
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
                </Form.Group>

                {/* Botón de login tradicional */}
                <div className="d-grid gap-2 mb-3">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="py-2 rounded-pill fw-semibold border-0"
                    style={{ backgroundColor: '#f85606', color: 'white' }}
                  >
                    {loading ? "Verificando..." : "Ingresar 💖"}
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
        </Col>
      </Row>
    </Container>
  );
};

export default Login;