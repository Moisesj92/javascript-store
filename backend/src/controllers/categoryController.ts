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

    const result = await pool.query(
      `
      INSERT INTO categories (name) 
      VALUES ($1, $2) 
      RETURNING *
    `,
      [name]
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
    const updates: UpdateCategoryRequest = req.body;

    // Construir query dinámicamente
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(", ");
    const query = `
      UPDATE categories 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);

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

    // Verificar si hay productos asociados a esta categoría
    const productCheck = await pool.query(
      "SELECT COUNT(*) FROM products WHERE category_id = $1",
      [id]
    );

    if (parseInt(productCheck.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with associated products",
      });
    }

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
