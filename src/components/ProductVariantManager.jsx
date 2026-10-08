import { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { 
  SHOE_SIZES, 
  CLOTHING_SIZES, 
  SPECIAL_SIZES, 
  LINGERIE_SIZES, 
  UNDERWEAR_INDIVIDUAL_SIZES,
  PRODUCT_COLORS,
  STORE_CATEGORIES 
} from '../config/constants';
import { supabase } from '../config/supabase';

function ProductVariantManager({ productId }) {
  const [selectedCategory, setSelectedCategory] = useState('lenceria'); 
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [stockPorDefecto, setStockPorDefecto] = useState(10); // Stock inicial mayorista predeterminado

  // Seleccionar la lista de talles según la categoría elegida
  const getSizesList = () => {
    switch (selectedCategory) {
      case 'lenceria': return LINGERIE_SIZES;
      case 'ropa': return CLOTHING_SIZES;
      case 'especial': return SPECIAL_SIZES;
      case 'calzado': return SHOE_SIZES;
      case 'accesorios': return UNDERWEAR_INDIVIDUAL_SIZES;
      default: return CLOTHING_SIZES;
    }
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleSelectAllSizes = () => {
    setSelectedSizes(getSizesList());
  };

  const handleClearSizes = () => {
    setSelectedSizes([]);
  };

  const handleSelectAllColors = () => {
    setSelectedColors(PRODUCT_COLORS);
  };

  const handleClearColors = () => {
    setSelectedColors([]);
  };

  // Generación masiva de variantes para el stock mayorista
  const handleSaveVariants = async () => {
    if (selectedSizes.length === 0 || selectedColors.length === 0) {
      alert("⚠️ Debes seleccionar al menos un talle y un color para generar el stock.");
      return;
    }

    const variantsToInsert = [];
    selectedSizes.forEach(size => {
      selectedColors.forEach(color => {
        variantsToInsert.push({
          product_id: productId,
          size: size,
          color: color,
          stock: parseInt(stockPorDefecto) || 0,
          sku: `MAY-${productId}-${size.substring(0,3)}-${color.substring(0,3)}`.toUpperCase().replace(/\s+/g, '')
        });
      });
    });

    try {
      const { error } = await supabase.from('product_variants').insert(variantsToInsert);
      if (error) throw error;
      alert(`✅ ¡Se generaron e insertaron ${variantsToInsert.length} combinaciones de variantes con éxito en Supabase!`);
    } catch (err) {
      console.error("Error al guardar variantes:", err);
      alert("Hubo un error al registrar las variantes en la base de datos.");
    }
  };

  return (
    <Card className="border-0 shadow-sm p-4 mb-4 bg-white rounded-4">
      <h4 className="fw-bold mb-3 text-dark">📦 Generador Mayorista de Variantes (Talles y Colores)</h4>
      <p className="text-muted small mb-4">
        Selecciona la categoría comercial, marca los talles y colores disponibles para este artículo y el sistema generará automáticamente la matriz de stock cruzada.
      </p>

      {/* Selector de Categoría Mayorista */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold text-secondary">Rubro / Categoría del Artículo</Form.Label>
        <Form.Select 
          value={selectedCategory} 
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSizes([]); // Limpiar selección anterior al cambiar de rubro
          }}
          className="rounded-3 py-2"
        >
          {STORE_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Sección de Talles con atajos de selección rápida */}
      <Form.Group className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label className="fw-semibold text-secondary mb-0">
            Talles Disponibles ({selectedCategory.toUpperCase()})
          </Form.Label>
          <div className="d-flex gap-2">
            <Button variant="outline-dark" size="sm" onClick={handleSelectAllSizes}>Seleccionar todos</Button>
            <Button variant="outline-secondary" size="sm" onClick={handleClearSizes}>Limpiar</Button>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 p-3 bg-light rounded-3 border">
          {getSizesList().map((size) => (
            <Button
              key={size}
              size="sm"
              variant={selectedSizes.includes(size) ? "dark" : "outline-secondary"}
              className="rounded-pill px-3 py-1"
              onClick={() => toggleSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </Form.Group>

      {/* Sección de Colores con atajos de selección rápida */}
      <Form.Group className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label className="fw-semibold text-secondary mb-0">
            Variedad de Colores
          </Form.Label>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" size="sm" onClick={handleSelectAllColors}>Seleccionar todos</Button>
            <Button variant="outline-secondary" size="sm" onClick={handleClearColors}>Limpiar</Button>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 p-3 bg-light rounded-3 border">
          {PRODUCT_COLORS.map((color) => (
            <Button
              key={color}
              size="sm"
              variant={selectedColors.includes(color) ? "primary" : "outline-primary"}
              className="rounded-pill px-3 py-1"
              onClick={() => toggleColor(color)}
            >
              {color}
            </Button>
          ))}
        </div>
      </Form.Group>

      {/* Stock Inicial Mayorista */}
      <Row className="align-items-end mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label className="fw-semibold text-secondary">Stock Inicial por Variante (Unidades)</Form.Label>
            <Form.Control 
              type="number" 
              value={stockPorDefecto} 
              onChange={(e) => setStockPorDefecto(e.target.value)} 
              className="rounded-3 py-2"
              min="0"
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-grid">
        <Button 
          variant="success" 
          size="lg" 
          className="rounded-pill py-3 fw-bold shadow-sm"
          onClick={handleSaveVariants}
        >
          🚀 Generar Matriz de Variantes y Stock en Supabase
        </Button>
      </div>
    </Card>
  );
}

export default ProductVariantManager;