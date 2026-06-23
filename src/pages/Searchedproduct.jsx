import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import Product from "../components/Product";
import products from "../data/products.json";

const Searchedproduct = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("q") || "";

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const search = normalizeText(searchTerm);

  const filteredProducts = products.filter((product) => {
    const title = normalizeText(product.title);
    const category = normalizeText(product.category);
    const brand = normalizeText(product.brand);

    return (
      title.includes(search) ||
      category.includes(search) ||
      brand.includes(search)
    );
  });

  return (
    <Container className="py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">
          Resultados para:{" "}
          <span style={{ color: "#f85606" }}>
            {searchTerm}
          </span>
        </h2>

        <p className="text-muted">
          {filteredProducts.length} producto(s) encontrado(s)
        </p>
      </div>

      <Product products={filteredProducts} />
    </Container>
  );
};

export default Searchedproduct;