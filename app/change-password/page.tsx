"use client";

import { useState } from "react";

export default function ChangePassword() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const handleChange = () => {
    const saved = localStorage.getItem("admin_password") || "admin123";

    if (oldPass !== saved) {
      alert("Wrong current password");
      return;
    }

    localStorage.setItem("admin_password", newPass);
    alert("Password changed successfully");
  };

  return (
    <div className="card">
      <h2>Change Password 🔑</h2>

      <input
        type="password"
        placeholder="Current password"
        value={oldPass}
        onChange={(e) => setOldPass(e.target.value)}
      />

      <input
        type="password"
        placeholder="New password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />

      <button onClick={handleChange}>Change Password</button>
    </div>
  );
}