import http from "http";
import { Server } from "socket.io";
import { app, sessionMiddleware } from "./app";
import dotenv from "dotenv";
import { initSalesSocket } from "./controllers/sales.controller";
import { initInventorySocket } from "./controllers/inventory.controller";

dotenv.config();

// Create HTTP Server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// WebSocket Setup
const io = new Server(server, {
  cors: { origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], methods: ["GET", "POST"], credentials: true},
});

// Initialize WebSocket in Sales Controller


// WebSocket Authentication Middleware
io.use((socket, next) => {
  sessionMiddleware(socket.request as any, {} as any, (err) => {
    if (err) return next(err);
    next();
  });
});

initSalesSocket(io);
initInventorySocket(io);  

// WebSocket Events
io.on("connection", (socket) => {
  console.log("🔵 New WebSocket Connection:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User Disconnected:", socket.id);
  });
});



server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
