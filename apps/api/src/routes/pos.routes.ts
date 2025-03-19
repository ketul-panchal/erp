import express from "express";
import { createPOSOrder, getPOSOrders, getPOSOrderById, updatePOSOrder } from "../controllers/pos.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = express.Router();

// Create a POS order
router.post("/orders", authenticateJWT, createPOSOrder);

// Get all POS orders
router.get("/orders", authenticateJWT, getPOSOrders);

// Get a single POS order by ID
router.get("/orders/:id", authenticateJWT, getPOSOrderById);

// Update POS order (status, payment updates)
router.put("/orders/:id", authenticateJWT, updatePOSOrder);

export default router;
