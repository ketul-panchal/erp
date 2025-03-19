import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Get all warehouses
export const getWarehouses = async (req: Request, res: Response): Promise<void> => {
  try {
    const warehouses = await prisma.warehouse.findMany();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching warehouses" });
  }
};

// ✅ Get a single warehouse
export const getWarehouse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const warehouse = await prisma.warehouse.findUnique({ where: { id } });

    if (!warehouse) {
      res.status(404).json({ message: "Warehouse not found" });
      return;
    }

    res.json(warehouse);
  } catch (error) {
    res.status(500).json({ message: "Error fetching warehouse" });
  }
};

// ✅ Create a new warehouse
export const createWarehouse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, location } = req.body;

    const existingWarehouse = await prisma.warehouse.findUnique({ where: { name } });
    if (existingWarehouse) {
      res.status(400).json({ message: "Warehouse name must be unique" });
      return;
    }

    const newWarehouse = await prisma.warehouse.create({
      data: { name, location },
    });

    res.status(201).json(newWarehouse);
  } catch (error) {
    res.status(500).json({ message: "Error creating warehouse" });
  }
};

// ✅ Update a warehouse
export const updateWarehouse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    const updatedWarehouse = await prisma.warehouse.update({
      where: { id },
      data: { name, location },
    });

    res.json(updatedWarehouse);
  } catch (error) {
    res.status(500).json({ message: "Error updating warehouse" });
  }
};

// ✅ Delete a warehouse
export const deleteWarehouse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.warehouse.delete({ where: { id } });
    res.json({ message: "Warehouse deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting warehouse" });
  }
};
