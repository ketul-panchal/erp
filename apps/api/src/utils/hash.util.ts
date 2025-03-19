import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hashes a password using bcrypt with salt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plain password with a hashed password.
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
