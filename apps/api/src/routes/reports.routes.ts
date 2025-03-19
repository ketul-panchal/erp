import express from "express";
import { getSalesReport, getStockReport, getFinancialReport, getStockLevels } from "../controllers/reports.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/sales", authenticateJWT, getSalesReport);
router.get("/stock", authenticateJWT, getStockReport);
router.get("/financial", authenticateJWT, getFinancialReport);
router.get("/stock", authenticateJWT, getStockLevels);

export default router;
