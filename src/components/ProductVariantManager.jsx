// src/components/ProductVariantManager.jsx

import { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import {
  SHOE_SIZES,
  CLOTHING_SIZES,
  SPECIAL_SIZES,
  LINGERIE_SIZES,
  UNDERWEAR_INDIVIDUAL_SIZES,
  PRODUCT_COLORS,
  STORE_CATEGORIES,
} from '../config/constants';
import { supabase } from '../config/supabase';

// Paleta chocolate Pin Ups
const THEME = {
  primary: "#3E2723",       // chocolate oscuro (marca principal)
  primaryDark: "#2D1B15",   // chocolate más oscuro (hover)
  primaryLight: "#5D4037",  // chocolate medio (acentos)
  background: "#FFFFFF",
  backgroundAlt: "#F5F0EB",
  textPrimary: "#1A1A1A",
  textSecondary: "#4E342E",
  textMuted: "#8D6E63",
  border: "#D7CCC8",
};

function ProductVariantManager({ productId }) {
  const [selectedCategory, setSelectedCategory] = useState('lenceria');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [stockPorDefecto, setStockPorDefecto] = useState(10);

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
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSelectAllSizes = () => setSelectedSizes(getSizesList());
  const handleClearSizes = () => setSelectedSizes([]);
  const handleSelectAllColors = () => setSelectedColors(PRODUCT_COLORS);
  const handleClearColors = () => setSelectedColors([]);

  const handleSaveVariants = async () => {
    if (selectedSizes.length === 0 || selectedColors.length === 0) {
      alert("⚠️ Debes seleccionar al menos un talle y un color para generar el stock.");
      return;
    }

    const variantsToInsert = [];
    selectedSizes.forEach((size) => {
      selectedColors.forEach((color) => {
        variantsToInsert.push({
          product_id: productId,
          size: size,
          color: color,
          stock: parseInt(stockPorDefecto) || 0,
          sku: `MAY-${productId}-${size.substring(0, 3)}-${color.substring(0, 3)}`
            .toUpperCase()
            .replace(/\s+/g, ''),
        });
      });
    });

    try {
      const { error } = await supabase
        .from('product_variants')
        .insert(variantsToInsert);

      if (error) throw error;

      alert(
        `✅ ¡Se generaron e insertaron ${variantsToInsert.length} combinaciones de variantes con éxito en Supabase!`
      );
    } catch (err) {
      console.error("Error al guardar variantes:", err);
      alert("Hubo un error al registrar las variantes en la base de datos.");
    }
  };

  return (
    <Card
      className="border-0 shadow-sm p-4 mb-4 rounded-4"
      style={{ backgroundColor: THEME.background }}
    >
      <h4 className="fw-bold mb-3" style={{ color: THEME.textPrimary }}>
        📦 Generador Mayorista de Variantes (Talles y Colores)
      </h4>

      <p className="small mb-4" style={{ color: THEME.textMuted }}>
        Seleccioná la categoría comercial, marcá los talles y colores disponibles
        para este artículo y el sistema generará automáticamente la matriz de
        stock cruzada.
      </p>

      {/* Selector de Categoría */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold" style={{ color: THEME.textSecondary }}>
          Rubro / Categoría del Artículo
        </Form.Label>
        <Form.Select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSizes([]);
          }}
          className="rounded-3 py-2"
          style={{ borderColor: THEME.border }}
        >
          {STORE_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Talles */}
      <Form.Group className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label
            className="fw-semibold mb-0"
            style={{ color: THEME.textSecondary }}
          >
            Talles Disponibles ({selectedCategory.toUpperCase()})
          </Form.Label>
          <div className="d-flex gap-2">
            <Button
              size="sm"
              onClick={handleSelectAllSizes}
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${THEME.primary}`,
                color: THEME.primary,
              }}
            >
              Seleccionar todos
            </Button>
            <Button
              size="sm"
              onClick={handleClearSizes}
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${THEME.border}`,
                color: THEME.textMuted,
              }}
            >
              Limpiar
            </Button>
          </div>
        </div>

        <div
          className="d-flex flex-wrap gap-2 p-3 rounded-3"
          style={{
            backgroundColor: THEME.backgroundAlt,
            border: `1px solid ${THEME.border}`,
          }}
        >
          {getSizesList().map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <Button
                key={size}
                size="sm"
                className="rounded-pill px-3 py-1"
                onClick={() => toggleSize(size)}
                style={{
                  backgroundColor: isSelected ? THEME.primary : "transparent",
                  border: `1px solid ${
                    isSelected ? THEME.primary : THEME.border
                  }`,
                  color: isSelected ? "#FFFFFF" : THEME.textSecondary,
                  fontWeight: 600,
                }}
              >
                {size}
              </Button>
            );
          })}
        </div>
      </Form.Group>

      {/* Colores */}
      <Form.Group className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label
            className="fw-semibold mb-0"
            style={{ color: THEME.textSecondary }}
          >
            Variedad de Colores
          </Form.Label>
          <div className="d-flex gap-2">
            <Button
              size="sm"
              onClick={handleSelectAllColors}
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${THEME.primary}`,
                color: THEME.primary,
              }}
            >
              Seleccionar todos
            </Button>
            <Button
              size="sm"
              onClick={handleClearColors}
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${THEME.border}`,
                color: THEME.textMuted,
              }}
            >
              Limpiar
            </Button>
          </div>
        </div>

        <div
          className="d-flex flex-wrap gap-2 p-3 rounded-3"
          style={{
            backgroundColor: THEME.backgroundAlt,
            border: `1px solid ${THEME.border}`,
          }}
        >
          {PRODUCT_COLORS.map((color) => {
            const isSelected = selectedColors.includes(color);
            return (
              <Button
                key={color}
                size="sm"
                className="rounded-pill px-3 py-1"
                onClick={() => toggleColor(color)}
                style={{
                  backgroundColor: isSelected ? THEME.primary : "transparent",
                  border: `1px solid ${
                    isSelected ? THEME.primary : THEME.border
                  }`,
                  color: isSelected ? "#FFFFFF" : THEME.textSecondary,
                  fontWeight: 600,
                }}
              >
                {color}
              </Button>
            );
          })}
        </div>
      </Form.Group>

      {/* Stock inicial */}
      <Row className="align-items-end mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label
              className="fw-semibold"
              style={{ color: THEME.textSecondary }}
            >
              Stock Inicial por Variante (Unidades)
            </Form.Label>
            <Form.Control
              type="number"
              value={stockPorDefecto}
              onChange={(e) => setStockPorDefecto(e.target.value)}
              className="rounded-3 py-2"
              min="0"
              style={{ borderColor: THEME.border }}
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-grid">
        <Button
          size="lg"
          className="rounded-pill py-3 fw-bold shadow-sm"
          onClick={handleSaveVariants}
          style={{
            backgroundColor: THEME.primary,
            border: "none",
            color: "#FFFFFF",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = THEME.primaryDark)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = THEME.primary)
          }
        >
          🚀 Generar Matriz de Variantes y Stock en Supabase
        </Button>
      </div>
    </Card>
  );
}

export default ProductVariantManager;