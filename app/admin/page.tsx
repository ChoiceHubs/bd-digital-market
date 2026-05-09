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
} from "firebase/auth";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [view, setView] = useState("shop");

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] =
    useState<string>("");

  const [category, setCategory] =
    useState("");
  const [stock, setStock] =
    useState("In Stock");

  const [search, setSearch] =
    useState("");

  // DASHBOARD
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum: number, o: any) =>
      sum + Number(o.total || 0),
    0
  );

  const deliveredOrders =
    orders.filter(
      (o: any) =>
        o.status === "Delivered"
    ).length;

  const pendingOrders =
    orders.filter(
      (o: any) =>
        !o.status ||
        o.status === "Pending"
    ).length;

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // FETCH PRODUCTS
  const fetchProducts =
    async () => {
      const snapshot =
        await getDocs(
          collection(
            db,
            "products"
          )
        );

      const data =
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      setProducts(data);
    };

  // FETCH ORDERS
  const fetchOrders =
    async () => {
      const snapshot =
        await getDocs(
          collection(
            db,
            "orders"
          )
        );

      const data =
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      setOrders(data as any);
    };

  // LOGIN
  const login =
    async () => {
      try {
        await signInWithEmailAndPassword(
          auth,
          "admin@bddigital.com",
          password
        );

        setLoggedIn(true);
      } catch {
        alert(
          "Wrong password"
        );
      }
    };

  // LOGOUT
  const logout =
    async () => {
      await signOut(auth);
      setLoggedIn(false);
    };

  // IMAGE
  const handleImage = (
    e: any
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend =
      () => {
        if (
          typeof reader.result ===
          "string"
        ) {
          setImage(
            reader.result
          );
        }
      };

    reader.readAsDataURL(
      file
    );
  };

  // ADD PRODUCT
  const addProduct =
    async () => {
      if (
        !name ||
        !price ||
        !image ||
        !category
      ) {
        alert(
          "Fill all fields"
        );
        return;
      }

      try {
        await addDoc(
          collection(
            db,
            "products"
          ),
          {
            name,
            price,
            image,
            category,
            stock,
          }
        );

        alert(
          "Product added"
        );

        setName("");
        setPrice("");
        setImage("");
        setCategory("");
        setStock(
          "In Stock"
        );

        fetchProducts();
      } catch {
        alert(
          "Error adding product"
        );
      }
    };

  // DELETE PRODUCT
  const deleteProduct =
    async (
      id: string
    ) => {
      const ok =
        confirm(
          "Delete this product?"
        );

      if (!ok) return;

      await deleteDoc(
        doc(
          db,
          "products",
          id
        )
      );

      alert(
        "Deleted"
      );

      fetchProducts();
    };

  // DELETE ORDER
  const deleteOrder =
    async (
      id: string
    ) => {
      const ok =
        confirm(
          "Delete order?"
        );

      if (!ok) return;

      await deleteDoc(
        doc(
          db,
          "orders",
          id
        )
      );

      fetchOrders();
    };

  // UPDATE STATUS
  const updateStatus =
    async (
      id: string,
      status: string
    ) => {
      await updateDoc(
        doc(
          db,
          "orders",
          id
        ),
        {
          status,
        }
      );

      fetchOrders();
    };

  // WHATSAPP
  const contactCustomer = (
    o: any
  ) => {
    const phone =
      o.customer.phone.startsWith(
        "0"
      )
        ? "233" +
          o.customer.phone.slice(
            1
          )
        : o.customer.phone;

    const msg = `Hello ${o.customer.name}, your order totaling GHS ${o.total} is being processed.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      msg
    )}`;

    window.open(
      url,
      "_blank"
    );
  };

  // RECEIPT
  const downloadReceipt =
    (o: any) => {
      const items =
        o.items
          ?.map(
            (
              item: any
            ) =>
              `${item.name} - GHS ${item.price}`
          )
          .join(
            "\n"
          ) || "";

      const receipt = `
BD DIGITAL MARKET
-------------------
Customer: ${o.customer?.name}
Phone: ${o.customer?.phone}
Location: ${o.customer?.location}

Items:
${items}

Total: GHS ${o.total}

Status: ${
        o.status
      }
`;

      const blob =
        new Blob(
          [receipt],
          {
            type: "text/plain",
          }
        );

      const link =
        document.createElement(
          "a"
        );

      link.href =
        URL.createObjectURL(
          blob
        );

      link.download = `receipt-${o.customer?.name}.txt`;

      link.click();
    };

  // LOGIN SCREEN
  if (!loggedIn) {
    return (
      <div className="login">
        <h2>
          Admin Login
        </h2>

        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          onClick={login}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>
        Admin Panel
      </h1>

      {/* DASHBOARD */}
      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "15px",
          marginBottom:
            "20px",
        }}
      >
        <div className="card">
          <h3>
            Total Orders
          </h3>
          <p>
            {
              totalOrders
            }
          </p>
        </div>

        <div className="card">
          <h3>
            Revenue
          </h3>
          <p>
            GHS{" "}
            {
              totalRevenue
            }
          </p>
        </div>

        <div className="card">
          <h3>
            Delivered
          </h3>
          <p>
            {
              deliveredOrders
            }
          </p>
        </div>

        <div className="card">
          <h3>
            Pending
          </h3>
          <p>
            {
              pendingOrders
            }
          </p>
        </div>
      </div>

      {/* MENU */}
      <div className="admin-menu">
        <button
          onClick={() =>
            setView(
              "shop"
            )
          }
        >
          Shop
        </button>

        <button
          onClick={() =>
            setView(
              "upload"
            )
          }
        >
          Upload
        </button>

        <button
          onClick={() =>
            setView(
              "orders"
            )
          }
        >
          Orders
        </button>

        <button
          onClick={
            logout
          }
        >
          Logout
        </button>
      </div>

      {/* UPLOAD */}
      {view ===
        "upload" && (
        <div>
          <input
            placeholder="Product Name"
            value={
              name
            }
            onChange={(
              e
            ) =>
              setName(
                e.target
                  .value
              )
            }
          />

          <input
            placeholder="Price"
            value={
              price
            }
            onChange={(
              e
            ) =>
              setPrice(
                e.target
                  .value
              )
            }
          />

          <input
            placeholder="Category"
            value={
              category
            }
            onChange={(
              e
            ) =>
              setCategory(
                e.target
                  .value
              )
            }
          />

          <select
            value={
              stock
            }
            onChange={(
              e
            ) =>
              setStock(
                e.target
                  .value
              )
            }
          >
            <option>
              In Stock
            </option>
            <option>
              Out Of
              Stock
            </option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImage
            }
          />

          <button
            onClick={
              addProduct
            }
          >
            Add Product
          </button>
        </div>
      )}

      {/* SHOP */}
      {view ===
        "shop" && (
        <div className="products">
          {products.map(
            (p) => (
              <div
                className="card"
                key={
                  p.id
                }
              >
                <img
                  src={
                    p.image
                  }
                />

                <h3>
                  {
                    p.name
                  }
                </h3>

                <p>
                  GHS{" "}
                  {
                    p.price
                  }
                </p>

                <button
                  onClick={() =>
                    deleteProduct(
                      p.id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* ORDERS */}
      {view ===
        "orders" && (
        <div className="orders-container">
          <h2>
            Orders
          </h2>

          <input
            placeholder="Search customer..."
            value={
              search
            }
            onChange={(
              e
            ) =>
              setSearch(
                e.target
                  .value
              )
            }
          />

          {orders
            .filter(
              (
                o: any
              ) =>
                o.customer?.name
                  ?.toLowerCase()
                  .includes(
                    search.toLowerCase()
                  )
            )
            .map(
              (
                o: any
              ) => (
                <div
                  className="order-card"
                  key={
                    o.id
                  }
                >
                  <h3>
                    {
                      o.customer
                        ?.name
                    }
                  </h3>

                  <p>
                    {
                      o.customer
                        ?.phone
                    }
                  </p>

                  <h2>
                    GHS{" "}
                    {
                      o.total
                    }
                  </h2>

                  <button
                    onClick={() =>
                      updateStatus(
                        o.id,
                        "Delivered"
                      )
                    }
                  >
                    Delivered
                  </button>

                  <button
                    onClick={() =>
                      contactCustomer(
                        o
                      )
                    }
                  >
                    WhatsApp
                  </button>

                  <button
                    onClick={() =>
                      downloadReceipt(
                        o
                      )
                    }
                  >
                    Receipt
                  </button>

                  <button
                    onClick={() =>
                      deleteOrder(
                        o.id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              )
            )}
        </div>
      )}
    </div>
  );
}