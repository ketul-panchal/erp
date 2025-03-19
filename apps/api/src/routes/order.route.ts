import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticateJWT, async (req, res) => createOrder(req, res));
router.get("/", authenticateJWT, async (req, res) => getOrders(req, res));
router.get("/:id", authenticateJWT, async (req, res) => getOrderById(req, res));
router.put("/:id", authenticateJWT, async (req, res) => updateOrder(req, res));
router.delete("/:id", authenticateJWT, async (req, res) => deleteOrder(req, res));

export default router;
