"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const addToCart = (product: any) => {
    const newItem = {
      ...product,
      cartId: Date.now() + Math.random(),
    };

    const updated = [...cart, newItem];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      {/* NAVBAR WITH LOGO */}
      <div className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="logo" />
          <h2>BD Digital Market</h2>
        </div>

        <input
          placeholder="Search products..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/cart">Cart ({cart.length})</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="products">
        {filtered.length === 0 && <p>No products available</p>}

        {filtered.map((p) => (
          <div className="card" key={p.id}>
            <img
              src={p.image}
              onClick={() => setSelectedImage(p.image)}
              style={{ cursor: "pointer" }}
            />
            <h3>{p.name}</h3>
            <p>GHS {p.price}</p>
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} className="modal-img" />
        </div>
      )}

      <div className="footer">
  <div className="footer-content">

    {/* STORE INFO */}
    <div>
      <h3>BD Digital Market</h3>
      <p>Shop smart. Shop fast.</p>
      <p>Quality products at affordable prices.</p>
    </div>

    {/* STORE CONTACT */}
    <div>
      <h4>Contact Store</h4>
      <p>WhatsApp:0591000877</p>
      <p>Location: Ghana</p>
    </div>

    {/* 🔥 YOUR ADVERT (IMPORTANT) */}
    <div className="developer-box">
      <h4>Need a Website Like This?</h4>
      <p>This system was designed by <b>Choice</b></p>
      
      <p>Contact me: 0546201852</p>
    </div>

  </div>

  <p className="footer-bottom">
    © 2026 BD Digital Market | Developed by Choice
  </p>
</div>

    </div>
  );
}