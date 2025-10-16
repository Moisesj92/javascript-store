import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import type { Application } from "express";

const mockPool = {
  query: jest.fn(),
};

jest.unstable_mockModule("../../config/database.js", () => ({
  default: mockPool,
}));

// Importar rutas después del mock
const productRoutes = await import("../productRoutes.js");

describe("Product Routes Integration", () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/products", productRoutes.default);
    jest.clearAllMocks();
  });

  describe("GET /api/products", () => {
    it("should return products list through complete route flow", async () => {
      // Arrange
      const mockProducts = [
        {
          id: 1,
          name: "Test Product",
          price: 99.99,
          stock: 10,
          category_id: 1,
          category_name: "Electronics",
          created_at: "2025-10-16T01:15:56.621Z",
          updated_at: "2025-10-16T01:15:56.621Z",
        },
      ];

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: mockProducts,
      });

      // Act
      const response = await request(app).get("/api/products").expect(200);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: mockProducts,
      });
    });

    it("should handle route-level errors gracefully", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>).mockRejectedValueOnce(
        new Error("Database error")
      );

      // Act
      const response = await request(app).get("/api/products").expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Error fetching products",
      });
    });
  });

  describe("POST /api/products", () => {
    it("should handle complete product creation workflow", async () => {
      // Arrange
      const newProduct = {
        name: "New Product",
        price: 29.99,
        stock: 15,
        category_id: 1,
      };

      const createdProduct = {
        id: 2,
        ...newProduct,
        created_at: "2025-10-16T01:15:56.621Z",
        updated_at: "2025-10-16T01:15:56.621Z",
      };

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [createdProduct],
      });

      // Act
      const response = await request(app)
        .post("/api/products")
        .send(newProduct)
        .expect(201);

      // Assert
      expect(response.body).toEqual({
        success: true,
        data: createdProduct,
        message: "Product created successfully",
      });

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO products"),
        [
          newProduct.name,
          newProduct.price,
          newProduct.stock,
          newProduct.category_id,
        ]
      );
    });
  });

  describe("Route parameter validation", () => {
    it("should handle invalid product ID in route", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>).mockRejectedValueOnce(
        new Error("Invalid input syntax")
      );

      // Act
      const response = await request(app)
        .get("/api/products/invalid-id")
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        success: false,
        message: "Error fetching product",
      });
    });
  });
});
