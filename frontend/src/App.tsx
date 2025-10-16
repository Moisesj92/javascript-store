import { useState, useEffect } from "react";
import type { Product } from "../../shared/types/Product";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl =
          import.meta.env.VITE_API_URL || "http://localhost:3000/api";

        const response = await fetch(`${apiUrl}/products`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();
        setProducts(data);
      } catch {
        setError("Error al cargar los productos");
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-gray-800 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Tienda</h1>
          <p className="text-gray-600 text-sm mt-1">
            {products.length} productos disponibles
          </p>
        </div>
      </header>

      {/* Products Grid */}
      <main className="px-4 py-6">
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                    {product.name}
                  </h2>
                </div>

                <p className="text-sm text-gray-500 mb-2 capitalize">
                  {product.category_name}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
