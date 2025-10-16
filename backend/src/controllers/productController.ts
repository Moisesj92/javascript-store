import type { Request, Response } from "express";
import pool from "../config/database.js";
import type {
  Product,
  ProductRaw,
  CreateProductRequest,
  UpdateProductRequest,
} from "shared/types/Product.js";

// GET /products - Obtener todos los productos
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT p.*
      FROM products p
      ORDER BY p.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows as Product[],
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
    });
  }
};

// GET /products/:id - Obtener un producto por ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT p.* 
      FROM products p
      WHERE p.id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0] as Product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
    });
  }
};

// POST /products - Crear un nuevo producto
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, stock, category_id }: CreateProductRequest = req.body;

    const result = await pool.query(
      `
      INSERT INTO products (name, price, stock, category_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `,
      [name, price, stock, category_id]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0] as ProductRaw,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product",
    });
  }
};

// PUT /products/:id - Actualizar un producto
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: UpdateProductRequest = req.body;

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
      UPDATE products 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0] as ProductRaw,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
    });
  }
};

// DELETE /products/:id - Eliminar un producto
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
    });
  }
};
