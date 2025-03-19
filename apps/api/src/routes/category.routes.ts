import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticateJWT, getAllCategories);
router.get("/:id", authenticateJWT, getCategoryById);
router.post("/", authenticateJWT, createCategory);
router.put("/:id", authenticateJWT, updateCategory);
router.delete("/:id", authenticateJWT, deleteCategory);

export default router;
