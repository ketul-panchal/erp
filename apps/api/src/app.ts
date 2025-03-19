import { useRouter } from 'next/navigation';
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import passport from "passport";
import dotenv from "dotenv";
import path from "path";
// Import Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import customerRoutes from './routes/customer.routes';
import supplierRoutes from './routes/supplier.routes';
import warehouseRoutes from './routes/warehouse.routes';
import uploadRoutes from './routes/upload.route';
import orderRoutes from './routes/order.route';
import reportsRoutes from './routes/reports.routes';
import inventoryRoutes from './routes/inventory.routes';
import posRoutes from './routes/pos.routes';
import salesRoutes from './routes/sales.route';
// Load environment variables
dotenv.config();

const app = express();

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});
  
redisClient.connect().catch(console.error);

const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
});

// Middleware Setup
// app.use(cors({ origin: "*", credentials: true }));

app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true 
  }));
// app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "img-src": [
            "'self'",     
            "data:",      
            "http://localhost:3000",  
            "http://localhost:5000", 
          ],
        },
      },
    })
  )

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("uploads"));
// Serve static images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);  
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/pos", posRoutes);
app.use("/api/sales", salesRoutes);
// Export app & sessionMiddleware for WebSockets
export { app, sessionMiddleware };
