
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("Loading products...");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setMessage(data.length ? "" : "No products available yet.");
      })
      .catch(() => setMessage("Cannot connect to backend."));
  }, []);

  return (
    <div className="app">
      <h1>CartCraft</h1>
      <p>Your Smart Shopping Experience</p>

      <h2>Our Products</h2>

      {message && <p>{message}</p>}

      <div className="products">
        {products.map((product) => (
          <div className="product" key={product._id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <strong>Rs. {product.price}</strong>
            <p>Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
