import { useEffect, useState, useCallback } from "react";
import { Button, Card, Container, Row, Col, Image } from "react-bootstrap";
import { FaTrashAlt, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Addtocart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);

  // Cargar carrito desde localStorage
  useEffect(() => {
    loadCart();
  }, []);

  const calculateTotals = useCallback(() => {
    const subtotalAmount = cart.reduce((acc, item) => {
      const priceWithDiscount =
        item.price - item.price * item.discountPercentage * 0.01;
      return acc + priceWithDiscount * item.quantity;
    }, 0);

    setSubtotal(subtotalAmount);

    // Envío gratis en compras mayores a $70,000
    const shipping = subtotalAmount > 70000 ? 0 : 5000;
    setShippingCost(shipping);
    setTotal(subtotalAmount + shipping);
  }, [cart]);

  // Calcular totales cuando el carrito cambia
  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item,
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (itemId, itemTitle) => {
    if (window.confirm(`¿Eliminar ${itemTitle} del carrito?`)) {
      const updatedCart = cart.filter((item) => item.id !== itemId);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const clearCart = () => {
    if (window.confirm("¿Vaciar carrito completamente?")) {
      setCart([]);
      localStorage.setItem("cart", JSON.stringify([]));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateItemPrice = (item) => {
    const priceWithDiscount =
      item.price - item.price * item.discountPercentage * 0.01;
    return priceWithDiscount * item.quantity;
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center" style={{ minHeight: "60vh" }}>
        <div className="empty-cart">
          <FaShoppingCart size={80} className="text-muted mb-4" />
          <h4 className="mb-3">Tu carrito está vacío</h4>
          <p className="text-muted mb-4">
            ¡Agregá productos y empezá a armar tu look!
          </p>
          <Link to="/">
            <Button
              className="rounded-pill px-4 py-2"
              style={{ backgroundColor: "#f85606", borderColor: "#f85606" }}
            >
              Seguir comprando 🛍️
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container
      className="py-4"
      style={{ backgroundColor: "#fef6f0", minHeight: "100vh" }}
    >
      <Row>
        <Col lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-semibold mb-0">🛒 Mi Carrito</h3>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={clearCart}
              className="rounded-pill"
            >
              Vaciar carrito
            </Button>
          </div>

          {cart.map((item, index) => {
            const itemTotal = calculateItemPrice(item);
            const hasDiscount = item.discountPercentage > 0;
            const originalPrice = item.price;
            const discountedPrice =
              originalPrice - originalPrice * item.discountPercentage * 0.01;

            return (
              <Card
                key={index}
                className="mb-3 border-0 shadow-sm rounded-4 overflow-hidden"
              >
                <Row className="g-0 align-items-center">
                  {/* Imagen */}
                  <Col xs={4} md={3} className="bg-light p-3 text-center">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fluid
                      className="rounded-3"
                      style={{ maxHeight: "100px", objectFit: "contain" }}
                      onError={(e) =>
                        (e.target.src = "/images/placeholder.jpg")
                      }
                    />
                  </Col>

                  {/* Info producto */}
                  <Col xs={8} md={5}>
                    <Card.Body className="py-2 py-md-3">
                      <Card.Title className="fs-6 fw-bold mb-1">
                        {item.title}
                      </Card.Title>
                      <Card.Text className="small text-muted mb-2">
                        {item.brand}
                      </Card.Text>

                      <div className="d-flex flex-wrap gap-2 align-items-center">
                        <span
                          className="fw-bold text-primary"
                          style={{ color: "#f85606" }}
                        >
                          {formatPrice(discountedPrice)}
                        </span>
                        {hasDiscount && (
                          <>
                            <span className="text-decoration-line-through text-muted small">
                              {formatPrice(originalPrice)}
                            </span>
                            <span className="badge bg-danger rounded-pill">
                              -{item.discountPercentage}%
                            </span>
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Col>

                  {/* Cantidad y acciones */}
                  <Col xs={12} md={4}>
                    <Card.Footer className="bg-white border-0 d-flex justify-content-between align-items-center py-3">
                      <div className="d-flex align-items-center gap-2">
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <FaMinus size={12} />
                        </Button>
                        <span
                          className="fw-semibold mx-2"
                          style={{ minWidth: "40px", textAlign: "center" }}
                        >
                          {item.quantity}
                        </span>
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <FaPlus size={12} />
                        </Button>
                      </div>

                      <div className="text-end">
                        <div
                          className="fw-bold text-primary mb-1"
                          style={{ color: "#f85606" }}
                        >
                          {formatPrice(itemTotal)}
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger p-0"
                          onClick={() => removeItem(item.id, item.title)}
                        >
                          <FaTrashAlt size={14} />
                        </Button>
                      </div>
                    </Card.Footer>
                  </Col>
                </Row>
              </Card>
            );
          })}
        </Col>

        {/* Resumen del pedido */}
        <Col lg={4}>
          <Card
            className="border-0 shadow-sm rounded-4 sticky-top"
            style={{ top: "20px" }}
          >
            <Card.Header className="bg-white border-0 pt-4 pb-2">
              <h5 className="fw-semibold mb-0">Resumen del pedido</h5>
            </Card.Header>
            <Card.Body className="pt-0">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Envío</span>
                <span>
                  {shippingCost === 0 ? "Gratis 🎉" : formatPrice(shippingCost)}
                </span>
              </div>
              {shippingCost === 0 && subtotal > 0 && (
                <div className="text-success small mb-2">
                  ✨ Envío gratis por compras superiores a $70,000
                </div>
              )}
              <hr className="my-3" />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total</span>
                <span className="fw-bold fs-5" style={{ color: "#f85606" }}>
                  {formatPrice(total)}
                </span>
              </div>

              <Button
                className="w-100 py-2 rounded-pill fw-semibold border-0 mb-3"
                style={{ backgroundColor: "#f85606", color: "white" }}
              >
                Finalizar compra 💳
              </Button>

              <Link to="/">
                <Button
                  variant="outline-secondary"
                  className="w-100 rounded-pill"
                >
                  ← Seguir comprando
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Addtocart;
