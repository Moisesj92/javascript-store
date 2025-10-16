import request from "supertest";
import { jest } from "@jest/globals";
import type { Application } from "express";
import express from "express";

const mockPool = {
  query: jest.fn() as jest.MockedFunction<any>,
};

jest.unstable_mockModule("../../config/database.js", () => ({
  default: mockPool,
}));

// Importar después de hacer el mock
const categoryRoutes = await import("../categoryRoutes.js");

describe("Category Routes", () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/categories", categoryRoutes.default);

    // Limpiar mocks
    jest.clearAllMocks();
  });

  describe("GET /api/categories", () => {
    it("should return all categories", async () => {
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

      // Act & Assert
      const response = await request(app)
        .get("/api/categories")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        success: true,
        data: mockCategories,
      });
    });
  });

  describe("GET /api/categories/:id", () => {
    it("should return a specific category", async () => {
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

      // Act & Assert
      const response = await request(app)
        .get("/api/categories/1")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        success: true,
        data: mockCategory,
      });
    });

    it("should return 404 for non-existent category", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [],
      });

      // Act & Assert
      await request(app)
        .get("/api/categories/999")
        .expect(404)
        .expect("Content-Type", /json/);
    });
  });

  describe("POST /api/categories", () => {
    it("should create a new category", async () => {
      // Arrange
      const newCategory = { name: "Books" };
      const mockCreatedCategory = {
        id: 3,
        name: "Books",
        created_at: "2025-10-16T01:15:56.621Z",
        updated_at: "2025-10-16T01:15:56.621Z",
      };

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [mockCreatedCategory],
      });

      // Act & Assert
      const response = await request(app)
        .post("/api/categories")
        .send(newCategory)
        .expect(201)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        success: true,
        data: mockCreatedCategory,
        message: "Category created successfully",
      });
    });

    it("should validate required fields", async () => {
      // Act & Assert
      await request(app)
        .post("/api/categories")
        .send({})
        .expect(400)
        .expect("Content-Type", /json/);
    });
  });

  describe("PUT /api/categories/:id", () => {
    it("should update an existing category", async () => {
      // Arrange
      const updateData = { name: "Updated Electronics" };
      const mockUpdatedCategory = {
        id: 1,
        name: "Updated Electronics",
        created_at: "2025-10-16T01:15:56.621Z",
        updated_at: "2025-10-16T01:15:56.621Z",
      };

      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [mockUpdatedCategory],
      });

      // Act & Assert
      const response = await request(app)
        .put("/api/categories/1")
        .send(updateData)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        success: true,
        data: mockUpdatedCategory,
        message: "Category updated successfully",
      });
    });

    it("should return 404 for non-existent category", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>).mockResolvedValueOnce({
        rows: [],
      });

      // Act & Assert
      await request(app)
        .put("/api/categories/999")
        .send({ name: "Updated Category" })
        .expect(404)
        .expect("Content-Type", /json/);
    });
  });

  describe("DELETE /api/categories/:id", () => {
    it("should delete an existing category", async () => {
      // Arrange
      const mockDeletedCategory = {
        id: 1,
        name: "Electronics",
        created_at: "2025-10-16T01:15:56.621Z",
        updated_at: "2025-10-16T01:15:56.621Z",
      };

      (mockPool.query as jest.MockedFunction<any>)
        .mockResolvedValueOnce({
          rows: [{ count: "0" }], // ProductCheck primero
        })
        .mockResolvedValueOnce({
          rows: [mockDeletedCategory], // DELETE después
        });

      // Act & Assert
      const response = await request(app)
        .delete("/api/categories/1")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        success: true,
        message: "Category deleted successfully",
      });
    });

    it("should return 404 for non-existent category", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>)
        .mockResolvedValueOnce({
          rows: [{ count: "0" }],
        })
        .mockResolvedValueOnce({
          rows: [],
        });

      // Act & Assert
      await request(app)
        .delete("/api/categories/999")
        .expect(404)
        .expect("Content-Type", /json/);
    });
  });

  describe("Route parameter validation", () => {
    it("should handle invalid category ID format", async () => {
      // Arrange
      (mockPool.query as jest.MockedFunction<any>).mockRejectedValueOnce(
        new Error("Invalid input syntax")
      );

      // Act & Assert
      await request(app)
        .get("/api/categories/invalid-id")
        .expect(500)
        .expect("Content-Type", /json/);
    });
  });
});
