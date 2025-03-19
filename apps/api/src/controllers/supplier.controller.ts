import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { supplierSchema } from "../validators/supplier.validator";

const prisma = new PrismaClient();

export const getSuppliers = async (req: Request, res: Response) => {
    try {
        const suppliers = await prisma.supplier.findMany();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch suppliers" });
    }
};

export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const supplier = await prisma.supplier.findUnique({ where: { id } });
        if (!supplier) {
            res.status(404).json({ error: "Supplier not found" });
            return
        }
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch supplier" });
    }
};

export const createSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = supplierSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ errors: validation.error.format() });
            return
        }

        const supplier = await prisma.supplier.create({
            data: validation.data,
        });

        res.status(201).json(supplier);
    } catch (error) {
        console.error("Error creating supplier:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateSupplier = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    try {
        const supplier = await prisma.supplier.update({
            where: { id },
            data: { name, email, phone, address }
        });
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: "Failed to update supplier" });
    }
};

export const deleteSupplier = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.supplier.delete({ where: { id } });
        res.json({ message: "Supplier deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete supplier" });
    }
};
