import { Request, Response, NextFunction } from "express";

/**
 * Middleware to authorize users based on roles.
 */
export function authorizeRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized: No user found" });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ error: "Forbidden: You do not have access" });
      return;
    }

    next(); 
  };
}
