"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  id: number;
  items: any[];
  total: number;
  reference: string;
  date: string;
  status?: string;
  customer?: {
    name: string;
    phone: string;
    address: string;
  };
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  // LOAD ORDERS
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders") || "[]");

    const updated = data.map((order: Order) => ({
      ...order,
      status: order.status || "Pending",
    }));

    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  }, []);

  // UPDATE STATUS
  const updateStatus = (id: number, status: string) => {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, status } : order
    );

    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  // DELETE ORDER
  const deleteOrder = (id: number) => {
    const updated = orders.filter((order) => order.id !== id);

    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Admin Orders Dashboard 📊
      </h1>

      <Link href="/admin">
        <button style={{ marginBottom: "20px" }}>
          ← Back to Admin
        </button>
      </Link>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              background: "#fff",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Order #{order.id}</h3>

            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Reference:</strong> {order.reference}</p>
            <p><strong>Total:</strong> GHS {order.total}</p>

            {/* CUSTOMER INFO */}
            <div style={{ marginTop: "10px" }}>
              <h4>Customer Info</h4>
              <p><strong>Name:</strong> {order.customer?.name}</p>
              <p><strong>Phone:</strong> {order.customer?.phone}</p>
              <p><strong>Address:</strong> {order.customer?.address}</p>
            </div>

            {/* STATUS */}
            <p style={{ marginTop: "10px" }}>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    order.status === "Pending"
                      ? "orange"
                      : order.status === "Paid"
                      ? "blue"
                      : "green",
                  fontWeight: "bold",
                }}
              >
                {order.status}
              </span>
            </p>

            {/* STATUS BUTTONS */}
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => updateStatus(order.id, "Pending")}>
                Pending
              </button>

              <button
                onClick={() => updateStatus(order.id, "Paid")}
                style={{ marginLeft: "10px" }}
              >
                Paid
              </button>

              <button
                onClick={() => updateStatus(order.id, "Delivered")}
                style={{ marginLeft: "10px" }}
              >
                Delivered
              </button>
            </div>

            {/* ITEMS */}
            <div style={{ marginTop: "15px" }}>
              <h4>Items:</h4>

              {order.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "8px",
                  }}
                >
                  {item.image && item.image.startsWith("http") && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  )}

                  <span>
                    {item.name} - GHS {item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* DELETE */}
            <button
              onClick={() => deleteOrder(order.id)}
              style={{
                marginTop: "15px",
                background: "red",
                color: "white",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete Order
            </button>
          </div>
        ))
      )}
    </div>
  );
}