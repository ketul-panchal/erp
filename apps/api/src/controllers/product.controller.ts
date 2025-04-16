import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
// Ensure Prisma is initialized

const prisma = new PrismaClient();

// export async function createProduct(req: Request, res: Response): Promise<void>  {
//     try {
//       const { name, description, sku, barcode, categoryId, brand, supplierId, price, costPrice, stock, stockAlert, warehouseId, images, status } = req.body;

//       if (!name || !sku || !price || !costPrice || !stock) {
//         res.status(400).json({ message: "Missing required fields." });
//         return;
//       }

//       const productExists = await prisma.product.findFirst({
//         where: { OR: [{ name }, { sku }] },
//       });

//       if (productExists) {
//         res.status(400).json({ message: "Product name or SKU already exists" });
//         return;
//       }

//       const product = await prisma.product.create({
//         data: {
//           name,
//           description,
//           sku,
//           barcode,
//           categoryId,
//           brand,
//           supplierId,
//           price: parseFloat(price),
//           costPrice: parseFloat(costPrice),
//           stock: parseInt(stock),
//           stockAlert: stockAlert ? parseInt(stockAlert) : 10,
//           warehouseId,
//           images: images ?? [],
//           status: status ?? "ACTIVE",
//         },
//       });

//       res.status(201).json({ message: "Product created successfully", product });
//     } catch (error) {
//       console.error("Error creating product:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   }


export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, sku, barcode, categoryId, brand, supplierId, price, costPrice, stock, stockAlert, warehouseId, images, status } = req.body;

    // ✅ Step 1: Check If Supplier Exists
    if (supplierId) {
      const supplierExists = await prisma.supplier.findUnique({
        where: { id: supplierId },
      });

      if (!supplierExists) {
        res.status(400).json({ message: "Invalid supplierId: Supplier does not exist." });
        return
      }
    }

    // ✅ Step 2: Check If Category Exists
    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        res.status(400).json({ message: "Invalid categoryId: Category does not exist." });
        return
      }
    }

    // ✅ Step 3: Check If Warehouse Exists
    if (warehouseId) {
      const warehouseExists = await prisma.warehouse.findUnique({
        where: { id: warehouseId },
      });

      if (!warehouseExists) {
        res.status(400).json({ message: "Invalid warehouseId: Warehouse does not exist." });
        return;
      }
    }

    // ✅ Step 4: Create Product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        sku,
        barcode,
        categoryId,
        brand,
        supplierId,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
        stock: parseInt(stock, 10),
        stockAlert: parseInt(stockAlert, 10),
        warehouseId,
        images: images || [],
        status,
      },
    });

    res.status(201).json(product);
  } catch (error: any) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



export async function getAllProducts(req: Request, res: Response) {
  try {

    const { categoryId } = req.query; // Ensure the categoryId is fetched from the query
    
    const products = await prisma.product.findMany({
      where: { categoryId: categoryId as string },
      include: { category: true, supplier: true, warehouse: true },
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }, // Example: Include category details if needed
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(product ?? []);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//   export async function updateProduct(req: Request, res: Response): Promise<void> {
//     try {
//       const { id } = req.params;
//       const product = await prisma.product.update({
//         where: { id },
//         data: req.body, // Update all fields dynamically
//       });

//       res.status(200).json({ message: "Product updated successfully", product });
//     } catch (error) {
//       console.error("Error updating product:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   }


// export async function updateProduct(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const {
//         name,
//         description,
//         sku,
//         barcode,
//         categoryId,
//         brand,
//         supplierId,
//         price,
//         costPrice,
//         stock,
//         stockAlert,
//         warehouseId,
//         images,
//         status,
//       } = req.body;

//       const product = await prisma.product.update({
//         where: { id },
//         data: {
//           name,
//           description,
//           sku,
//           barcode,
//           brand,
//           price: parseFloat(price), // Ensure numeric values
//           costPrice: parseFloat(costPrice),
//           stock: parseInt(stock),
//           stockAlert: parseInt(stockAlert),
//           images,
//           status,

//           // Handle relations correctly
//           category: categoryId ? { connect: { id: categoryId } } : undefined,
//           supplier: supplierId ? { connect: { id: supplierId } } : undefined,
//           warehouse: warehouseId ? { connect: { id: warehouseId } } : undefined,
//         },
//       });

//       res.status(200).json({ message: "Product updated successfully", product });
//     } catch (error) {
//       console.error("Error updating product:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }


export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {

    // console.log("Incoming Update Request:");
    // console.log("Params:", req.params);
    // console.log("Body:", req.body);

    const { id } = req.params;
    const {
      name,
      description,
      sku,
      barcode,
      categoryId,
      brand,
      supplierId,
      price,
      costPrice,
      stock,
      stockAlert,
      warehouseId,
      status,
    } = req.body;


    if (!name || !sku || !price || !costPrice || !stock) {
      res.status(400).json({ message: "Required fields missing", });
      return;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        sku,
        barcode,
        brand,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
        stock: parseInt(stock, 10),
        stockAlert: parseInt(stockAlert, 10) || 10,
        status,

        category: categoryId ? { connect: { id: categoryId } } : undefined,
        supplier: supplierId ? { connect: { id: supplierId } } : undefined,
        warehouse: warehouseId ? { connect: { id: warehouseId } } : undefined,
      },
    });

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error: any) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      stack: error.stack,  
    });
  }
}



export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Fetch products by category ID
export async function getProductsByCategory(req: Request, res: Response): Promise<void> {
  try {
    const { categoryId } = req.query; // Get the categoryId from query parameters

    if (!categoryId) {
      res.status(400).json({ message: "Category ID is required" });
      return;
    }

    // Fetch products that belong to the category
    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId as string, // Cast to string
      },
      include: {
        category: true,
        supplier: true,
        warehouse: true, // Include related information if necessary
      },
    });

    if (products.length === 0) {
      res.status(404).json({ message: "No products found for this category" });
      return;
    }

    res.status(200).json(products); // Return the filtered products
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}