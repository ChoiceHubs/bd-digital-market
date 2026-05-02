"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, []);

  return (
    
    <nav className="navbar">
    <h1>D-BAL DIGITAL MARKET</h1>
      <div className="logo">🛍️ MyStore</div>

      <div className="nav-links">
        <Link href="/orders">Orders</Link>
        <Link href="/">Home</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/cart">Cart ({cartCount})</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}