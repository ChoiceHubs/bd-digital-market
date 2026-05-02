"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [view, setView] = useState("shop");

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string>("");

  const [newPass, setNewPass] = useState("");
  const [search, setSearch] = useState("");

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0
  );

  const deliveredOrders = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  const pendingOrders = orders.filter(
    (o) => !o.status || o.status === "Pending"
  ).length;

  // LOAD DATA
  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
    setOrders(JSON.parse(localStorage.getItem("orders") || "[]"));
  }, []);

  // DEFAULT PASSWORD
  useEffect(() => {
    if (!localStorage.getItem("adminPass")) {
      localStorage.setItem("adminPass", "1234");
    }
  }, []);

  // LOGIN
  const login = () => {
    if (password === localStorage.getItem("adminPass")) {
      setLoggedIn(true);
    } else {
      alert("Wrong password");
    }
  };

  const logout = () => setLoggedIn(false);

  // CHANGE PASSWORD
  const changePassword = () => {
    if (!newPass) return alert("Enter new password");
    localStorage.setItem("adminPass", newPass);
    alert("Password changed");
  };

  // IMAGE UPLOAD
  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // ADD PRODUCT
  const addProduct = () => {
    if (!name || !price || !image) {
      alert("Fill all fields");
      return;
    }

    const newProduct = {
      id: Date.now() + Math.random(),
      name,
      price,
      image,
    };

    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));

    setName("");
    setPrice("");
    setImage("");
  };

  // DELETE PRODUCT
  const deleteProduct = (id: number) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  // DELETE ORDER
  const deleteOrder = (id: number) => {
    const updated = orders.filter((o) => o.id !== id);
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  // UPDATE ORDER STATUS
  const updateOrderStatus = (id: number, status: string) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status } : o
    );

    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  // ✅ WHATSAPP CUSTOMER
  const contactCustomer = (o: any) => {
    if (!o.customer?.phone) return alert("No phone number");

    const phone = o.customer.phone.startsWith("0")
      ? "233" + o.customer.phone.slice(1)
      : o.customer.phone;

    const message = `Hello ${o.customer.name}, your order (GHS ${o.total}) is being processed.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  // LOGIN SCREEN
  if (!loggedIn) {
    return (
      <div className="login">
        <h2>Admin Login</h2>

        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

        <p
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => {
            const ok = confirm("Reset password to default (1234)?");
            if (ok) {
              localStorage.setItem("adminPass", "1234");
              alert("Password reset to 1234");
            }
          }}
        >
          Forgot Password?
        </p>
      </div>
    );
  }

  // MAIN ADMIN
  return (
    <div className="container">
      <h1>Admin Panel</h1>

      {/* ✅ DASHBOARD */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div className="card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>

        <div className="card">
          <h3>Total Revenue</h3>
          <p>GHS {totalRevenue}</p>
        </div>

        <div className="card">
          <h3>Delivered</h3>
          <p>{deliveredOrders}</p>
        </div>

        <div className="card">
          <h3>Pending</h3>
          <p>{pendingOrders}</p>
        </div>
      </div>

      <div className="admin-menu">
        <button onClick={() => setView("shop")}>Shop</button>
        <button onClick={() => setView("upload")}>Upload</button>
        <button onClick={() => setView("orders")}>Orders</button>
        <button onClick={() => setView("password")}>Change Password</button>
        <button onClick={logout}>Logout</button>
      </div>

      {/* UPLOAD */}
      {view === "upload" && (
        <div>
          <input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input type="file" accept="image/*" onChange={handleImage} />

          <button onClick={addProduct}>Add Product</button>
        </div>
      )}

      {/* SHOP */}
      {view === "shop" && (
        <div className="products">
          {products.map((p) => (
            <div className="card" key={p.id}>
              <img src={p.image} />
              <h3>{p.name}</h3>
              <p>GHS {p.price}</p>
              <button onClick={() => deleteProduct(p.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* ORDERS */}
      {view === "orders" && (
        <div className="orders-container">
          <h2>Orders</h2>

          <input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px",
              marginBottom: "15px",
              width: "100%",
              maxWidth: "400px",
            }}
          />

          {orders.length === 0 && <p>No orders yet</p>}

          {orders
            .filter((o) => {
              const key = search.toLowerCase();
              return (
                o.customer?.name?.toLowerCase().includes(key) ||
                o.customer?.phone?.toLowerCase().includes(key)
              );
            })
            .map((o) => (
              <div className="order-card" key={o.id}>
                <h3>Customer</h3>
                <p>Name: {o.customer?.name}</p>
                <p>Phone: {o.customer?.phone}</p>
                <p>Location: {o.customer?.location}</p>
                <p>Date: {o.date}</p>

                <p>
                  Status:{" "}
                  <b
                    style={{
                      color:
                        o.status === "Delivered"
                          ? "green"
                          : o.status === "Cancelled"
                          ? "red"
                          : "orange",
                    }}
                  >
                    {o.status || "Pending"}
                  </b>
                </p>

                <h3>Items</h3>

                <div className="order-items">
                  {o.items.map((item: any, index: number) => (
                    <div
                      className="order-item"
                      key={item.cartId || item.id + "-" + index}
                    >
                      <img src={item.image} />
                      <p>{item.name}</p>
                      <p>GHS {item.price}</p>
                    </div>
                  ))}
                </div>

                <h2>Total: GHS {o.total}</h2>

                {/* STATUS BUTTONS */}
                <div style={{ marginTop: "10px" }}>
                  <button onClick={() => updateOrderStatus(o.id, "Pending")}>
                    Pending
                  </button>

                  <button
                    onClick={() => updateOrderStatus(o.id, "Delivered")}
                    style={{ background: "green", color: "white" }}
                  >
                    Delivered
                  </button>

                  <button
                    onClick={() => updateOrderStatus(o.id, "Cancelled")}
                    style={{ background: "red", color: "white" }}
                  >
                    Cancel
                  </button>
                </div>

                {/* ✅ WHATSAPP BUTTON */}
                <button
                  style={{
                    background: "green",
                    color: "white",
                    padding: "8px",
                    marginTop: "10px",
                    border: "none",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                  onClick={() => contactCustomer(o)}
                >
                  WhatsApp Customer
                </button>

                {/* DELETE ORDER */}
                <button
                  style={{
                    background: "red",
                    color: "white",
                    padding: "8px",
                    marginTop: "10px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const ok = confirm("Delete this order?");
                    if (ok) deleteOrder(o.id);
                  }}
                >
                  Delete Order
                </button>
              </div>
            ))}
        </div>
      )}

      {/* PASSWORD */}
      {view === "password" && (
        <div>
          <input
            type="password"
            placeholder="New password"
            onChange={(e) => setNewPass(e.target.value)}
          />
          <button onClick={changePassword}>Update Password</button>
        </div>
      )}
    </div>
  );
}