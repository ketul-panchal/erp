import express from "express";
import { getTodaySales } from "../controllers/sales.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = express.Router();

// Get today's sales summary
router.get("/today", authenticateJWT, getTodaySales);

export default router;
