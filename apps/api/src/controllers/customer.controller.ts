import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { customerSchema } from "../validators/customer.validator";
const prisma = new PrismaClient();

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
};

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = customerSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ errors: validation.error.format() });
        return
      }
  
      const customer = await prisma.customer.create({
        data: validation.data,
      });
  
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };    

export const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: { name, email, phone, address }
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to update customer" });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.customer.delete({ where: { id } });
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
};
