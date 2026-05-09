"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  // LOAD CART
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  // TOTAL
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  // REMOVE ITEM
  const removeItem = (id: number) => {
    const updated = cart.filter((item) => item.cartId !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // 🔥 PLACE ORDER (NOW SAVES TO FIREBASE)
  const placeOrder = async () => {
    if (!name || !phone || !location) {
      alert("Fill all details");
      return;
    }

    const order = {
      items: cart,
      total,
      date: new Date().toLocaleString(),
      customer: { name, phone, location },
      status: "Pending",
    };

    try {
      // ✅ SAVE TO FIREBASE
      await addDoc(collection(db, "orders"), order);

      // ✅ WHATSAPP MESSAGE
      const message = `🛒 *NEW ORDER RECEIVED*

Name: ${name}
Phone: ${phone}
Location: ${location}

*Items:*
${cart
  .map((item) => `• ${item.name} - GHS ${item.price}`)
  .join("\n")}

*Total: GHS ${total}*

We are glad to have you as one of our cherished customers. Please make payment to the momo nuber below and send a screenshot of your payment back to us.
MoMo Number: 233591000877
Name: BALIK DORCAS.
Thank you for your order!`;

      const whatsappNumber = "233591000877";

      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;

      // CLEAR CART
      localStorage.removeItem("cart");
      setCart([]);

      // OPEN WHATSAPP
      window.open(url, "_blank");

      alert("Order placed successfully!");
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Cart</h1>

      {/* CART ITEMS */}
      <div className="cart-grid">
        {cart.length === 0 && <p>Your cart is empty</p>}

        {cart.map((item: any, index: number) => (
          <div
            className="cart-card"
            key={item.cartId || item.id + "-" + index}
          >
            <img src={item.image} />
            <h3>{item.name}</h3>
            <p>GHS {item.price}</p>

            <button onClick={() => removeItem(item.cartId)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <h2>Total: GHS {total}</h2>

      {/* FORM */}
      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Phone"
          onChange={(e) => setPhone(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Location"
          onChange={(e) => setLocation(e.target.value)}
        />
        <br /><br />

        <button onClick={placeOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
}