import request from "supertest";
import { jest } from "@jest/globals";
import type { Application } from "express";
import express from "express";
import type {
  CreateProductRequest,
  UpdateProductRequest,
} from "../../../../shared/types/Product";

const mockPool = {
  query: jest.fn() as jest.MockedFunction<any>,
};

jest.unstable_mockModule("../../config/database.js", () => ({
  default: mockPool,
}));

// Importar después de hacer el mock
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = await import("../productController.js");

describe("Product Controller", () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Configurar rutas de prueba
    app.get("/products", getAllProducts);
    app.get("/products/:id", getProductById);
    app.post("/products", createProduct);
    app.put("/products/:id", updateProduct);
    app.delete("/products/:id", deleteProduct);

    // Limpiar mocks
    jest.clearAllMocks();
  });

  describe("getAllProducts", () => {
    it("should return all products with success response", async () => {
      // Arrange
      const mockProducts = [
        {
          id: 1,
          name: "Test Product 1",
          price: 99.99,
          stock: 10,
          category_id: 1,
          created_at: "2025-10-16T01:15:56.621Z",
          updated_at: "2025-10-16T01:15:56.621Z",
        },
        {
          id: 2,
          name: "Test Product 2",
          price: 49.99,
          stock: 5,
          category_id: 2,
          created_at: "2025-10-16T01:15:56.621Z",
          updated_at: "2025-10-16T01:15:56.621Z",
        },
      ];

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: mockProducts,
      });

      // Act
      const response = await request(app).get("/products").expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockProducts,
      });

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT p.*")
      );
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>).mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      // Act
      const response = await request(app).get("/products").expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Error fetching products",
      });
    });
  });

  describe("getProductById", () => {
    it("should return a product when found", async () => {
      // Arrange
      const mockProduct = {
        id: 1,
        name: "Test Product",
        price: 99.99,
        stock: 10,
        category_id: 1,
        created_at: "2025-10-16T01:15:56.621Z",
        updated_at: "2025-10-16T01:15:56.621Z",
      };

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [mockProduct],
      });

      // Act
      const response = await request(app).get("/products/1").expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockProduct,
      });

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT p.*"),
        ["1"]
      );
    });

    it("should return 404 when product not found", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [],
      });

      // Act
      const response = await request(app).get("/products/999").expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Product not found",
      });
    });

    it("should handle invalid product ID", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>).mockRejectedValueOnce(
        new Error("Invalid input syntax")
      );

      // Act
      const response = await request(app).get("/products/invalid").expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Error fetching product",
      });
    });
  });

  describe("createProduct", () => {
    it("should create a product successfully", async () => {
      // Arrange
      const newProductRequest: CreateProductRequest = {
        name: "New Product",
        price: 29.99,
        stock: 15,
        category_id: 1,
      };

      const mockCreatedProduct = {
        id: 3,
        name: "New Product",
        price: 29.99,
        stock: 15,
        category_id: 1,
        created_at: "2025-10-16T01:15:56.621Z",
        updated_at: "2025-10-16T01:15:56.621Z",
      };

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [mockCreatedProduct],
      });

      // Act
      const response = await request(app)
        .post("/products")
        .send(newProductRequest)
        .expect(201);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockCreatedProduct,
        message: "Product created successfully",
      });

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO products"),
        [
          newProductRequest.name,
          newProductRequest.price,
          newProductRequest.stock,
          newProductRequest.category_id,
        ]
      );
    });
  });

  describe("updateProduct", () => {
    it("should update a product successfully", async () => {
      // Arrange
      const updateRequest: UpdateProductRequest = {
        name: "Updated Product",
        price: 39.99,
      };

      const mockUpdatedProduct = {
        id: 1,
        name: "Updated Product",
        price: 39.99,
        stock: 10,
        category_id: 1,
        created_at: "2025-10-16T01:15:56.621Z",
        updated_at: "2025-10-16T01:15:56.621Z",
      };

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [mockUpdatedProduct],
      });

      // Act
      const response = await request(app)
        .put("/products/1")
        .send(updateRequest)
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockUpdatedProduct,
        message: "Product updated successfully",
      });

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE products"),
        expect.arrayContaining(["1"])
      );
    });

    it("should return 404 when product to update not found", async () => {
      // Arrange
      const updateRequest: UpdateProductRequest = {
        name: "Updated Product",
      };

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [],
      });

      // Act
      const response = await request(app)
        .put("/products/999")
        .send(updateRequest)
        .expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Product not found",
      });
    });

    it("should return 400 when no fields to update", async () => {
      // Act
      const response = await request(app)
        .put("/products/1")
        .send({})
        .expect(400);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "No fields to update",
      });
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product successfully", async () => {
      // Arrange
      const mockDeletedProduct = {
        id: 1,
        name: "Test Product",
        price: 99.99,
        stock: 10,
        category_id: 1,
        created_at: "2025-10-16T01:15:56.621Z",
        updated_at: "2025-10-16T01:15:56.621Z",
      };

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [mockDeletedProduct],
      });

      // Act
      const response = await request(app).delete("/products/1").expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        message: "Product deleted successfully",
      });

      expect(mockPool.query).toHaveBeenCalledWith(
        "DELETE FROM products WHERE id = $1 RETURNING *",
        ["1"]
      );
    });

    it("should return 404 when product to delete not found", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [],
      });

      // Act
      const response = await request(app).delete("/products/999").expect(404);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Product not found",
      });
    });
  });
});
