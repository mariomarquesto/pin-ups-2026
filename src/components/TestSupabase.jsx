import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

function TestSupabase() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*");
      console.log("Datos:", data);
      setProductos(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Productos en Supabase: {productos.length}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {productos.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              width: "200px",
            }}
          >
            <img
              src={p.thumbnail}
              alt={p.title}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <h4>{p.title}</h4>
            <p>${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestSupabase;
