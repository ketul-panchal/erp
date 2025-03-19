import { Request, Response } from "express";
import { PrismaClient, PaymentMethod, PaymentStatus } from "@prisma/client";
import { emitSalesUpdate } from "./sales.controller";

const prisma = new PrismaClient();

// Generate Order Number for POS
const generateOrderNumber = () => `POS-${Date.now()}`;

// ✅ Create a POS Order
// export const createPOSOrder = async (req: Request, res: Response) : Promise<void> => {
//   try {
//     const { customerId, items, totalAmount, paymentMethod } = req.body;

//     if (!items || items.length === 0) {
//       res.status(400).json({ message: "Order items are required" });
//       return;
//     }

//     // Validate Payment Method
//     if (!Object.values(PaymentMethod).includes(paymentMethod)) {
//       res.status(400).json({ message: "Invalid payment method" });
//       return;
//     }

//     const order = await prisma.order.create({
//       data: {
//         orderNumber: generateOrderNumber(),
//         customerId: customerId || null,
//         totalAmount,
//         status: "PROCESSING",
//         paymentMethod,
//         paymentStatus: "PENDING",
//         items: {
//           create: items.map((item: any) => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             price: item.price,
//             total: item.quantity * item.price,
//           })),
//         },
//       },
//       include: { items: true },
//     });

//     // ✅ Deduct stock after order placement
//     for (const item of items) {
//       await prisma.product.update({
//         where: { id: item.productId },
//         data: { stock: { decrement: item.quantity } },
//       });
//     }

//     res.status(201).json(order);
//   } catch (error) {
//     console.error("Error creating POS order:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



export const createPOSOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, items, totalAmount, paymentMethod, paymentStatus } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: "Order items are required" });
      return;
    }

    if (!Object.values(PaymentMethod).includes(paymentMethod)) {
      res.status(400).json({ message: "Invalid payment method" });
      return;
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: customerId || null, // Allow guest checkout
        totalAmount,
        status: "PROCESSING",
        paymentMethod,
        paymentStatus: paymentStatus || "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price,
          })),
        },
      },
      include: { items: true },
    });

    // ✅ Deduct stock after order placement
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    console.log("🟢 createPOSOrder() => We got the request");
    emitSalesUpdate(); // or await emitSalesUpdate() if you want to wait
    console.log("🟢 createPOSOrder() => Called emitSalesUpdate()");

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating POS order:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Get all POS Orders
export const getPOSOrders = async (req: Request, res: Response) : Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      where: { orderNumber: { startsWith: "POS-" } },
      include: { items: { include: { product: true } } },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching POS orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Order (Change Status, Payment Updates)
export const updatePOSOrder = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    // Validate Payment Status
    if (paymentStatus && !Object.values(PaymentStatus).includes(paymentStatus)) {
      res.status(400).json({ message: "Invalid payment status" });
      return;
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status, paymentStatus },
    });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Get a single POS Order by ID
export const getPOSOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: { include: { product: true } } },
      });
  
      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }
  
      res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching POS order:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  