// src/pages/Login.jsx

import { Card, Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail, MdLockOutline } from "react-icons/md";
import { supabase } from "../config/supabase";

// Paleta chocolate Pin Ups
const THEME = {
  primary: "#3E2723",
  primaryDark: "#2D1B15",
  background: "#FFFFFF",
  backgroundAlt: "#F5F0EB",
  textPrimary: "#1A1A1A",
  textSecondary: "#4E342E",
  textMuted: "#8D6E63",
  border: "#D7CCC8",
  textLight: "#F5F0EB",
};

const Login = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  // Si ya hay sesión activa, redirigimos
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await redirectBasedOnRole(session.user);
      }
    };
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------- Redirigir según rol --------------------
  const redirectBasedOnRole = async (user) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, nombre")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.warn("Error al leer profiles:", error.message);
      }

      const nombre =
        profile?.nombre ||
        user.user_metadata?.nombre ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Usuario";

      const rol = profile?.role || user.user_metadata?.role || "client";

      const currentUser = {
        id: user.id,
        email: user.email,
        nombre,
        role: rol,
      };
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      if (rol === "admin" || rol === "empleado") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error al obtener el rol:", err);
      // Fallback: guardar lo básico y redirigir a home
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: user.id,
          email: user.email,
          nombre: user.user_metadata?.nombre || "Usuario",
          role: "client",
        })
      );
      navigate("/");
    }
  };

  // -------------------- Login con email/password --------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email.trim().toLowerCase(),
        password: input.password,
      });

      if (error) throw error;

      if (data?.user) {
        await redirectBasedOnRole(data.user);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      let mensaje = error.message || "Error desconocido";

      if (mensaje.includes("Invalid login credentials")) {
        mensaje = "Email o contraseña incorrectos.";
      } else if (mensaje.includes("Email not confirmed")) {
        mensaje = "Tenés que confirmar tu email antes de iniciar sesión.";
      }

      alert("❌ " + mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container
      fluid
      className="py-4 py-md-5"
      style={{ backgroundColor: THEME.backgroundAlt, minHeight: "100vh" }}
    >
      <Row
        className="justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 3rem)" }}
      >
        <Col xs={12} sm={10} md={8} lg={5} xl={4}>
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header decorativo */}
            <div
              className="text-center pt-4 pb-2"
              style={{ backgroundColor: THEME.primary }}
            >
              <FaSignInAlt size={35} className="mb-2" style={{ color: THEME.textLight }} />
              <h4 className="mb-0" style={{ color: THEME.textLight }}>
                ¡Bienvenida!
              </h4>
              <p className="small mb-0" style={{ color: THEME.textLight, opacity: 0.7 }}>
                Iniciá sesión en tu cuenta
              </p>
            </div>

            <Card.Body className="p-4 p-md-5">
              <Form noValidate validated={validated} onSubmit={handleLogin}>
                {/* Email */}
                <Form.Group className="mb-4">
                  <Form.Label
                    className="fw-semibold small"
                    style={{ color: THEME.textMuted }}
                  >
                    <MdEmail className="me-1" size={14} /> Correo electrónico
                  </Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text
                      className="border-end-0 rounded-3"
                      style={{
                        backgroundColor: THEME.backgroundAlt,
                        borderColor: THEME.border,
                        color: THEME.textMuted,
                      }}
                    >
                      <MdEmail />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type="email"
                      placeholder="tucorreo@ejemplo.com"
                      name="email"
                      value={input.email}
                      onChange={handleInputChange}
                      className="border-start-0 rounded-3 py-2"
                      style={{ borderColor: THEME.border }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, ingresá tu email.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Contraseña */}
                <Form.Group className="mb-4">
                  <Form.Label
                    className="fw-semibold small"
                    style={{ color: THEME.textMuted }}
                  >
                    <MdLockOutline className="me-1" size={14} /> Contraseña
                  </Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text
                      className="border-end-0 rounded-3"
                      style={{
                        backgroundColor: THEME.backgroundAlt,
                        borderColor: THEME.border,
                        color: THEME.textMuted,
                      }}
                    >
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      name="password"
                      value={input.password}
                      onChange={handleInputChange}
                      className="border-start-0 rounded-3 py-2"
                      style={{ borderColor: THEME.border }}
                    />
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      className="border rounded-3 ms-1 d-flex align-items-center justify-content-center"
                      style={{
                        cursor: "pointer",
                        width: "45px",
                        backgroundColor: THEME.backgroundAlt,
                        borderColor: THEME.border,
                        color: THEME.textMuted,
                      }}
                      type="button"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      Por favor, ingresá tu contraseña.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Botón de login */}
                <div className="d-grid gap-2 mb-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="py-2 rounded-pill fw-semibold border-0"
                    style={{
                      backgroundColor: THEME.primary,
                      color: "#FFFFFF",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = THEME.primaryDark)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = THEME.primary)
                    }
                  >
                    {loading ? "Verificando..." : "Ingresar 💖"}
                  </Button>
                </div>

                {/* Link a registro */}
                <div className="text-center">
                  <p className="small mb-0" style={{ color: THEME.textMuted }}>
                    ¿No tenés cuenta?{" "}
                    <Link
                      to="/register"
                      className="text-decoration-none fw-semibold"
                      style={{ color: THEME.primary }}
                    >
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