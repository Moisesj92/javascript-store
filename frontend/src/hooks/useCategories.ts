import { useState, useEffect } from "react";
import type { Category } from "../../../shared/types/Category";
import { categoryService } from "../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar las categorías");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Omit<Category, "id">) => {
    try {
      const newCategory = await categoryService.create(categoryData);
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error("Error creating category:", err);
      throw new Error("Error al crear categoría");
    }
  };

  const updateCategory = async (
    id: number,
    categoryData: Partial<Category>
  ) => {
    try {
      const updatedCategory = await categoryService.update(id, categoryData);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? updatedCategory : c))
      );
      return updatedCategory;
    } catch (err) {
      console.error("Error updating category:", err);
      throw new Error("Error al actualizar categoría");
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await categoryService.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
      throw new Error("Error al eliminar categoría");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}
