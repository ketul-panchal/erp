import { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
        if (err || !user) return res.status(401).json({ message: "Unauthorized" });
        req.user = user;
        return next();
    })(req, res, next);
}

// export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
//     const authHeader = req.headers.authorization;
    
    
//     if (!authHeader) {
//       res.status(401).json({ error: "Unauthorized: No token provided" });
//       return;
//     }
  
//     const token = authHeader.split(" ")[1]; // Extract the token
//     try {
//       const decoded = jwt.verify(
//         token, 
//         process.env.JWT_SECRET || "fallback_secret" // Must match login secret
//       );
//       (req as any).user = decoded; 
//       next();
//     } catch (error) {
//       console.error("JWT verification failed:", error);
//       res.status(403).json({ error: "Forbidden: Invalid or expired token" });
//       return;
//     }
//   }

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1]; // Extract the token
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret" // Ensure this matches login secret
    );

    (req as any).user = decoded; // Attach user data to request
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(403).json({ error: "Forbidden: Invalid or expired token" });
    return;
  }
} 