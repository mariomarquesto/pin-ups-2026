import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  Form,
  InputGroup,
  Modal,
  Table,
  Alert,
} from "react-bootstrap";
import {
  FaUsers,
  FaArrowLeft,
  FaSyncAlt,
  FaSearch,
  FaEye,
  FaWhatsapp,
  FaEnvelope,
  FaTag,
  FaStickyNote,
  FaCrown,
  FaRedo,
  FaSeedling,
  FaUserPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import {
  getCrmData,
  addTag,
  removeTag,
  addNota,
  removeNota,
} from "../../utils/crm";

const BRAND = "#f85606";
const BRAND_DARK = "#e04a00";
const CREAM = "#fef6f0";

const SEGMENTOS = {
  vip: { label: "VIP", color: "#f85606", icon: FaCrown },
  recurrente: { label: "Recurrente", color: "#0d6efd", icon: FaRedo },
  nuevo: { label: "Nuevo", color: "#198754", icon: FaSeedling },
  prospecto: { label: "Prospecto", color: "#6c757d", icon: FaUserPlus },
};

const formatearFecha = (cruda) => {
  if (!cruda) return "—";
  const d = new Date(cruda);
  if (Number.isNaN(d.getTime())) return String(cruda);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatearFechaHora = (cruda) => {
  if (!cruda) return "—";
  const d = new Date(cruda);
  if (Number.isNaN(d.getTime())) return String(cruda);
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const money = (n) => `$${Number(n || 0).toLocaleString("es-AR")}`;

const soloDigitos = (s) => (s || "").replace(/\D/g, "");

// Traduce el error de Supabase a un mensaje útil para el admin.
const mensajeError = (err) => {
  const msg = err?.message || "";
  if (/relation|does not exist|42P01|could not find the table|schema cache/i.test(msg)) {
    return "Falta la tabla `crm_clients` en Supabase. Corré la migración `supabase/crm_clients.sql` una sola vez.";
  }
  if (/row-level security|42501|permission/i.test(msg)) {
    return "Sin permisos para guardar en `crm_clients` (revisá las políticas RLS).";
  }
  return msg || "No se pudo guardar en Supabase.";
};

const segmentar = (cliente) => {
  const pedidos = cliente.pedidos.length;
  if (cliente.totalGastado >= 100000 || pedidos >= 3) return "vip";
  if (pedidos === 2) return "recurrente";
  if (pedidos === 1) return "nuevo";
  return "prospecto";
};

// Une pedidos de Supabase, pedidos legacy y perfiles registrados en una lista de clientes.
const construirClientes = (supabaseOrders, legacyOrders, profiles) => {
  const map = new Map();

  const obtener = (email, nombre, telefono) => {
    const clave = (email || "").trim().toLowerCase() || `perfil:${nombre || soloDigitos(telefono) || Math.random()}`;
    if (!map.has(clave)) {
      map.set(clave, {
        key: clave,
        email: (email || "").trim(),
        nombre: nombre || email || "Sin nombre",
        telefono: telefono || "",
        pedidos: [],
        totalGastado: 0,
        ultimaCompra: null,
        role: null,
        registrado: null,
      });
    }
    const c = map.get(clave);
    if (nombre && (!c.nombre || c.nombre === c.email)) c.nombre = nombre;
    if (telefono && !c.telefono) c.telefono = telefono;
    if (email && !c.email) c.email = email.trim();
    return c;
  };

  (Array.isArray(profiles) ? profiles : []).forEach((p) => {
    const c = obtener(p.email, p.nombre, p.telefono || p.phone);
    c.role = p.role || c.role;
    c.registrado = p.created_at || c.registrado;
    if (p.id) c.profileId = p.id;
  });

  const todas = [
    ...(Array.isArray(supabaseOrders) ? supabaseOrders : []),
    ...(Array.isArray(legacyOrders) ? legacyOrders : []),
  ];

  const vistos = new Set();
  todas.forEach((o) => {
    const numero = o.numero_orden || o.numeroOrden;
    if (numero && vistos.has(numero)) return;
    if (numero) vistos.add(numero);

    const cl = o.cliente || {};
    const email = cl.email || o.customer_email || "";
    const c = obtener(email, cl.nombre, cl.telefono || cl.phone);
    const fecha = o.fecha || o.created_at || null;
    const total = Number(o.total || 0);
    const productos = Array.isArray(o.productos)
      ? o.productos
      : o.producto
      ? [o.producto]
      : [];

    c.pedidos.push({
      numero: numero || o.id,
      fecha,
      total,
      estado: o.estado || "pendiente",
      productos,
    });
    c.totalGastado += total;
    if (fecha && (!c.ultimaCompra || new Date(fecha) > new Date(c.ultimaCompra))) {
      c.ultimaCompra = fecha;
    }
  });

  return [...map.values()].map((c) => {
    c.pedidos.sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));
    const contador = {};
    c.pedidos.forEach((p) =>
      (p.productos || []).forEach((pr) => {
        const nombre = pr.titulo || pr.nombre || "Producto";
        contador[nombre] = (contador[nombre] || 0) + (pr.cantidad || 1);
      })
    );
    c.favoritos = Object.entries(contador)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }));
    c.segmento = segmentar(c);
    return c;
  });
};

const Kpi = ({ icon: Icon, label, value, accent = BRAND }) => (
  <Card className="shadow-sm border-0 h-100" style={{ borderTop: `4px solid ${accent}` }}>
    <Card.Body className="d-flex align-items-center gap-3">
      <div
        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: 50, height: 50, backgroundColor: CREAM, color: accent }}
      >
        <Icon size={20} />
      </div>
      <div className="overflow-hidden">
        <div className="text-muted small text-uppercase fw-semibold text-truncate">{label}</div>
        <div className="fs-4 fw-bold" style={{ color: BRAND_DARK }}>
          {value}
        </div>
      </div>
    </Card.Body>
  </Card>
);

const AdminCRM = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [filtroSegmento, setFiltroSegmento] = useState("todos");
  const [orden, setOrden] = useState("gasto");

  const [seleccionado, setSeleccionado] = useState(null);
  const [crmLocal, setCrmLocal] = useState({ tags: [], notas: [] });
  const [crmLoading, setCrmLoading] = useState(false);
  const [crmSaving, setCrmSaving] = useState(false);
  const [crmError, setCrmError] = useState("");
  const [nuevaTag, setNuevaTag] = useState("");
  const [nuevaNota, setNuevaNota] = useState("");

  const cargar = async () => {
    setLoading(true);
    let supabaseOrders = [];
    let profiles = [];
    let legacy = [];

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && Array.isArray(data)) supabaseOrders = data;
    } catch {
      /* sin conexión: seguimos con lo local */
    }

    try {
      const { data, error } = await supabase.from("profiles").select("*");
      if (!error && Array.isArray(data)) profiles = data;
    } catch {
      /* profiles puede estar protegido por RLS: se ignora */
    }

    try {
      const raw = JSON.parse(localStorage.getItem("ordenes")) || [];
      if (Array.isArray(raw)) legacy = raw;
    } catch {
      /* localStorage corrupto: se ignora */
    }

    setClientes(construirClientes(supabaseOrders, legacy, profiles));
    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirDetalle = async (cliente) => {
    setSeleccionado(cliente);
    setCrmLocal({ tags: [], notas: [] });
    setCrmError("");
    setNuevaTag("");
    setNuevaNota("");
    setCrmLoading(true);
    try {
      const data = await getCrmData(cliente);
      setCrmLocal(data);
    } catch (err) {
      setCrmError(mensajeError(err));
    } finally {
      setCrmLoading(false);
    }
  };

  const kpis = useMemo(() => {
    const compradores = clientes.filter((c) => c.pedidos.length > 0);
    const ingresos = clientes.reduce((acc, c) => acc + c.totalGastado, 0);
    const totalPedidos = clientes.reduce((acc, c) => acc + c.pedidos.length, 0);
    return {
      clientes: clientes.length,
      recurrentes: clientes.filter((c) => c.segmento === "vip" || c.segmento === "recurrente").length,
      compradores: compradores.length,
      ingresos,
      ticket: totalPedidos ? ingresos / totalPedidos : 0,
    };
  }, [clientes]);

  const listaFiltrada = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    let out = clientes.filter((c) => {
      const matchSegmento = filtroSegmento === "todos" || c.segmento === filtroSegmento;
      const matchQ =
        !q ||
        c.nombre.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        soloDigitos(c.telefono).includes(soloDigitos(q));
      return matchSegmento && matchQ;
    });

    out = [...out].sort((a, b) => {
      switch (orden) {
        case "gasto":
          return b.totalGastado - a.totalGastado;
        case "pedidos":
          return b.pedidos.length - a.pedidos.length;
        case "recientes":
          return new Date(b.ultimaCompra || 0) - new Date(a.ultimaCompra || 0);
        case "nombre":
          return a.nombre.localeCompare(b.nombre, "es");
        default:
          return 0;
      }
    });
    return out;
  }, [clientes, busqueda, filtroSegmento, orden]);

  const handleAddTag = async () => {
    if (!seleccionado || !nuevaTag.trim() || crmSaving) return;
    setCrmSaving(true);
    setCrmError("");
    try {
      const tags = await addTag(seleccionado, nuevaTag, crmLocal.tags);
      setCrmLocal((prev) => ({ ...prev, tags }));
      setNuevaTag("");
    } catch (err) {
      setCrmError(mensajeError(err));
    } finally {
      setCrmSaving(false);
    }
  };

  const handleRemoveTag = async (tag) => {
    if (!seleccionado || crmSaving) return;
    setCrmSaving(true);
    setCrmError("");
    try {
      const tags = await removeTag(seleccionado, tag, crmLocal.tags);
      setCrmLocal((prev) => ({ ...prev, tags }));
    } catch (err) {
      setCrmError(mensajeError(err));
    } finally {
      setCrmSaving(false);
    }
  };

  const handleAddNota = async () => {
    if (!seleccionado || !nuevaNota.trim() || crmSaving) return;
    setCrmSaving(true);
    setCrmError("");
    try {
      const notas = await addNota(seleccionado, nuevaNota, crmLocal.notas);
      setCrmLocal((prev) => ({ ...prev, notas }));
      setNuevaNota("");
    } catch (err) {
      setCrmError(mensajeError(err));
    } finally {
      setCrmSaving(false);
    }
  };

  const handleRemoveNota = async (id) => {
    if (!seleccionado || crmSaving) return;
    setCrmSaving(true);
    setCrmError("");
    try {
      const notas = await removeNota(seleccionado, id, crmLocal.notas);
      setCrmLocal((prev) => ({ ...prev, notas }));
    } catch (err) {
      setCrmError(mensajeError(err));
    } finally {
      setCrmSaving(false);
    }
  };

  const SegBadge = ({ seg }) => {
    const s = SEGMENTOS[seg] || SEGMENTOS.prospecto;
    const Icon = s.icon;
    return (
      <Badge
        className="d-inline-flex align-items-center gap-1 text-uppercase"
        style={{ backgroundColor: s.color }}
      >
        <Icon size={11} /> {s.label}
      </Badge>
    );
  };

  return (
    <Container fluid className="px-4 pb-5" style={{ backgroundColor: CREAM, minHeight: "100vh" }}>
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold d-flex align-items-center gap-2" style={{ color: BRAND_DARK }}>
            <FaUsers style={{ color: BRAND }} /> CRM de Clientes
          </h2>
          <p className="text-muted mb-0">
            Conocé a tus clientas, segmentalas y hacé seguimiento de cada una.
          </p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={cargar}
            className="d-flex align-items-center gap-1 rounded-pill"
          >
            <FaSyncAlt /> Actualizar
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate("/admin")}
            className="d-flex align-items-center gap-1 rounded-pill"
          >
            <FaArrowLeft /> Volver
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: BRAND }} />
        </div>
      ) : (
        <>
          <Row className="g-3 mb-4">
            <Col sm={6} lg={3}>
              <Kpi icon={FaUsers} label="Clientes" value={kpis.clientes} />
            </Col>
            <Col sm={6} lg={3}>
              <Kpi icon={FaRedo} label="Recurrentes / VIP" value={kpis.recurrentes} accent={BRAND_DARK} />
            </Col>
            <Col sm={6} lg={3}>
              <Kpi icon={FaCrown} label="Ingresos totales" value={money(kpis.ingresos)} accent="#198754" />
            </Col>
            <Col sm={6} lg={3}>
              <Kpi icon={FaTag} label="Ticket promedio" value={money(kpis.ticket)} accent="#0d6efd" />
            </Col>
          </Row>

          <Card className="shadow-sm border-0 mb-3">
            <Card.Body>
              <Row className="g-2 align-items-center">
                <Col lg={5}>
                  <InputGroup>
                    <InputGroup.Text style={{ backgroundColor: CREAM, color: BRAND }}>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Buscar por nombre, email o teléfono..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col sm={7} lg={4}>
                  <div className="d-flex flex-wrap gap-2">
                    {["todos", ...Object.keys(SEGMENTOS)].map((s) => {
                      const activo = filtroSegmento === s;
                      const meta = SEGMENTOS[s];
                      return (
                        <button
                          key={s}
                          onClick={() => setFiltroSegmento(s)}
                          className="rounded-pill border-0 px-3 py-1 small fw-semibold"
                          style={{
                            backgroundColor: activo ? meta?.color || BRAND : "#fff",
                            color: activo ? "#fff" : BRAND_DARK,
                            boxShadow: activo ? "none" : "0 0 0 1px #eee inset",
                          }}
                        >
                          {s === "todos" ? "Todos" : meta.label}
                        </button>
                      );
                    })}
                  </div>
                </Col>
                <Col sm={5} lg={3}>
                  <Form.Select value={orden} onChange={(e) => setOrden(e.target.value)}>
                    <option value="gasto">Ordenar: mayor gasto</option>
                    <option value="pedidos">Ordenar: más pedidos</option>
                    <option value="recientes">Ordenar: compra reciente</option>
                    <option value="nombre">Ordenar: nombre (A-Z)</option>
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {listaFiltrada.length === 0 ? (
            <Card className="shadow-sm text-center py-5 border-0">
              <Card.Body>
                <h5 className="fw-bold" style={{ color: BRAND_DARK }}>
                  No hay clientas que coincidan
                </h5>
                <p className="text-muted mb-0">
                  Probá con otra búsqueda o cambiá el segmento seleccionado.
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-sm border-0">
              <Table responsive className="align-middle mb-0">
                <thead style={{ backgroundColor: CREAM }}>
                  <tr>
                    <th className="fw-bold" style={{ color: BRAND_DARK }}>Clienta</th>
                    <th className="fw-bold" style={{ color: BRAND_DARK }}>Contacto</th>
                    <th className="fw-bold text-center" style={{ color: BRAND_DARK }}>Pedidos</th>
                    <th className="fw-bold text-end" style={{ color: BRAND_DARK }}>Gastó</th>
                    <th className="fw-bold" style={{ color: BRAND_DARK }}>Última compra</th>
                    <th className="fw-bold text-center" style={{ color: BRAND_DARK }}>Segmento</th>
                    <th className="text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  {listaFiltrada.map((c) => (
                    <tr key={c.key}>
                      <td>
                        <div className="fw-semibold">{c.nombre}</div>
                        {c.role && (
                          <span className="text-muted small text-uppercase">{c.role}</span>
                        )}
                      </td>
                      <td className="small text-muted">
                        {c.email && <div>{c.email}</div>}
                        {c.telefono && <div>{c.telefono}</div>}
                        {!c.email && !c.telefono && <div>Sin contacto</div>}
                      </td>
                      <td className="text-center fw-bold" style={{ color: BRAND_DARK }}>
                        {c.pedidos.length}
                      </td>
                      <td className="text-end fw-bold" style={{ color: BRAND_DARK }}>
                        {money(c.totalGastado)}
                      </td>
                      <td className="small text-muted">{formatearFecha(c.ultimaCompra)}</td>
                      <td className="text-center">
                        <SegBadge seg={c.segmento} />
                      </td>
                      <td className="text-end">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="rounded-pill d-inline-flex align-items-center gap-1"
                          onClick={() => abrirDetalle(c)}
                        >
                          <FaEye /> Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          )}
        </>
      )}

      <Modal show={!!seleccionado} onHide={() => setSeleccionado(null)} size="lg" centered>
        {seleccionado && (
          <>
            <Modal.Header closeButton style={{ backgroundColor: CREAM }}>
              <Modal.Title className="fw-bold" style={{ color: BRAND_DARK }}>
                {seleccionado.nombre}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {crmError && (
                <Alert variant="warning" className="py-2 small">
                  {crmError}
                </Alert>
              )}
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <SegBadge seg={seleccionado.segmento} />
                {crmLocal.tags.map((t) => (
                  <Badge
                    key={t}
                    className="d-inline-flex align-items-center gap-1"
                    style={{ backgroundColor: "#fff", color: BRAND_DARK, boxShadow: "0 0 0 1px #eee inset" }}
                  >
                    #{t}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => handleRemoveTag(t)}
                      onKeyDown={(e) => e.key === "Enter" && handleRemoveTag(t)}
                      style={{ cursor: "pointer", fontWeight: 700 }}
                    >
                      ×
                    </span>
                  </Badge>
                ))}
              </div>

              <Row className="g-3 mb-3">
                <Col sm={4}>
                  <div className="text-muted small text-uppercase">Pedidos</div>
                  <div className="fs-4 fw-bold" style={{ color: BRAND_DARK }}>
                    {seleccionado.pedidos.length}
                  </div>
                </Col>
                <Col sm={4}>
                  <div className="text-muted small text-uppercase">Total gastado</div>
                  <div className="fs-4 fw-bold" style={{ color: BRAND_DARK }}>
                    {money(seleccionado.totalGastado)}
                  </div>
                </Col>
                <Col sm={4}>
                  <div className="text-muted small text-uppercase">Última compra</div>
                  <div className="fw-semibold">{formatearFecha(seleccionado.ultimaCompra)}</div>
                </Col>
              </Row>

              <div className="d-flex flex-wrap gap-2 mb-4">
                {seleccionado.telefono && (
                  <Button
                    size="sm"
                    className="rounded-pill d-inline-flex align-items-center gap-1"
                    style={{ backgroundColor: "#25d366", borderColor: "#25d366" }}
                    href={`https://wa.me/${soloDigitos(seleccionado.telefono)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaWhatsapp /> WhatsApp
                  </Button>
                )}
                {seleccionado.email && (
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    className="rounded-pill d-inline-flex align-items-center gap-1"
                    href={`mailto:${seleccionado.email}`}
                  >
                    <FaEnvelope /> Email
                  </Button>
                )}
              </div>

              {seleccionado.favoritos?.length > 0 && (
                <>
                  <h6 className="fw-bold mb-2" style={{ color: BRAND_DARK }}>
                    Productos favoritos
                  </h6>
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {seleccionado.favoritos.map((f) => (
                      <Badge key={f.nombre} bg="light" text="dark" className="border">
                        {f.nombre} <span className="text-muted">×{f.cantidad}</span>
                      </Badge>
                    ))}
                  </div>
                </>
              )}

              <h6 className="fw-bold mb-2" style={{ color: BRAND_DARK }}>
                Historial de compras
              </h6>
              {seleccionado.pedidos.length === 0 ? (
                <p className="text-muted small">Todavía no realizó compras.</p>
              ) : (
                <Table size="sm" responsive className="mb-4">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seleccionado.pedidos.map((p, i) => (
                      <tr key={p.numero || i}>
                        <td>{p.numero || i + 1}</td>
                        <td>{formatearFechaHora(p.fecha)}</td>
                        <td className="text-uppercase small">{p.estado}</td>
                        <td className="text-end fw-semibold">{money(p.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              <h6 className="fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: BRAND_DARK }}>
                <FaTag style={{ color: BRAND }} /> Etiquetas
              </h6>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Agregar etiqueta (ej. mayorista, VIP...)"
                  value={nuevaTag}
                  disabled={crmLoading || crmSaving}
                  onChange={(e) => setNuevaTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button
                  style={{ backgroundColor: BRAND, borderColor: BRAND }}
                  onClick={handleAddTag}
                  disabled={crmLoading || crmSaving}
                >
                  {crmSaving ? <Spinner animation="border" size="sm" /> : "Agregar"}
                </Button>
              </InputGroup>

              <h6 className="fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: BRAND_DARK }}>
                <FaStickyNote style={{ color: BRAND }} /> Notas de seguimiento
              </h6>
              <InputGroup className="mb-2">
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Escribí una nota sobre esta clienta..."
                  value={nuevaNota}
                  disabled={crmLoading || crmSaving}
                  onChange={(e) => setNuevaNota(e.target.value)}
                />
                <Button
                  style={{ backgroundColor: BRAND, borderColor: BRAND }}
                  onClick={handleAddNota}
                  disabled={crmLoading || crmSaving}
                >
                  {crmSaving ? <Spinner animation="border" size="sm" /> : "Guardar"}
                </Button>
              </InputGroup>
              {crmLoading ? (
                <div className="text-center py-2">
                  <Spinner animation="border" size="sm" style={{ color: BRAND }} />
                </div>
              ) : crmLocal.notas.length === 0 ? (
                <p className="text-muted small mb-0">Sin notas todavía.</p>
              ) : (
                crmLocal.notas.map((n) => (
                  <div key={n.id} className="border-start ps-3 mb-2" style={{ borderColor: BRAND }}>
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <span className="small">{n.texto}</span>
                      <button
                        onClick={() => handleRemoveNota(n.id)}
                        className="btn btn-sm btn-link text-muted p-0"
                        aria-label="Eliminar nota"
                      >
                        ×
                      </button>
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                      {formatearFechaHora(n.fecha)}
                    </div>
                  </div>
                ))
              )}
            </Modal.Body>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default AdminCRM;
