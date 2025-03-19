import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let io: any = null;
export const initSalesSocket = (socketIo: any) => {
  io = socketIo;
  console.log("✅ WebSocket initialized for sales updates");
};

export const emitSalesUpdate = async () => {
  if (!io) {
    console.log("🚫 Socket.io hasn't been initialized");
    return;
  } // If Socket.io hasn't been initialized, do nothing

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Gather today's sales data from the database:
  const salesData = await prisma.order.aggregate({
    where: { createdAt: { gte: today } },
    _sum: { totalAmount: true },
    _count: { _all: true },
  });

  // 2. Build the data object to emit
  const payload = {
    totalOrders: salesData._count._all || 0,
    totalRevenue: Number(salesData._sum.totalAmount || 0),
  };

  // 3. Emit to all connected clients
  io.emit("salesUpdate", payload);
  console.log("📡 Sent real-time sales update:", payload);
};

// ✅ Fetch Today's Sales Data
export const getTodaySales = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const salesData = await prisma.order.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { totalAmount: true },
      _count: { _all: true },
    });

    res.status(200).json({
      totalOrders: salesData._count._all || 0,
      totalRevenue: Number(salesData._sum.totalAmount || 0), // Ensure it's always a number
    });
  } catch (error) {
    console.error("Error fetching today's sales:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// // ✅ Emit Real-Time Sales Update
// export const emitSalesUpdate = async () => {
//     if (!io) return;

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const salesData = await prisma.order.aggregate({
//       where: { createdAt: { gte: today } },
//       _sum: { totalAmount: true },
//       _count: { _all: true },
//     });

//     io.emit("salesUpdate", {
//       totalOrders: salesData._count._all || 0,
//       totalRevenue: Number(salesData._sum.totalAmount || 0), // Ensure number
//     });

//     console.log("📡 Sent real-time sales update");
//   };
