import type { Category } from "../../../shared/types/Category";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data || result;
  },

  async getById(id: number): Promise<Category> {
    const response = await fetch(`${API_URL}/categories/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data || result;
  },

  async create(category: Omit<Category, "id">): Promise<Category> {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data || result;
  },

  async update(id: number, category: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data || result;
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },
};
