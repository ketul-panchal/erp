import { Request, Response } from "express";
import { PaymentMethod, PrismaClient } from "@prisma/client";
import { emitSalesUpdate } from "./sales.controller";
import { emitInventoryUpdate } from "./inventory.controller";

const prisma = new PrismaClient();

const generateOrderNumber = () => {
  return `ORD-${Date.now()}`;
};


// export const createOrder = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { customerId, items, totalAmount, status } = req.body;

//     if (!customerId || !items || items.length === 0) {
//       res.status(400).json({ message: "Customer and items are required" });
//       return;
//     }

//     // Check if customer exists
//     const customerExists = await prisma.customer.findUnique({ where: { id: customerId } });
//     if (!customerExists) {
//       res.status(400).json({ message: "Invalid customerId: Customer does not exist." });
//       return;
//     }

//     // Create Order
//     const order = await prisma.order.create({
//       data: {
//         orderNumber: generateOrderNumber(), // Generate unique order number
//         customerId,
//         totalAmount,
//         status,
//         items: {
//           create: items.map((item: any) => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             price: item.price,
//             total: item.quantity * item.price,
//           })),
//         },
//       },
//       include: { items: true, customer: true },
//     });

//     res.status(201).json(order);
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const createOrder = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { customerId, items, status } = req.body;

//     if (!customerId || !items || items.length === 0) {
//       res.status(400).json({ message: "Customer and items are required" });
//       return;
//     }

//     // Check if customer exists
//     const customerExists = await prisma.customer.findUnique({
//       where: { id: customerId },
//     });
//     if (!customerExists) {
//       res.status(400).json({ message: "Invalid customerId." });
//       return;
//     }

   
//     const totalAmount = items.reduce(
//       (sum: number, item: any) => sum + item.quantity * item.price,
//       0
//     );

   
//     const order = await prisma.order.create({
//       data: {
//         orderNumber: generateOrderNumber(),
//         customerId,
//         totalAmount, 
//         status,
//         items: {
//           create: items.map((item: any) => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             price: item.price,
//             total: item.quantity * item.price,
//           })),
//         },
//       },
//       include: {
//         items: true,
//         customer: true,
//       },
//     });
    

//     await emitSalesUpdate();

//     res.status(201).json(order);
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// ✅ Create a POS Order with Stock Management
export const createOrder = async (req: Request, res: Response): Promise<void> => {
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

    // Start transaction
    const order = await prisma.$transaction(async (tx) => {
      // ✅ Create Order
      const createdOrder = await tx.order.create({
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

      // ✅ Update Stock for each product
      for (const item of items) {
        // Check if enough stock is available
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }

        // Decrease the stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        // ✅ Record stock movement (Optional but good practice)
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: "DECREASE",
            quantity: item.quantity,
            reason: "POS Sale",
          },
        });
      }

      return createdOrder;
    });

    // 🔄 Emit sales update to frontend (socket.io)
    
    emitSalesUpdate();
    emitInventoryUpdate(); 
    res.status(201).json(order);
  } catch (error: any) {
    console.error("❌ Error creating POS order:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};



export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: { customer: true, items: { include: { product: true } } },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { customer: true, items: { include: { product: true } } },
    });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, items, totalAmount } = req.body; 

   
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const itemsToDelete = existingOrder.items.filter(
      (dbItem) => !items.some((item: any) => item.id === dbItem.id)
    );

    
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        totalAmount, 
        items: {
          deleteMany: itemsToDelete.map((item) => ({ id: item.id })),
          upsert: items.map((item: any) => ({
            where: { id: item.id || "" },
            update: {
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              total: item.quantity * item.price,
            },
            create: {
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              total: item.quantity * item.price,
            },
          })),
        },
      },
      include: { items: true },
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.order.delete({ where: { id } });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
