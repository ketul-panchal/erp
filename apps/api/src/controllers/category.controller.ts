import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fetch all categories.
 */
export async function getAllCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      include: { children: true, parent: true },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Fetch a single category by ID.
 */
export async function getCategoryById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true, parent: true,products: true },
    });

    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Create a new category.
 */
// export async function createCategory(req: Request, res: Response): Promise<void> {
//   try {
//     const { name, parentId } = req.body;

//     const existingCategory = await prisma.category.findUnique({
//       where: { name },
//     });

//     if (existingCategory) {
//       res.status(400).json({ error: "Category name already exists" });
//       return;
//     }

//     const category = await prisma.category.create({
//       data: {
//         name,
//         parent: parentId ? { connect: { id: parentId } } : undefined,
//       },
//     });

//     res.status(201).json({ message: "Category created successfully", category });
//   } catch (error) {
//     console.error("Error creating category:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

export async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    const { name, parentId, image } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        parent: parentId ? { connect: { id: parentId } } : undefined,
        image, 
      },
    });

    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


/**
 * Update an existing category.
 */
export async function updateCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, parentId,image } = req.body;

    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        parent: parentId ? { connect: { id: parentId } } : { disconnect: true },
        image, 
      },
    });

    res.status(200).json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Delete a category.
 */
export async function deleteCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    await prisma.category.delete({ where: { id } });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

