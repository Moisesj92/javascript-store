import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello World!!!!!");
});

app.use("/api/products", productRoutes);

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
