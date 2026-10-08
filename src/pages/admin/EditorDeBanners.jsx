import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Image, Spinner, Badge } from "react-bootstrap";
import { FaImages, FaEye, FaTrash } from "react-icons/fa";
import { supabase } from "../../config/supabase";

const BRAND = "#f85606";
const BRAND_DARK = "#e04a00";
const CREAM = "#fef6f0";
const BUCKET_NAME = "sliders"; // 👈 Nombre correcto del bucket en plural

// Las imágenes por defecto idénticas a tu Slider.jsx
const fallbackImages = [
  '/pin-ups1.png',
  '/pin-ups2.png',
  '/pin-ups3.png',
  '/pin-ups4.png',
  '/pin-ups5.png',
  '/pin-ups6.png'
];

const EditorDeBanners = () => {
  const [supabaseSlides, setSupabaseSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  useEffect(() => {
    fetchSupabaseSlides();
  }, []);

  const fetchSupabaseSlides = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("slider_images")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setSupabaseSlides(data || []);
    } catch (error) {
      console.error("Error al cargar los slides de Supabase:", error);
    } finally {
      setLoading(false);
    }
  };

  // Subir o reemplazar imagen en Supabase para un índice determinado
  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingIndex(index);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `slider-${index}-${Date.now()}.${fileExt}`;

      // 1. Subir al bucket 'sliders'
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data: publicData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      const publicUrl = publicData?.publicUrl;

      // 3. Verificar si ya existe un registro con este order_index en Supabase
      const existingSlide = supabaseSlides.find((s) => s.order_index === index);

      if (existingSlide) {
        const { error: updateError } = await supabase
          .from("slider_images")
          .update({ image_url: publicUrl })
          .eq("id", existingSlide.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("slider_images")
          .insert([{ image_url: publicUrl, order_index: index }]);

        if (insertError) throw insertError;
      }

      alert(`✅ Imagen ${index + 1} guardada en Supabase con éxito.`);
      fetchSupabaseSlides();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Hubo un error al subir la imagen al bucket 'sliders': " + (error.message || JSON.stringify(error)));
    } finally {
      setUploadingIndex(null);
    }
  };

  // Eliminar imagen de Supabase (vuelve automáticamente al fallback de esa posición)
  const handleDeleteSlide = async (id) => {
    if (!window.confirm("¿Estás segura de eliminar esta imagen de Supabase? Volverá a mostrar la imagen por defecto.")) return;

    try {
      const { error } = await supabase.from("slider_images").delete().eq("id", id);
      if (error) throw error;
      alert("🗑️ Imagen eliminada de Supabase.");
      fetchSupabaseSlides();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar la imagen.");
    }
  };

  return (
    <Container fluid className="px-4 pb-5" style={{ backgroundColor: CREAM, minHeight: "100vh" }}>
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold d-flex align-items-center gap-2" style={{ color: BRAND_DARK }}>
            <FaImages style={{ color: BRAND }} /> Editor del Carrusel (Slider)
          </h2>
          <p className="text-muted mb-0">
            Aquí puedes ver las imágenes por defecto y personalizarlas subiendo tus propias fotos desde la PC a Supabase.
          </p>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: BRAND }} />
        </div>
      ) : (
        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3 text-secondary">⚙️ Gestión de los 6 Slots del Carrusel</h5>
                <p className="small text-muted mb-4">
                  Si un slot no tiene imagen propia en Supabase, la tienda mostrará automáticamente su respectiva imagen por defecto. Al subir una nueva foto, reemplazará la imagen en la tienda pública.
                </p>

                {fallbackImages.map((defaultUrl, index) => {
                  const customSlide = supabaseSlides.find((s) => s.order_index === index);
                  const activeUrl = customSlide ? customSlide.image_url : defaultUrl;
                  const isCustomized = !!customSlide;

                  return (
                    <div key={index} className="p-3 mb-3 border rounded-3 bg-white shadow-sm">
                      <Row className="align-items-center">
                        <Col xs={12} md={3} className="text-center mb-3 mb-md-0 position-relative">
                          <Image
                            src={activeUrl}
                            alt={`Slot ${index + 1}`}
                            fluid
                            rounded
                            className="border shadow-sm"
                            style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                          />
                          <div className="position-absolute top-0 start-0 m-1">
                            {isCustomized ? (
                              <Badge bg="success" className="small">Personalizada</Badge>
                            ) : (
                              <Badge bg="secondary" className="small">Por defecto</Badge>
                            )}
                          </div>
                        </Col>

                        <Col xs={12} md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-semibold text-muted mb-1">
                              Slot #{index + 1} {isCustomized ? "(Guardada en Supabase)" : "(Usando imagen local por defecto)"}
                            </Form.Label>
                            <div className="d-flex gap-2 align-items-center">
                              <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, index)}
                                disabled={uploadingIndex === index}
                                size="sm"
                              />
                              {uploadingIndex === index && (
                                <Spinner animation="border" size="sm" style={{ color: BRAND }} />
                              )}
                            </div>
                          </Form.Group>
                        </Col>

                        <Col xs={12} md={3} className="text-end mt-3 mt-md-0">
                          {isCustomized ? (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="rounded-pill px-3 w-100"
                              onClick={() => handleDeleteSlide(customSlide.id)}
                            >
                              <FaTrash className="me-1" /> Quitar de Supabase
                            </Button>
                          ) : (
                            <span className="text-muted small d-block fst-italic">
                              Predeterminada activa
                            </span>
                          )}
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{ top: '1rem' }}>
              <Card.Header className="bg-dark text-white py-3 d-flex align-items-center gap-2">
                <FaEye /> <span className="fw-semibold">¿Cómo funciona?</span>
              </Card.Header>
              <Card.Body className="p-3">
                <p className="small text-muted mb-3">
                  Tu tienda está programada para mostrar las <strong>6 imágenes por defecto</strong> si no hay registros en Supabase.
                </p>
                <div className="bg-light p-3 rounded border text-muted small mb-3">
                  📌 Sube una foto en cualquiera de los slots de arriba para guardarla automáticamente en tu bucket <code>sliders</code> y reemplazar la imagen estática correspondiente.
                </div>
                <div className="text-center">
                  <span className="badge bg-secondary">
                    Imágenes personalizadas en Supabase: {supabaseSlides.length} / 6
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default EditorDeBanners;