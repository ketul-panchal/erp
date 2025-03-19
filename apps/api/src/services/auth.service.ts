import { PrismaClient } from "@prisma/client"; // Shared Prisma Client
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/hash.util";
import { User, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * Registers a new user with a hashed password.
 */
export async function registerUser(name: string, email: string, password: string, role: Role) {
  const hashedPassword = await hashPassword(password);

  return prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });
}

/**
 * Logs in a user and generates a JWT token.
 */
// export async function loginUser(email: string, password: string) {
//   const user = await prisma.user.findUnique({ where: { email } });

//   if (!user) throw new Error("User not found");

//   const isMatch = await comparePassword(password, user.password);
//   if (!isMatch) throw new Error("Invalid credentials");

//   const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

//   return { user, token };
// }

export async function loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");
  
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET || "fallback_secret", // Make sure this is correct
      { expiresIn: "7d" }
    );
  
    return { user, token };
  }
