"use client";

import { useEffect } from "react";
import { useStore } from "./cartStore";
import ProductCard from "./ProductCard"; // ✅ FIXED (lowercase)

export default function Products() {
  const { products, setProducts } = useStore();

  // LOAD PRODUCTS FROM LOCALSTORAGE
  useEffect(() => {
    const data = localStorage.getItem("products");
    if (data) {
      setProducts(JSON.parse(data));
    }
  }, [setProducts]);

  return (
    <section className="px-6 py-16">
      
      <h2 className="text-2xl font-bold mb-6 text-center">
        Featured Products
      </h2>

      {products.length === 0 ? (
        <p className="text-center">No products yet. Add from admin.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* ✅ FIXED TYPE ERROR HERE */}
          {products.map((product: any) => (
            <ProductCard key={product.id} {...product} />
          ))}

        </div>
      )}
    </section>
  );
}