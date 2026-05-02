"use client";

import { useStore } from "./cartStore";

type Props = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({ id, name, price, image }: Props) {
  const addToCart = useStore((state) => state.addToCart);

  return (
    <div className="border rounded-lg p-4">
      
      {image.includes("video") ? (
  <video src={image} className="w-full h-40 object-cover" controls />
) : (
  <img src={image} className="w-full h-40 object-cover" />
)}

      <h2 className="font-bold">{name}</h2>
      <p>GHS {price}</p>

      <button
        onClick={() => addToCart({ id, name, price, image })}
        className="bg-blue-600 text-white px-4 py-2 mt-2"
      >
        Add to Cart
      </button>

    </div>
  );
}