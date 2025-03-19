import express from "express";
import {
  getInventory,
  addStock,
  deleteStock,
  getLowStockProducts,
  updateInventory,
} from "../controllers/inventory.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticateJWT, getInventory); // Fetch all inventory
router.post("/", authenticateJWT, addStock); // Add stock
router.put("/:id", authenticateJWT, updateInventory); // Update stock
router.delete("/:id", authenticateJWT, deleteStock); // Delete stock
router.get("/low-stock", authenticateJWT, getLowStockProducts); // Get low stock alerts

export default router;
