import { products } from "../data";

export default function ProductPage() {
  const product = products[0];

  return (
    <div className="p-10">
      
      <img
        src={product.image}
        alt={product.name}
        className="w-full max-w-md mb-6"
      />

      <h1 className="text-3xl font-bold mb-2">
        {product.name}
      </h1>

      <p className="text-xl text-gray-600 mb-4">
        GHS {product.price}
      </p>

      <p className="mb-6">
        {product.description}
      </p>

      <button className="bg-blue-600 text-white px-6 py-2 rounded">
        Add to Cart
      </button>

    </div>
  );
}