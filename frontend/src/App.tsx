import { useState } from "react";
import type { Product } from "../../shared/types/Product";
import { useProducts } from "./hooks/useProducts";
import { ProductCard } from "./components/products/ProductCard";
import { ProductModal } from "./components/products/ProductModal";
import { useCategories } from "./hooks/useCategories";

function App() {
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const { categories } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await deleteProduct(id);
      } catch {
        alert("Error al eliminar producto");
      }
    }
  };

  const handleSaveProduct = async (
    productData: Omit<Product, "id" | "created_at" | "updated_at">
  ) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch {
      alert("Error al guardar producto");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Cargando productos...</div>
      </div>
    );
  }

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
      <header className="bg-white shadow-sm grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Tienda</h1>
          <p className="text-gray-600 text-sm mt-1">
            {products.length} productos disponibles
          </p>
        </div>
        <div className="justify-self-end px-4 py-6">
          <button
            onClick={handleCreateProduct}
            className="bg-blue-900 text-white p-2 rounded-lg"
          >
            Crear Nuevo Producto
          </button>
        </div>
      </header>

      {/* Products Grid */}
      <main className="px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              categories={categories}
            />
          ))}
        </div>
      </main>

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          categories={categories}
        />
      )}
    </div>
  );
}

export default App;
