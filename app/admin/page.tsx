"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

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

  // LOAD DATA
  useEffect(() => {
    fetchProducts();
    setOrders(JSON.parse(localStorage.getItem("orders") || "[]"));
  }, []);

  // FETCH PRODUCTS FROM FIREBASE
  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setProducts(data);
  };

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
  const addProduct = async () => {
    if (!name || !price || !image) {
      alert("Fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        name,
        price,
        image,
      });

      alert("Product added");

      setName("");
      setPrice("");
      setImage("");

      fetchProducts(); // refresh
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  // DELETE PRODUCT (FIREBASE)
  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      alert("Product deleted");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
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
            const ok = confirm("Reset password to 1234?");
            if (ok) {
              localStorage.setItem("adminPass", "1234");
              alert("Password reset");
            }
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

      {/* ORDERS (still local for now) */}
      {view === "orders" && (
        <div className="orders-container">
          <h2>Orders</h2>

          {orders.length === 0 && <p>No orders yet</p>}

          {orders.map((o) => (
            <div className="order-card" key={o.id}>
              <p>{o.customer?.name}</p>
              <p>{o.customer?.phone}</p>
              <p>GHS {o.total}</p>
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