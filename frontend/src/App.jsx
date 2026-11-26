
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api";

function App() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("Loading products...");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [cart, setCart] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    fetch(`${API}/products`)
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

  const loadCart = async (authToken) => {
    try {
      const res = await fetch(`${API}/cart`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not load cart");
      }

      setCart(data);
    } catch (error) {
      setCartMessage(error.message);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setCartMessage("");

    try {
      if (isRegister) {
        const registerRes = await fetch(`${API}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const registerData = await registerRes.json();

        if (!registerRes.ok) {
          throw new Error(registerData.message || "Registration failed");
        }
      }

      const loginRes = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        throw new Error(loginData.message || "Login failed");
      }

      setToken(loginData.token);
      setCartMessage(
        isRegister
          ? "Account created successfully! Welcome to CartCraft."
          : "Login successful!"
      );

      await loadCart(loginData.token);
      setPassword("");
      setIsRegister(false);
    } catch (error) {
      setCartMessage(error.message);
    }
  };

  const addToCart = async (productId) => {
    try {
      const res = await fetch(`${API}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not add product");
      }

      setCartMessage("Product added to cart!");
      await loadCart(token);
    } catch (error) {
      setCartMessage(error.message);
    }
  };

  const checkout = async () => {
    if (!cartItems.length) return;

    setIsCheckingOut(true);
    setCartMessage("");

    try {
      const res = await fetch(`${API}/orders/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Checkout failed");
      }

      setCart({ items: [] });
      setCartMessage("Order placed successfully! Thank you for shopping with CartCraft.");

      const productsRes = await fetch(`${API}/products`);
      if (productsRes.ok) {
        const updatedProducts = await productsRes.json();
        setProducts(updatedProducts);
      }
    } catch (error) {
      setCartMessage(error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const cartItems = cart?.items || [];

  const total = cartItems.reduce(
    (sum, item) =>
      sum + (item.product?.price || item.price || 0) * item.quantity,
    0
  );

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

            <button
              onClick={() => addToCart(product._id)}
              disabled={!token || product.stock < 1}
            >
              {!token
                ? "Login to Add"
                : product.stock < 1
                ? "Out of Stock"
                : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>

      <hr />

      <h2>{isRegister ? "Create Your Account" : "Login"}</h2>

      {!token ? (
        <>
          <form onSubmit={handleAuth}>
            {isRegister && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="Your Personal Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            <button type="submit">
              {isRegister ? "Register" : "Login"}
            </button>
          </form>

          <p>
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setCartMessage("");
              }}
            >
              {isRegister ? "Login" : "Create Account"}
            </button>
          </p>
        </>
      ) : (
        <p>Logged in as {email}</p>
      )}

      {cartMessage && <p>{cartMessage}</p>}

      <h2>Your Shopping Cart</h2>

      {!token ? (
        <p>Please login to view your cart.</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item._id}>
              <p>
                {item.product?.name || "Product"} — Quantity: {item.quantity}
                {" — "}Rs. {(item.product?.price || item.price || 0) * item.quantity}
              </p>
            </div>
          ))}

          <h3>Total: Rs. {total}</h3>

          <button onClick={checkout} disabled={isCheckingOut}>
            {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
