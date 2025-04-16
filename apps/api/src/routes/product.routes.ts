import express from "express";
import { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct, getProductsByCategory } from "../controllers/product.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/authorizeRole.middleware";
import upload from "../middleware/upload.middleware";

const router = express.Router();

router.get("/category", authenticateJWT, getProductsByCategory); // Added route to fetch by category


router.post("/", authenticateJWT, authorizeRole(["ADMIN", "MANAGER"]), createProduct);
router.get("/", authenticateJWT, getAllProducts);
router.get("/:id", authenticateJWT, getProduct);
router.put("/:id", authenticateJWT, authorizeRole(["ADMIN", "MANAGER"]),upload.none() , updateProduct );
router.delete("/:id", authenticateJWT, authorizeRole(["ADMIN"]), deleteProduct);

export default router;
