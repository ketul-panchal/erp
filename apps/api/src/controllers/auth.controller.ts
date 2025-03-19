import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/**
 * Registers a new user.
 */
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
    const user = await registerUser(name, email, password, role);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
}

/**
 * Logs in a user and returns a JWT token.
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(401).json({ error: "An unknown error occurred" });
    }
  }
}


export async function getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id; // Extract from JWT
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true } // Ensure `name` is included
      });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }