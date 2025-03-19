import express from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/authorizeRole.middleware"; // Ensure correct import
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = express.Router();

// 🟢 Get all users (Admin only)
router.get("/", authenticateJWT, authorizeRole(["ADMIN"]), getUsers);

// 🟢 Get a single user (Self or Admin)
router.get("/:id", authenticateJWT, getUser);

// 🟢 Create a new user (Admin only)
router.post("/", authenticateJWT, authorizeRole(["ADMIN"]), createUser);

// 🟢 Update a user (Self or Admin)
router.put("/:id", authenticateJWT, updateUser);

// 🟢 Delete a user (Admin only)
router.delete("/:id", authenticateJWT, authorizeRole(["ADMIN"]), deleteUser);

export default router;
