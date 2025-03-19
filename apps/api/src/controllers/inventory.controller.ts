import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Fetch Inventory List
export const getInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await prisma.product.findMany({
      include: { warehouse: true, supplier: true },
    });

    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add Stock Entry
export const addStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, warehouseId, stock, stockAlert } = req.body;

    if (!productId || !warehouseId || stock === undefined) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { stock, stockAlert, warehouseId },
    });

    res.status(201).json(updatedProduct);
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      let { stock, stockAlert } = req.body;
  
      // ✅ Convert values to integers
      stock = parseInt(stock, 10);
      stockAlert = parseInt(stockAlert, 10);
  
      if (isNaN(stock) || isNaN(stockAlert)) {
        res.status(400).json({ message: "Stock and stock alert must be numbers" });
        return;
      }
  
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: { stock, stockAlert },
      });
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

// ✅ Delete Stock Entry
export const deleteStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    res.status(200).json({ message: "Stock entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Low Stock Alerts
export const getLowStockProducts = async (req: Request, res: Response) => {
  try {
    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lt: prisma.product.fields.stockAlert } },
      include: { warehouse: true },
    });

    res.status(200).json(lowStockProducts);
  } catch (error) {
    console.error("Error fetching low-stock products:", error);
    res.status(500).json({ message: "Server error" });
  }
};
