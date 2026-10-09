// src/pages/Register.jsx

import { Card, Container, Row, Col, Form, Button, InputGroup, Alert } from "react-bootstrap";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaUserPlus } from "react-icons/fa";
import { MdEmail, MdLockOutline } from "react-icons/md";
import { supabase } from "../config/supabase";

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

      console.log("📝 Registrando usuario:", { email: emailLimpio, nombre: nombreLimpio });

      // 1. Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: emailLimpio,
        password: input.password,
        options: {
          data: {
            nombre: nombreLimpio,      // ✅ el trigger lo va a leer
            role: "client",
          },
        },
      });

      if (error) throw error;
      if (!data?.user) throw new Error("No se pudo crear el usuario.");

      console.log("✅ Usuario creado en auth.users:", data.user.id);

      // 2. Esperar un momento y verificar si el trigger ya creó el perfil
      //    Si no, lo insertamos manualmente desde el frontend
      let perfilCreado = false;

      try {
        // Pequeño delay para dar tiempo al trigger
        await new Promise((r) => setTimeout(r, 800));

        const { data: perfilExistente } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle();

        if (perfilExistente) {
          perfilCreado = true;
          console.log("✅ Perfil ya creado por el trigger");
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
                nombre: nombreLimpio,   // ✅ columna correcta
                role: "client",
              },
            ]);

          if (profileError) {
            console.warn("⚠️ Error al insertar perfil manualmente:", profileError.message);
          } else {
            console.log("✅ Perfil insertado manualmente");
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