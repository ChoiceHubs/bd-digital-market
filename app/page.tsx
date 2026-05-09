"use client";

import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  // NEW
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  // LOADING
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(
        collection(db, "products")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(data);

      setLoading(false);
    };

    fetchProducts();

    setCart(
      JSON.parse(
        localStorage.getItem("cart") || "[]"
      )
    );
  }, []);

  const addToCart = (product: any) => {
    if (product.stock === "Out Of Stock") {
      return;
    }

    const newItem = {
      ...product,
      cartId: Date.now() + Math.random(),
    };

    const updated = [...cart, newItem];

    setCart(updated);

    localStorage.setItem(
      "cart",
      JSON.stringify(updated)
    );

    alert("Added to cart");
  };

  // CATEGORIES
  const categories = [
    "All",
    ...new Set(
      products.map((p: any) => p.category)
    ),
  ];

  // FILTER
  const filtered = products.filter((p: any) => {
    const matchesSearch = p?.name
      ?.toLowerCase()
      ?.includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="logo" />
          <h2>BD Digital Market</h2>
        </div>

        <input
          placeholder="Search products..."
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <div className="nav-links">
          <Link href="/">Home</Link>

          <Link href="/cart">
            Cart ({cart.length})
          </Link>

          <Link href="/admin">Admin</Link>
        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <div className="hero-overlay">
          <h1>Welcome to BD Digital Market</h1>

          <p>
            Affordable products, fast delivery
            and trusted shopping.
          </p>

          <Link href="/cart">
            <button className="hero-btn">
              View Cart
            </button>
          </Link>
        </div>
      </div>

      {/* SECTION TITLE */}
      <div className="section-title">
        <h2>Featured Products</h2>

        <p>Browse our latest products</p>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="categories">
        {categories.map((cat, index) => (
          <button
            key={index}
            className={
              selectedCategory === cat
                ? "active-category"
                : ""
            }
            onClick={() =>
              setSelectedCategory(cat)
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>

          <p>Loading products...</p>
        </div>
      ) : (
        <div className="products">
          {filtered.length === 0 && (
            <div className="empty-products">
              <h3>No products found</h3>

              <p>
                Try another category or
                search.
              </p>
            </div>
          )}

          {filtered.map((p) => (
            <div className="card" key={p.id}>
              <div className="image-container">
                <img
                  src={p.image}
                  onClick={() =>
                    setSelectedImage(p.image)
                  }
                />
              </div>

              <div className="card-body">
                <h3>{p.name}</h3>

                <p className="category-text">
                  {p.category}
                </p>

                <p className="price">
                  GHS {p.price}
                </p>

                <p
                  className={
                    p.stock === "In Stock"
                      ? "stock-green"
                      : "stock-red"
                  }
                >
                  {p.stock}
                </p>

                <button
                  disabled={
                    p.stock ===
                    "Out Of Stock"
                  }
                  onClick={() =>
                    addToCart(p)
                  }
                >
                  {p.stock ===
                  "Out Of Stock"
                    ? "Out Of Stock"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="modal"
          onClick={() =>
            setSelectedImage(null)
          }
        >
          <img
            src={selectedImage}
            className="modal-img"
          />
        </div>
      )}

      {/* WHY US */}
      <div className="why-us">
        <div className="why-card">
          <h3>Fast Delivery</h3>

          <p>
            We deliver products quickly and
            safely.
          </p>
        </div>

        <div className="why-card">
          <h3>Affordable Prices</h3>

          <p>
            Get quality products at good
            prices.
          </p>
        </div>

        <div className="why-card">
          <h3>Trusted Store</h3>

          <p>
            Easy ordering with direct
            WhatsApp support.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-content">
          <div>
            <h3>BD Digital Market</h3>

            <p>Shop smart. Shop fast.</p>

            <p>
              Quality products at affordable
              prices.
            </p>
          </div>

          <div>
            <h4>Contact Store</h4>

            <p>WhatsApp: 0591000877</p>

            <p>Location: Accra, Ghana</p>
          </div>

          <div className="developer-box">
            <h4>
              Need a Website Like This?
            </h4>

            <p>
              This system was designed by{" "}
              <b>Choice</b>
            </p>

            <p>Contact me: 0546201852</p>
          </div>
        </div>

        <p className="footer-bottom">
          © 2026 BD Digital Market |
          Developed by Choice
        </p>
      </div>
    </div>
  );
}