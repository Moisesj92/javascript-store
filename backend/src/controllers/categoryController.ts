import type { Request, Response } from "express";
import pool from "../config/database.js";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "shared/types/Category.js";

// GET /categories - Obtener todas las categorías
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM categories 
      ORDER BY name ASC
    `);

    res.json({
      success: true,
      data: result.rows as Category[],
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
    });
  }
};

// GET /categories/:id - Obtener una categoría por ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0] as Category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching category",
    });
  }
};

// POST /categories - Crear una nueva categoría
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name }: CreateCategoryRequest = req.body;

    // Validar que el nombre esté presente
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
      [name.trim()]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0] as Category,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Error creating category",
    });
  }
};

// PUT /categories/:id - Actualizar una categoría
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name }: UpdateCategoryRequest = req.body;

    // Validar que el nombre esté presente
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const result = await pool.query(
      `UPDATE categories SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [name.trim(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0] as Category,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Error updating category",
    });
  }
};

// DELETE /categories/:id - Eliminar una categoría
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar si la categoría tiene productos asociados
    const productCheck = await pool.query(
      "SELECT COUNT(*) FROM products WHERE category_id = $1",
      [id]
    );

    const productCount = parseInt(productCheck.rows[0].count);
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with associated products",
      });
    }

    // Eliminar la categoría
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting category",
    });
  }
};
