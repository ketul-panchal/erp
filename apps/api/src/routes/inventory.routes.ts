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

router.get("/", authenticateJWT, getInventory); 
router.post("/", authenticateJWT, addStock); 
router.put("/:id", authenticateJWT, updateInventory); 
router.delete("/:id", authenticateJWT, deleteStock); 
router.get("/low-stock", authenticateJWT, getLowStockProducts); // Get low stock alerts

export default router;
