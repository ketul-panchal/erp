import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 GET Sales Report
export const getSalesReport = async (req: Request, res: Response) => {
    try {
        const sales = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            _count: { id: true },
        });

        const bestSellingProducts = await prisma.orderItem.groupBy({
            by: ["productId"],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: "desc" } },
            take: 5, // Top 5 selling products
        });

        const products = await prisma.product.findMany({
            where: { id: { in: bestSellingProducts.map((p) => p.productId) } },
        });

        res.json({
            totalSales: sales._count.id,
            totalRevenue: sales._sum.totalAmount,
            bestSellingProducts: products,
        });
    } catch (error) {
        console.error("Error generating sales report:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 📌 GET Stock Report
export const getStockReport = async (req: Request, res: Response) => {
    try {
        const lowStockProducts = await prisma.product.findMany({
            where: { stock: { lt: 10 } }, // Low stock threshold
            select: { id: true, name: true, stock: true },
        });

        const totalStock = await prisma.product.aggregate({ _sum: { stock: true } });

        res.json({
            totalStock: totalStock._sum.stock,
            lowStockProducts,
        });
    } catch (error) {
        console.error("Error generating stock report:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getFinancialReport = async (req: Request, res: Response) => {
    try {
        const financialData = await prisma.product.aggregate({
            _sum: { price: true, costPrice: true },
        });

        
        const revenue: number = Number(financialData._sum.price) || 0;
        const cost: number = Number(financialData._sum.costPrice) || 0;
        const profit: number = revenue - cost;

        res.json({
            totalRevenue: revenue,
            totalCost: cost,
            totalProfit: profit,
        });

    } catch (error) {
        console.error("Error generating financial report:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getStockLevels = async (req: Request, res: Response) => {
    try {
      const stockData = await prisma.product.findMany({
        select: {
          name: true,
          stock: true,
        },
      });
  
      res.json(stockData);
    } catch (error) {
      console.error("Error fetching stock levels:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  