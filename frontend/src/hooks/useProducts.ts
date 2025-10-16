import { useState, useEffect } from "react";
import type { Product } from "../../../shared/types/Product";
import { productService } from "../services/productService";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los productos");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (
    productData: Omit<Product, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const newProduct = await productService.create(productData);
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      console.error("Error creating product:", err);
      throw new Error("Error al crear producto");
    }
  };

  const updateProduct = async (id: number, productData: Partial<Product>) => {
    try {
      const updatedProduct = await productService.update(id, productData);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updatedProduct : p))
      );
      return updatedProduct;
    } catch (err) {
      console.error("Error updating product:", err);
      throw new Error("Error al actualizar producto");
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      throw new Error("Error al eliminar producto");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
}
