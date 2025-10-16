import { Router } from "express";
import categoryRoutes from "./categoryRoutes.js";
import productRoutes from "./productRoutes.js";

const router = Router();

router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);

export default router;
