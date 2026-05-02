"use client";

import { useState } from "react";

export default function ForgotPassword() {
  const [newPass, setNewPass] = useState("");

  const handleReset = () => {
    if (!newPass) {
      alert("Enter new password");
      return;
    }

    localStorage.setItem("admin_password", newPass);
    alert("Password reset successful");
  };

  return (
    <div className="card">
      <h2>Reset Password 🔄</h2>

      <input
        type="password"
        placeholder="New password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />

      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
}