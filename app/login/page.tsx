"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    const savedPassword = localStorage.getItem("admin_password") || "admin123";

    if (password === savedPassword) {
      localStorage.setItem("admin_logged_in", "true");
      router.push("/admin");
    } else {
      alert("Invalid password");
    }
  };

  return (
    <div className="card">
      <h2>Admin Login 🔐</h2>

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p style={{ marginTop: "10px", cursor: "pointer" }}
         onClick={() => router.push("/forgot-password")}>
        Forgot Password?
      </p>
    </div>
  );
}