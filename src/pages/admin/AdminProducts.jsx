import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaUpload } from 'react-icons/fa';

// Mapeo de nombres de categoría
const categoryNames = {
  vestidos: "Vestidos",
  pantalones: "Pantalones",
  remeras: "Remeras y Blusas",
  camperas: "Camperas y Abrigos",
  calzado: "Calzado",
  accesorios: "Accesorios",
};

const formatearPrecio = (precio) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio || 0);
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
    price: '', 
    category: 'remeras', 
    stock: '',
    image1: '',
    image2: '',
    image3: ''
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
    setFormData({ name: '', price: '', category: 'remeras', stock: '', image1: '', image2: '', image3: '' });
    setImageFiles({ file1: null, file2: null, file3: null });
    setIsOpenModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    const imgs = Array.isArray(product.images) ? product.images : [product.images || ''];
    setFormData({
      name: product.name || '',
      price: product.price || '',
      category: product.category || 'remeras',
      stock: product.stock || '',
      image1: imgs[0] || '',
      image2: imgs[1] || '',
      image3: imgs[2] || ''
    });
    setImageFiles({ file1: null, file2: null, file3: null });
    setIsOpenModal(true);
  };

  const uploadImageToSupabase = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

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
    setUploadingImage(true);

    try {
      // Subir imágenes si se seleccionaron archivos nuevos, sino mantener texto/URL
      let url1 = imageFiles.file1 ? await uploadImageToSupabase(imageFiles.file1) : formData.image1;
      let url2 = imageFiles.file2 ? await uploadImageToSupabase(imageFiles.file2) : formData.image2;
      let url3 = imageFiles.file3 ? await uploadImageToSupabase(imageFiles.file3) : formData.image3;

      // Fallback por defecto si la primera está totalmente vacía
      const defaultImg = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600';
      if (!url1) url1 = defaultImg;

      // REGLA: Si la 2 o 3 están vacías, repetimos la primera para asegurar los 3 ángulos
      if (!url2) url2 = url1;
      if (!url3) url3 = url1;

      const imagesArray = [url1, url2, url3];

      const productPayload = {
        name: formData.name,
        category: formData.category.toLowerCase(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: imagesArray, // Se guarda como un array de 3 elementos
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', editingProduct.id);

        if (error) throw error;
        setSuccessMsg('¡Prenda actualizada exitosamente!');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productPayload]);

        if (error) throw error;
        setSuccessMsg('¡Prenda agregada exitosamente!');
      }

      setIsOpenModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Error al guardar producto:', err.message);
      setErrorMsg('Error al guardar: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás segura de que querés eliminar esta prenda?')) return;

    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;

      setSuccessMsg('Prenda eliminada correctamente');
      fetchProducts();
    } catch (err) {
      console.error('Error al eliminar:', err.message);
      setErrorMsg('No se pudo eliminar el producto.');
    }
  };

  return (
    <Container className="py-5">
      <div className="mb-4">
        <Link to="/admin" className="text-decoration-none text-muted d-flex align-items-center gap-1 mb-2">
          <FaArrowLeft size={14} /> Volver al Panel
        </Link>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h1 className="fw-bold text-dark mb-1">Administración de Prendas</h1>
            <p className="text-muted mb-0">Controlá el catálogo, precios y stock de tu indumentaria.</p>
          </div>
          <Button 
            variant="dark" 
            className="d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
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
          <Spinner animation="border" variant="dark" />
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-4 overflow-hidden border border-light">
          <div className="table-responsive">
            <Table hover align="middle" className="mb-0">
              <thead className="table-light text-uppercase fs-7 text-muted">
                <tr>
                  <th className="py-3 px-4">Imágenes</th>
                  <th className="py-3 px-4">Nombre</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Precio</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No hay prendas registradas todavía.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const imgs = Array.isArray(product.images) && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'];
                    const categoryDisplayName = categoryNames[product.category] || product.category || 'General';

                    return (
                      <tr key={product.id}>
                        <td className="px-4">
                          <div className="d-flex gap-1">
                            {imgs.slice(0, 3).map((imgUrl, idx) => (
                              <img key={idx} src={imgUrl} alt={`Vista ${idx+1}`} style={{ width: '35px', height: '35px', objectFit: 'cover' }} className="rounded shadow-sm border" />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 fw-bold text-dark">{product.name}</td>
                        <td className="px-4">
                          <Badge bg="light" text="dark" className="border px-2 py-1">
                            {categoryDisplayName}
                          </Badge>
                        </td>
                        <td className="px-4 fw-semibold text-success">{formatearPrecio(product.price)}</td>
                        <td className="px-4">
                          <span className={`fw-bold ${product.stock <= 3 ? 'text-danger' : 'text-secondary'}`}>
                            {product.stock ?? 0} u.
                          </span>
                        </td>
                        <td className="px-4 text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="rounded-circle p-2"
                              onClick={() => handleOpenEdit(product)}
                              title="Editar prenda"
                            >
                              <FaEdit size={14} />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="rounded-circle p-2"
                              onClick={() => handleDelete(product.id)}
                              title="Eliminar prenda"
                            >
                              <FaTrash size={14} />
                            </Button>
                          </div>
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

      {/* Modal para Crear / Editar producto */}
      <Modal show={isOpenModal} onHide={() => setIsOpenModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            {editingProduct ? 'Editar Prenda' : 'Agregar Nueva Prenda'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="pt-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Nombre de la prenda</Form.Label>
              <Form.Control 
                type="text" 
                required
                placeholder="Ej: Remera Oversize Basic"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Categoría</Form.Label>
              <Form.Select 
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {Object.entries(categoryNames).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Precio (ARS)</Form.Label>
                  <Form.Control 
                    type="number" 
                    required
                    placeholder="Ej: 25000"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Stock disponible</Form.Label>
                  <Form.Control 
                    type="number" 
                    required
                    placeholder="Ej: 10"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </Form.Group>
              </div>
            </div>

            <hr className="my-4" />
            <h6 className="fw-bold mb-3 text-dark">Fotografías del Producto (3 ángulos recomendados)</h6>
            <p className="text-muted small mb-3">Si solo subís o pegás una imagen, se repetirá automáticamente para los tres ángulos.</p>

            {/* Imagen 1 */}
            <div className="p-3 bg-light rounded border mb-3">
              <Form.Label className="fw-semibold small text-primary">Imagen 1 (Principal)</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*"
                className="mb-2"
                onChange={(e) => setImageFiles({...imageFiles, file1: e.target.files[0]})}
              />
              <Form.Control 
                type="text" 
                size="sm"
                placeholder="O URL de la imagen 1..."
                value={formData.image1}
                onChange={(e) => setFormData({...formData, image1: e.target.value})}
              />
            </div>

            {/* Imagen 2 */}
            <div className="p-3 bg-light rounded border mb-3">
              <Form.Label className="fw-semibold small text-secondary">Imagen 2 (Segundo ángulo - Opcional)</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*"
                className="mb-2"
                onChange={(e) => setImageFiles({...imageFiles, file2: e.target.files[0]})}
              />
              <Form.Control 
                type="text" 
                size="sm"
                placeholder="O URL de la imagen 2..."
                value={formData.image2}
                onChange={(e) => setFormData({...formData, image2: e.target.value})}
              />
            </div>

            {/* Imagen 3 */}
            <div className="p-3 bg-light rounded border mb-3">
              <Form.Label className="fw-semibold small text-secondary">Imagen 3 (Tercer ángulo - Opcional)</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*"
                className="mb-2"
                onChange={(e) => setImageFiles({...imageFiles, file3: e.target.files[0]})}
              />
              <Form.Control 
                type="text" 
                size="sm"
                placeholder="O URL de la imagen 3..."
                value={formData.image3}
                onChange={(e) => setFormData({...formData, image3: e.target.value})}
              />
            </div>

          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="outline-secondary" className="px-4" onClick={() => setIsOpenModal(false)} disabled={uploadingImage}>
              Cancelar
            </Button>
            <Button variant="dark" type="submit" className="px-4" disabled={uploadingImage}>
              {uploadingImage ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Subiendo...
                </>
              ) : (
                editingProduct ? 'Guardar Cambios' : 'Guardar Prenda'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminProducts;