"use client";

import { create } from "zustand";

/* ================= TYPES ================= */
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  type?: "image" | "video";
}

interface Store {
  products: Product[];
  cart: Product[];

  addProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  setProducts: (products: Product[]) => void;

  addToCart: (product: Product) => void;
}

/* ================= STORE ================= */
export const useStore = create<Store>((set) => ({
  products: [],
  cart: [],

  addProduct: (product) =>
    set((state) => {
      const updated = [...state.products, product];
      localStorage.setItem("products", JSON.stringify(updated));
      return { products: updated };
    }),

  deleteProduct: (id) =>
    set((state) => {
      const updated = state.products.filter((p) => p.id !== id);
      localStorage.setItem("products", JSON.stringify(updated));
      return { products: updated };
    }),

  setProducts: (products) => set({ products }),

  addToCart: (product) =>
    set((state) => ({
      cart: [...state.cart, product],
    })),
}));