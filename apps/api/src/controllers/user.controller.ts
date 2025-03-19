import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all users (Admin only)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get single user (Self or Admin)
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const requester = (req as any).user;

    if (requester.id !== userId && requester.role !== "ADMIN") {
      res.status(403).json({ error: "Forbidden: Not authorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new user (Admin only)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update user (Self or Admin)
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;
    const requester = (req as any).user;

    if (requester.id !== userId && requester.role !== "ADMIN") {
      res.status(403).json({ error: "Forbidden: Not authorized" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, role },
    });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const requester = (req as any).user;

    if (requester.role !== "ADMIN") {
      res.status(403).json({ error: "Forbidden: Not authorized" });
      return;
    }

    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
