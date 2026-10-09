// src/pages/Register.jsx

import { Card, Container, Row, Col, Form, Button, InputGroup, Alert } from "react-bootstrap";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaUserPlus } from "react-icons/fa";
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

const Register = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [input, setInput] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);

    try {
      const emailLimpio = input.email.trim().toLowerCase();
      const nombreLimpio = input.nombre.trim();

      // 1. Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: emailLimpio,
        password: input.password,
        options: {
          data: {
            nombre: nombreLimpio,
            role: "client",
          },
        },
      });

      if (error) throw error;
      if (!data?.user) throw new Error("No se pudo crear el usuario.");

      // 2. Verificar si el trigger ya creó el perfil
      let perfilCreado = false;

      try {
        await new Promise((r) => setTimeout(r, 800));

        const { data: perfilExistente } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle();

        if (perfilExistente) {
          perfilCreado = true;
        }
      } catch (err) {
        console.warn("No se pudo verificar el perfil:", err);
      }

      // 3. Si el trigger no lo creó, lo insertamos manualmente
      if (!perfilCreado) {
        try {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id,
                email: emailLimpio,
                nombre: nombreLimpio,
                role: "client",
              },
            ]);

          if (profileError) {
            console.warn("⚠️ Error al insertar perfil manualmente:", profileError.message);
          }
        } catch (profileErr) {
          console.warn("⚠️ Excepción al insertar perfil:", profileErr);
        }
      }

      // 4. Mensaje de éxito
      if (data.session === null) {
        setSuccessMsg(
          "✅ ¡Registro exitoso! Te enviamos un email para confirmar tu cuenta antes de iniciar sesión."
        );
      } else {
        setSuccessMsg("🎉 ¡Registro exitoso! Redirigiendo al login...");
      }

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("❌ Error al registrarse:", err);
      let mensaje = err.message || "Error desconocido";

      if (mensaje.includes("already registered") || mensaje.includes("already been registered")) {
        mensaje = "Ese email ya está registrado. Probá iniciar sesión.";
      } else if (mensaje.includes("invalid email") || mensaje.includes("is invalid")) {
        mensaje = "El email no es válido. Verificá que sea un correo real.";
      } else if (mensaje.includes("Password should be")) {
        mensaje = "La contraseña debe tener al menos 6 caracteres.";
      } else if (mensaje.includes("Email address") && mensaje.includes("invalid")) {
        mensaje = "Ese email no está permitido. Configurá un SMTP propio en Supabase.";
      }

      setErrorMsg("❌ " + mensaje);
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
              <FaUserPlus size={35} className="mb-2" style={{ color: THEME.textLight }} />
              <h4 className="mb-0" style={{ color: THEME.textLight }}>
                Crear Cuenta
              </h4>
              <p className="small mb-0" style={{ color: THEME.textLight, opacity: 0.7 }}>
                Unite a Pin Ups
              </p>
            </div>

            <Card.Body className="p-4 p-md-5">
              {errorMsg && (
                <Alert variant="danger" dismissible onClose={() => setErrorMsg("")}>
                  {errorMsg}
                </Alert>
              )}
              {successMsg && (
                <Alert variant="success" dismissible onClose={() => setSuccessMsg("")}>
                  {successMsg}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleRegister}>
                {/* Nombre */}
                <Form.Group className="mb-3">
                  <Form.Label
                    className="fw-semibold small"
                    style={{ color: THEME.textMuted }}
                  >
                    Nombre completo
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
                      <FaUser />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Tu nombre"
                      name="nombre"
                      value={input.nombre}
                      onChange={handleInputChange}
                      className="border-start-0 rounded-3 py-2"
                      style={{ borderColor: THEME.border }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, ingresá tu nombre.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label
                    className="fw-semibold small"
                    style={{ color: THEME.textMuted }}
                  >
                    Correo electrónico
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
                      Por favor, ingresá un email válido.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Contraseña */}
                <Form.Group className="mb-4">
                  <Form.Label
                    className="fw-semibold small"
                    style={{ color: THEME.textMuted }}
                  >
                    Contraseña
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
                      <MdLockOutline />
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
                      style={{ borderColor: THEME.border }}
                    />
                    <Form.Control.Feedback type="invalid">
                      La contraseña debe tener al menos 6 caracteres.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Botón */}
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
                    {loading ? "Registrando..." : "Registrarse 💖"}
                  </Button>
                </div>

                {/* Link a login */}
                <div className="text-center">
                  <p className="small mb-0" style={{ color: THEME.textMuted }}>
                    ¿Ya tenés cuenta?{" "}
                    <Link
                      to="/login"
                      className="text-decoration-none fw-semibold"
                      style={{ color: THEME.primary }}
                    >
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