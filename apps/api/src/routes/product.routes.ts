import express from "express";
import { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct } from "../controllers/product.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/authorizeRole.middleware";

const router = express.Router();

router.post("/", authenticateJWT, authorizeRole(["ADMIN", "MANAGER"]), createProduct);
router.get("/", authenticateJWT, getAllProducts);
router.get("/:id", authenticateJWT, getProduct);
router.put("/:id", authenticateJWT, authorizeRole(["ADMIN", "MANAGER"]), updateProduct);
router.delete("/:id", authenticateJWT, authorizeRole(["ADMIN"]), deleteProduct);

export default router;
