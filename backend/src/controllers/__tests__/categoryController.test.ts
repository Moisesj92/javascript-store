import request from "supertest";
import { jest } from "@jest/globals";
import type { Application } from "express";
import express from "express";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../../../../shared/types/Category";

const mockPool = {
  query: jest.fn() as jest.MockedFunction<any>,
};

jest.unstable_mockModule("../../config/database.js", () => ({
  default: mockPool,
}));

// Importar después de hacer el mock
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = await import("../categoryController.js");

describe("Category Controller", () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Configurar rutas de prueba
    app.get("/categories", getAllCategories);
    app.get("/categories/:id", getCategoryById);
    app.post("/categories", createCategory);
    app.put("/categories/:id", updateCategory);
    app.delete("/categories/:id", deleteCategory);

    // Limpiar mocks
    jest.clearAllMocks();
  });

  describe("getAllCategories", () => {
    it("should return all categories with success response", async () => {
      // Arrange
      const mockCategories = [
        {
          id: 1,
          name: "Electronics",
          created_at: "2025-10-16T01:15:56.621Z",
          updated_at: "2025-10-16T01:15:56.621Z",
        },
        {
          id: 2,
          name: "Clothing",
          created_at: "2025-10-16T01:15:56.621Z",
          updated_at: "2025-10-16T01:15:56.621Z",
        },
      ];

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: mockCategories,
      });

      // Act
      const response = await request(app).get("/categories").expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockCategories,
      });

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM categories")
      );
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>).mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      // Act
      const response = await request(app).get("/categories").expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Error fetching categories",
      });
    });
  });

  describe("getCategoryById", () => {
    it("should return a category when found", async () => {
      // Arrange
      const mockCategory = {
        id: 1,
        name: "Electronics",
        created_at: "2025-10-16T01:15:56.621Z",
        updated_at: "2025-10-16T01:15:56.621Z",
      };

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [mockCategory],
      });

      // Act
      const response = await request(app).get("/categories/1").expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockCategory,
      });

      expect(mockPool.query).toHaveBeenCalledWith(
        "SELECT * FROM categories WHERE id = $1",
        ["1"]
      );
    });

    it("should return 404 when category not found", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [],
      });

      // Act
      const response = await request(app).get("/categories/999").expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Category not found",
      });
    });

    it("should handle invalid category ID", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>).mockRejectedValueOnce(
        new Error("Invalid input syntax")
      );

      // Act
      const response = await request(app)
        .get("/categories/invalid")
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Error fetching category",
      });
    });
  });

  describe("createCategory", () => {
    it("should create a category successfully", async () => {
      // Arrange
      const newCategoryRequest: CreateCategoryRequest = {
        name: "Books",
      };

      const mockCreatedCategory = {
        id: 3,
        name: "Books",
        created_at: "2025-10-16T01:15:56.621Z",
        updated_at: "2025-10-16T01:15:56.621Z",
      };

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [mockCreatedCategory],
      });

      // Act
      const response = await request(app)
        .post("/categories")
        .send(newCategoryRequest)
        .expect(201);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockCreatedCategory,
        message: "Category created successfully",
      });

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO categories"),
        [newCategoryRequest.name]
      );
    });

    it("should handle duplicate category name", async () => {
      // Arrange
      const duplicateCategoryRequest: CreateCategoryRequest = {
        name: "Electronics",
      };

      (mockPool.query as jest.MockedFunction<any>).mockRejectedValueOnce(
        new Error("duplicate key value violates unique constraint")
      );

      // Act
      const response = await request(app)
        .post("/categories")
        .send(duplicateCategoryRequest)
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Error creating category",
      });
    });
  });

  describe("updateCategory", () => {
    it("should update a category successfully", async () => {
      // Arrange
      const updateRequest: UpdateCategoryRequest = {
        name: "Updated Electronics",
      };

      const mockUpdatedCategory = {
        id: 1,
        name: "Updated Electronics",
        created_at: "2025-10-16T01:15:56.621Z",
        updated_at: "2025-10-16T01:15:56.621Z",
      };

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [mockUpdatedCategory],
      });

      // Act
      const response = await request(app)
        .put("/categories/1")
        .send(updateRequest)
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockUpdatedCategory,
        message: "Category updated successfully",
      });

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE categories"),
        expect.arrayContaining(["Updated Electronics", "1"])
      );
    });

    it("should return 404 when category to update not found", async () => {
      // Arrange
      const updateRequest: UpdateCategoryRequest = {
        name: "Updated Category",
      };

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [],
      });

      // Act
      const response = await request(app)
        .put("/categories/999")
        .send(updateRequest)
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Category not found",
      });
    });

    it("should return 400 when no name provided", async () => {
      // Act
      const response = await request(app)
        .put("/categories/1")
        .send({})
        .expect(400);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Category name is required",
      });
    });
  });

  describe("deleteCategory", () => {
    it("should delete a category successfully", async () => {
      // Arrange
      const mockDeletedCategory = {
        id: 1,
        name: "Electronics",
        created_at: "2025-10-16T01:15:56.621Z",
        updated_at: "2025-10-16T01:15:56.621Z",
      };

      (mockPool.query as jest.MockedFunction<any>)
        .mockResolvedValueOnce({
          rows: [{ count: "0" }],
        })
        .mockResolvedValueOnce({
          rows: [mockDeletedCategory],
        });

      // Act
      const response = await request(app).delete("/categories/1").expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        message: "Category deleted successfully",
      });

      expect(mockPool.query).toHaveBeenCalledTimes(2);
    });

    it("should return 404 when category to delete not found", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>)
        .mockResolvedValueOnce({
          rows: [{ count: "0" }],
        })
        .mockResolvedValueOnce({
          rows: [],
        });

      // Act
      const response = await request(app).delete("/categories/999").expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Category not found",
      });
    });

    it("should return 400 when category has associated products", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [{ count: "3" }],
      });

      // Act
      const response = await request(app).delete("/categories/1").expect(400);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Cannot delete category with associated products",
      });
    });

    it("should handle foreign key constraint errors", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>).mockRejectedValueOnce(
        new Error("violates foreign key constraint")
      );

      // Act
      const response = await request(app).delete("/categories/1").expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Error deleting category",
      });
    });
  });
});
