import express, { Request, Response, RequestHandler } from "express";
import { register, login, getMe } from "../controllers/auth.controller";
import { validate, registerSchema, loginSchema } from "../validators/auth.validator";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// @ts-ignore
router.get("/me", authenticateJWT, getMe);

export default router;
