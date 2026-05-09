"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../firebase";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [newPass, setNewPass] = useState("");
  const [view, setView] = useState("shop");

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("In Stock");
  const [search, setSearch] = useState("");

  const adminEmail = "klarbinicodemus@gmail.com";

  // DASHBOARD
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

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(
      collection(db, "products")
    );

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setProducts(data);
  };

  const fetchOrders = async () => {
    const snapshot = await getDocs(
      collection(db, "orders")
    );

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setOrders(data);
  };

  // LOGIN
  const login = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        adminEmail,
        password
      );

      setLoggedIn(true);
    } catch {
      alert("Wrong password");
    }
  };

  // FORGOT PASSWORD
  const forgotPassword = async () => {
    try {
      await sendPasswordResetEmail(
        auth,
        adminEmail
      );

      alert("Password reset link sent. Check your email.");
    } catch {
      alert("Failed to send reset email.");
    }
  };

  // CHANGE PASSWORD
  const changePassword = async () => {
    try {
      if (!auth.currentUser) {
        alert("Login first");
        return;
      }

      await updatePassword(
        auth.currentUser,
        newPass
      );

      alert("Password changed successfully");
      setNewPass("");
    } catch {
      alert("Error changing password");
    }
  };

  // LOGOUT
  const logout = async () => {
    await signOut(auth);
    setLoggedIn(false);
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
  const addProduct = async () => {
    if (!name || !price || !image || !category) {
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "products"), {
      name,
      price,
      image,
      category,
      stock,
    });

    alert("Product added");

    setName("");
    setPrice("");
    setImage("");
    setCategory("");
    setStock("In Stock");

    fetchProducts();
  };

  // DELETE PRODUCT
  const deleteProduct = async (id: string) => {
    const ok = confirm("Delete product?");
    if (!ok) return;

    await deleteDoc(doc(db, "products", id));

    alert("Deleted");
    fetchProducts();
  };

  // DELETE ORDER
  const deleteOrder = async (id: string) => {
    const ok = confirm("Delete order?");
    if (!ok) return;

    await deleteDoc(doc(db, "orders", id));
    fetchOrders();
  };

  // UPDATE ORDER STATUS
  const updateStatus = async (
    id: string,
    status: string
  ) => {
    await updateDoc(doc(db, "orders", id), {
      status,
    });

    fetchOrders();
  };

  // WHATSAPP
  const contactCustomer = (o: any) => {
    const phone = o.customer.phone.startsWith("0")
      ? "233" + o.customer.phone.slice(1)
      : o.customer.phone;

    const msg = `Hello ${o.customer.name}, your order totaling GHS ${o.total} is being processed.`;

    const url =
      `https://wa.me/${phone}?text=` +
      encodeURIComponent(msg);

    window.open(url, "_blank");
  };

  // RECEIPT
  const downloadReceipt = (o: any) => {
    const items =
      o.items
        ?.map(
          (item: any) =>
            `${item.name} - GHS ${item.price}`
        )
        .join("\n") || "";

    const receipt = `
BD DIGITAL MARKET
-----------------------
Customer: ${o.customer?.name}
Phone: ${o.customer?.phone}
Location: ${o.customer?.location}

Items:
${items}

Total: GHS ${o.total}
Status: ${o.status || "Pending"}
`;

    const blob = new Blob([receipt], {
      type: "text/plain",
    });

    const link =
      document.createElement("a");

    link.href =
      URL.createObjectURL(blob);

    link.download =
      `receipt-${o.customer?.name}.txt`;

    link.click();
  };

  // LOGIN PAGE
  if (!loggedIn) {
    return (
      <div className="login">
        <h2>Admin Login</h2>

        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={login}>
          Login
        </button>

        <p
          onClick={forgotPassword}
          style={{
            color: "blue",
            cursor: "pointer",
            marginTop: "15px",
          }}
        >
          Forgot Password?
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Admin Panel</h1>

      {/* DASHBOARD */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "15px",
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

      {/* MENU */}
      <div className="admin-menu">
        <button onClick={() => setView("shop")}>
          Shop
        </button>

        <button onClick={() => setView("upload")}>
          Upload
        </button>

        <button onClick={() => setView("orders")}>
          Orders
        </button>

        <button onClick={() => setView("password")}>
          Change Password
        </button>

        <button onClick={logout}>
          Logout
        </button>
      </div>

      {/* PASSWORD */}
      {view === "password" && (
        <div>
          <input
            type="password"
            placeholder="New password"
            value={newPass}
            onChange={(e) =>
              setNewPass(e.target.value)
            }
          />

          <button onClick={changePassword}>
            Update Password
          </button>
        </div>
      )}

      {/* UPLOAD */}
      {view === "upload" && (
        <div>
          <input
            placeholder="Product Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          />

          <select
            value={stock}
            onChange={(e) =>
              setStock(e.target.value)
            }
          >
            <option>In Stock</option>
            <option>Out Of Stock</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          <button onClick={addProduct}>
            Add Product
          </button>
        </div>
      )}

      {/* SHOP */}
      {view === "shop" && (
        <div className="products">
          {products.map((p) => (
            <div
              className="card"
              key={p.id}
            >
              <img src={p.image} />

              <h3>{p.name}</h3>

              <p>GHS {p.price}</p>

              <p>{p.category}</p>

              <p>{p.stock}</p>

              <button
                onClick={() =>
                  deleteProduct(p.id)
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ORDERS */}
      {view === "orders" && (
        <div className="orders-container">
          <h2>Orders</h2>

          <input
            placeholder="Search customer..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              padding: "10px",
              width: "100%",
              maxWidth: "400px",
              marginBottom: "20px",
            }}
          />

          {orders.length === 0 && (
            <p>No orders yet</p>
          )}

          {orders
            .filter((o) =>
              o.customer?.name
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
            )
            .map((o) => (
              <div
                className="order-card"
                key={o.id}
              >
                <h3>{o.customer?.name}</h3>
                <p>{o.customer?.phone}</p>
                <p>{o.customer?.location}</p>

                <p>
                  Status:{" "}
                  <b
                    style={{
                      color:
                        o.status ===
                        "Delivered"
                          ? "green"
                          : o.status ===
                            "Cancelled"
                          ? "red"
                          : "orange",
                    }}
                  >
                    {o.status ||
                      "Pending"}
                  </b>
                </p>

                <div className="order-items">
                  {o.items?.map(
                    (
                      item: any,
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="order-item"
                      >
                        <img
                          src={item.image}
                          style={{
                            width:
                              "80px",
                            height:
                              "80px",
                            objectFit:
                              "cover",
                          }}
                        />
                        <p>{item.name}</p>
                        <p>
                          GHS{" "}
                          {
                            item.price
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>

                <h2>
                  GHS {o.total}
                </h2>

                <div
                  style={{
                    marginTop:
                      "10px",
                  }}
                >
                  <button
                    onClick={() =>
                      updateStatus(
                        o.id,
                        "Pending"
                      )
                    }
                  >
                    Pending
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        o.id,
                        "Delivered"
                      )
                    }
                    style={{
                      background:
                        "green",
                      marginLeft:
                        "10px",
                    }}
                  >
                    Delivered
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        o.id,
                        "Cancelled"
                      )
                    }
                    style={{
                      background:
                        "red",
                      marginLeft:
                        "10px",
                    }}
                  >
                    Cancel
                  </button>
                </div>

                <button
                  onClick={() =>
                    contactCustomer(o)
                  }
                  style={{
                    marginTop:
                      "10px",
                  }}
                >
                  WhatsApp
                </button>

                <button
                  onClick={() =>
                    downloadReceipt(o)
                  }
                  style={{
                    marginLeft:
                      "10px",
                  }}
                >
                  Receipt
                </button>

                <button
                  onClick={() =>
                    deleteOrder(o.id)
                  }
                  style={{
                    background:
                      "red",
                    marginLeft:
                      "10px",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}