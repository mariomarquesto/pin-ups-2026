import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { FaArrowLeft, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

// Paleta de marca Pin Ups
const BRAND = '#f85606';
const BRAND_DARK = '#e04a00';
const CREAM = '#fef6f0';

// Mapeo de nombres de categoría
const categoryNames = {
  vestidos: "Vestidos",
  pantalones: "Pantalones",
  remeras: "Remeras y Blusas",
  camperas: "Camperas y Abrigos",
  calzado: "Calzado",
  accesorios: "Accesorios",
};

// Opciones de talles según la categoría
const tallesPorCategoria = {
  remeras: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  vestidos: ['Único', 'S', 'M', 'L', 'XL'],
  pantalones: ['34', '36', '38', '40', '42', '44', '46', '48'],
  camperas: ['S', 'M', 'L', 'XL', 'XXL'],
  calzado: ['35', '36', '37', '38', '39', '40'],
  accesorios: ['Único']
};

// Colores disponibles frecuentes para selección rápida
const coloresDisponibles = [
  'Negro', 'Blanco', 'Rojo', 'Azul', 'Rosa', 'Beige',
  'Verde', 'Gris', 'Marrón', 'Celeste', 'Amarillo', 'Estampado'
];

const formatearPrecio = (precio) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio || 0);
};

/**
 * Sincroniza product_variants con los talles/colores del producto.
 * Genera el producto cartesiano talles × colores y reparte el stock.
 */
const syncProductVariants = async (productId, sizes = [], colors = [], stockTotal = 0) => {
  const numericId = parseInt(productId, 10);
  if (isNaN(numericId)) throw new Error('productId inválido');

  const tallas = (sizes || []).map(s => String(s).trim()).filter(Boolean);
  const colores = (colors || []).map(c => String(c).trim()).filter(Boolean);

  // 1. Borrar TODAS las variantes viejas del producto
  const { error: deleteError } = await supabase
    .from('product_variants')
    .delete()
    .eq('product_id', numericId);

  if (deleteError) throw deleteError;

  // 2. Si no hay talles ni colores, no insertamos nada
  if (tallas.length === 0 && colores.length === 0) {
    console.log(`ℹ️ Producto ${numericId} sin variantes.`);
    return 0;
  }

  const tallasFinal = tallas.length > 0 ? tallas : ['Único'];
  const coloresFinal = colores.length > 0 ? colores : ['Único'];

  // 3. Producto cartesiano con reparto de stock equitativo
  const totalCombinaciones = tallasFinal.length * coloresFinal.length;
  const stockNum = parseInt(stockTotal, 10) || 0;
  const base = Math.floor(stockNum / totalCombinaciones);
  const sobrante = stockNum % totalCombinaciones;

  const nuevasVariantes = [];
  let idx = 0;
  for (const size of tallasFinal) {
    for (const color of coloresFinal) {
      nuevasVariantes.push({
        product_id: numericId,
        size,
        color,
        stock: base + (idx < sobrante ? 1 : 0),
      });
      idx++;
    }
  }

  // 4. Insertar
  const { error: insertError } = await supabase
    .from('product_variants')
    .insert(nuevasVariantes);

  if (insertError) throw insertError;

  console.log(`✅ Sincronizadas ${nuevasVariantes.length} variantes para producto ${numericId}`);
  return nuevasVariantes.length;
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'remeras',
    stock: '',
    selectedSizes: [],
    selectedColors: [],
    image1: '', colorImage1: '',
    image2: '', colorImage2: '',
    image3: '', colorImage3: ''
  });

  const [imageFiles, setImageFiles] = useState({ file1: null, file2: null, file3: null });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error al cargar productos:', err.message);
      setErrorMsg('No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'remeras',
      stock: '',
      selectedSizes: [],
      selectedColors: [],
      image1: '', colorImage1: '',
      image2: '', colorImage2: '',
      image3: '', colorImage3: ''
    });
    setImageFiles({ file1: null, file2: null, file3: null });
    setIsOpenModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);

    const rawImages = Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []);

    let img1 = '', col1 = '';
    let img2 = '', col2 = '';
    let img3 = '', col3 = '';

    rawImages.forEach((item, index) => {
      let url = '';
      let color = '';

      if (typeof item === 'string') {
        const trimmed = item.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
          try {
            const parsed = JSON.parse(trimmed);
            url = parsed.url || '';
            color = parsed.color || '';
          } catch (e) {
            url = trimmed;
          }
        } else {
          url = trimmed;
        }
      }

      if (index === 0) { img1 = url; col1 = color; }
      if (index === 1) { img2 = url; col2 = color; }
      if (index === 2) { img3 = url; col3 = color; }
    });

    // Extraer talles/colores de la descripción
    let parsedSizes = [];
    let parsedColors = [];
    let cleanDescription = product.description || '';

    if (cleanDescription.includes('Talles:')) {
      const parts = cleanDescription.split('|');
      parts.forEach(part => {
        if (part.includes('Talles:')) {
          parsedSizes = part.replace('Talles:', '').trim().split(',').map(s => s.trim()).filter(Boolean);
        }
        if (part.includes('Colores:')) {
          parsedColors = part.replace('Colores:', '').trim().split(',').map(c => c.trim()).filter(Boolean);
        }
      });
      const descPart = parts.find(p => !p.includes('Talles:') && !p.includes('Colores:'));
      if (descPart) cleanDescription = descPart.trim();
    }

    setFormData({
      name: product.name || '',
      description: cleanDescription,
      price: product.price || '',
      category: product.category || 'remeras',
      stock: product.stock ?? '',
      selectedSizes: parsedSizes,
      selectedColors: parsedColors,
      image1: img1, colorImage1: col1,
      image2: img2, colorImage2: col2,
      image3: img3, colorImage3: col3
    });

    setImageFiles({ file1: null, file2: null, file3: null });
    setIsOpenModal(true);
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => {
      const exists = prev.selectedSizes.includes(size);
      return {
        ...prev,
        selectedSizes: exists
          ? prev.selectedSizes.filter(s => s !== size)
          : [...prev.selectedSizes, size]
      };
    });
  };

  const handleColorToggle = (color) => {
    setFormData(prev => {
      const exists = prev.selectedColors.includes(color);
      return {
        ...prev,
        selectedColors: exists
          ? prev.selectedColors.filter(c => c !== color)
          : [...prev.selectedColors, color]
      };
    });
  };

  const uploadImageToSupabase = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err) {
      console.error('Error subiendo imagen:', err);
      throw new Error('No se pudo subir la imagen al Storage.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.selectedSizes.length === 0) {
      setErrorMsg('Seleccioná al menos un talle.');
      return;
    }

    setUploadingImage(true);

    try {
      let url1 = imageFiles.file1 ? await uploadImageToSupabase(imageFiles.file1) : formData.image1;
      let url2 = imageFiles.file2 ? await uploadImageToSupabase(imageFiles.file2) : formData.image2;
      let url3 = imageFiles.file3 ? await uploadImageToSupabase(imageFiles.file3) : formData.image3;

      const imagesArray = [
        url1 ? JSON.stringify({ url: url1.trim(), color: formData.colorImage1.trim() || 'General' }) : null,
        url2 ? JSON.stringify({ url: url2.trim(), color: formData.colorImage2.trim() || 'General' }) : null,
        url3 ? JSON.stringify({ url: url3.trim(), color: formData.colorImage3.trim() || 'General' }) : null,
      ].filter(Boolean);

      const tallesStr = formData.selectedSizes.length > 0 ? formData.selectedSizes.join(', ') : 'Único';
      const coloresStr = formData.selectedColors.length > 0 ? formData.selectedColors.join(', ') : 'Estándar';

      const detalleCompleto = `Talles: ${tallesStr} | Colores: ${coloresStr} | ${formData.description || ''}`;

      const productPayload = {
        name: formData.name,
        description: detalleCompleto,
        category: formData.category.toLowerCase(),
        price: Number(formData.price),
        stock: Number(formData.stock) || 0,
        images: imagesArray,
        // Guardamos también en las columnas jsonb (por si las usás en otra parte)
        sizes: formData.selectedSizes,
        colors: formData.selectedColors,
      };

      let productId;

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', editingProduct.id);

        if (error) throw error;
        productId = editingProduct.id;
        setSuccessMsg('¡Prenda actualizada con éxito!');
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productPayload])
          .select()
          .single();

        if (error) throw error;
        productId = data.id;
        setSuccessMsg('¡Prenda agregada con éxito!');
      }

      // ⚡ SINCRONIZAR VARIANTES
      await syncProductVariants(
        productId,
        formData.selectedSizes,
        formData.selectedColors,
        Number(formData.stock) || 0
      );

      setIsOpenModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Error al guardar:', err.message);
      setErrorMsg('Error al guardar el producto: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás segura de eliminar esta prenda?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setSuccessMsg('Prenda eliminada correctamente');
      fetchProducts();
    } catch (err) {
      setErrorMsg('No se pudo eliminar el producto.');
    }
  };

  const tallesDisponiblesActuales = tallesPorCategoria[formData.category] || ['Único'];

  return (
    <Container className="py-5" style={{ backgroundColor: CREAM, minHeight: '100vh' }}>
      <div className="mb-4">
        <Link to="/admin" className="text-decoration-none d-flex align-items-center gap-1 mb-2" style={{ color: BRAND_DARK }}>
          <FaArrowLeft size={14} /> Volver al Panel
        </Link>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h1 className="fw-bold mb-1" style={{ color: BRAND_DARK }}>Administración de Prendas</h1>
            <p className="text-muted mb-0">Controlá el catálogo, talles, colores y detalles específicos por rubro.</p>
          </div>
          <Button
            className="d-flex align-items-center gap-2 px-4 py-2 shadow-sm rounded-pill border-0 text-white"
            style={{ backgroundColor: BRAND }}
            onClick={handleOpenCreate}
          >
            <FaPlus /> Nueva Prenda
          </Button>
        </div>
      </div>

      {errorMsg && <Alert variant="danger" onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert>}
      {successMsg && <Alert variant="success" onClose={() => setSuccessMsg('')} dismissible>{successMsg}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: BRAND }} />
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-4 overflow-hidden border border-light">
          <div className="table-responsive">
            <Table hover align="middle" className="mb-0">
              <thead className="table-light text-uppercase fs-7 text-muted">
                <tr>
                  <th className="py-3 px-4">Imágenes / Color</th>
                  <th className="py-3 px-4">Nombre y Ficha Técnica</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Precio</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">No hay prendas registradas.</td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const rawImgs = Array.isArray(product.images) ? product.images : [];

                    const validImgs = rawImgs.map(item => {
                      if (typeof item !== 'string') return null;
                      const trimmed = item.trim();
                      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
                        try {
                          const parsed = JSON.parse(trimmed);
                          return { url: parsed.url, color: parsed.color };
                        } catch (e) {
                          return { url: trimmed, color: 'General' };
                        }
                      }
                      return trimmed ? { url: trimmed, color: 'General' } : null;
                    }).filter(Boolean);

                    const categoryName = categoryNames[product.category] || product.category;

                    return (
                      <tr key={product.id}>
                        <td className="px-4">
                          {validImgs.length > 0 ? (
                            <div className="d-flex gap-2 align-items-center">
                              {validImgs.map((imgObj, idx) => (
                                <div key={idx} className="text-center" style={{ width: '40px' }}>
                                  <img
                                    src={imgObj.url}
                                    alt={`Foto ${idx + 1}`}
                                    style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                                    className="rounded border shadow-sm"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                  <div className="text-truncate text-muted" style={{ fontSize: '8px' }} title={imgObj.color}>
                                    {imgObj.color}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted small fst-italic">Sin imagen</span>
                          )}
                        </td>
                        <td className="px-4">
                          <div className="fw-bold text-dark">{product.name}</div>
                          <div className="text-muted small text-truncate" style={{ maxWidth: '305px' }}>
                            {product.description || 'Sin detalle especificado.'}
                          </div>
                        </td>
                        <td className="px-4"><Badge bg="light" text="dark" className="border">{categoryName}</Badge></td>
                        <td className="px-4 fw-semibold" style={{ color: BRAND_DARK }}>{formatearPrecio(product.price)}</td>
                        <td className="px-4">
                          <span className={`fw-bold ${product.stock <= 3 ? 'text-danger' : 'text-secondary'}`}>
                            {product.stock ?? 0} u.
                          </span>
                        </td>
                        <td className="px-4 text-end">
                          <Button variant="outline-secondary" size="sm" className="rounded-circle p-2 me-2" style={{ color: BRAND, borderColor: BRAND }} onClick={() => handleOpenEdit(product)} title="Editar">
                            <FaEdit size={14} />
                          </Button>
                          <Button variant="outline-danger" size="sm" className="rounded-circle p-2" onClick={() => handleDelete(product.id)} title="Eliminar">
                            <FaTrash size={14} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      {/* Modal de Creación / Edición */}
      <Modal show={isOpenModal} onHide={() => setIsOpenModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">{editingProduct ? 'Editar Prenda' : 'Nueva Prenda'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="pt-0">

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Nombre de la Prenda</Form.Label>
              <Form.Control type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ej: Vestido Midi Florencia / Zapatilla Urbana" />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Categoría</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        selectedSizes: []
                      });
                    }}
                  >
                    {Object.entries(categoryNames).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="mb-3 p-3 bg-light rounded border">
              <Form.Label className="fw-semibold d-block mb-2 text-dark">
                Seleccionar Talles Disponibles para esta {categoryNames[formData.category]}
              </Form.Label>
              <div className="d-flex flex-wrap gap-3">
                {tallesDisponiblesActuales.map((talle) => {
                  const isChecked = formData.selectedSizes.includes(talle);
                  return (
                    <Form.Check
                      key={talle}
                      type="checkbox"
                      id={`talle-${talle}`}
                      label={talle}
                      checked={isChecked}
                      onChange={() => handleSizeToggle(talle)}
                      className="fw-medium user-select-none"
                    />
                  );
                })}
              </div>
              {formData.selectedSizes.length === 0 && (
                <Form.Text className="text-danger mt-1 d-block">Seleccioná al menos un talle.</Form.Text>
              )}
            </div>

            <div className="mb-3 p-3 bg-light rounded border">
              <Form.Label className="fw-semibold d-block mb-2 text-dark">
                Colores Disponibles
              </Form.Label>
              <div className="d-flex flex-wrap gap-3">
                {coloresDisponibles.map((color) => {
                  const isChecked = formData.selectedColors.includes(color);
                  return (
                    <Form.Check
                      key={color}
                      type="checkbox"
                      id={`color-${color}`}
                      label={color}
                      checked={isChecked}
                      onChange={() => handleColorToggle(color)}
                      className="fw-medium user-select-none"
                    />
                  );
                })}
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Descripción o Cuidados Especiales</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ej: Algodón peinado premium, lavar con agua fría. O suela de goma antideslizante."
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Precio (ARS)</Form.Label>
                  <Form.Control type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="25000" />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Stock Total</Form.Label>
                  <Form.Control type="number" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="10" />
                  <Form.Text className="text-muted small">
                    Se reparte automáticamente entre talles × colores.
                  </Form.Text>
                </Form.Group>
              </div>
            </div>

            <hr className="my-4" />
            <h6 className="fw-bold mb-1">Fotografías y Color Asociado</h6>
            <p className="text-muted small mb-3">Asignale un color específico a cada foto para que el cliente lo vea en la tienda.</p>

            {[1, 2, 3].map((num) => (
              <div key={num} className="p-3 bg-light rounded border mb-3">
                <span className="fw-semibold small text-secondary d-block mb-2">Imagen #{num}</span>
                <div className="row g-2">
                  <div className="col-md-7">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      size="sm"
                      className="mb-1"
                      onChange={(e) => setImageFiles(prev => ({ ...prev, [`file${num}`]: e.target.files[0] }))}
                    />
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder={`O URL de imagen ${num}...`}
                      value={formData[`image${num}`]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [`image${num}`]: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-5">
                    <Form.Control
                      type="text"
                      size="sm"
                      placeholder="Color de foto (Ej: Negro)"
                      value={formData[`colorImage${num}`]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [`colorImage${num}`]: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            ))}

          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={() => setIsOpenModal(false)} disabled={uploadingImage}>Cancelar</Button>
            <Button type="submit" style={{ backgroundColor: BRAND, border: 'none' }} disabled={uploadingImage || formData.selectedSizes.length === 0}>
              {uploadingImage ? <Spinner animation="border" size="sm" /> : 'Guardar Producto'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminProducts;