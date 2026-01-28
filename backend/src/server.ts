import express, { Express, Request, Response, NextFunction } from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { config } from "./config/env";
import pool from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import forumRoutes from "./routes/forumRoutes";
import { authMiddleware } from "./middleware/auth";
import { verifyToken } from "./utils/jwt";
import { SocketUser } from "./types";

const app: Express = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP",
});
app.use("/api/", limiter);

// Database Connection
app.set("db", pool);
app.set("io", io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/forum", forumRoutes);

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Socket.io Authentication & Events
io.use((socket, next) => {
  const token = socket.handshake.auth.token as string;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = verifyToken(token);
    socket.user = {
      id: decoded.user.id,
      username: "", // Will be fetched from DB
    } as SocketUser;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", async (socket) => {
  try {
    // Fetch user details
    const userRes = await pool.query("SELECT id, username FROM users WHERE id = $1", [socket.user?.id]);

    if (userRes.rows.length > 0) {
      socket.user!.username = userRes.rows[0].username;
      console.log(`👤 User connected: ${socket.user?.username} (${socket.user?.id})`);
    }

    // Chat Events
    socket.on("join_chat", () => {
      socket.join("global_chat");
      console.log(`📨 ${socket.user?.username} joined chat`);
    });

    socket.on("send_message", async (data: { content: string }) => {
      try {
        const result = await pool.query(
          "INSERT INTO messages (user_id, content) VALUES ($1, $2) RETURNING *",
          [socket.user?.id, data.content]
        );

        const message = {
          ...result.rows[0],
          username: socket.user?.username,
        };

        io.to("global_chat").emit("receive_message", message);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    // Graffiti Events
    socket.on("join_graffiti", () => {
      socket.join("graffiti_room");
    });

    socket.on("draw", (data: any) => {
      socket.to("graffiti_room").emit("draw", data);
    });

    socket.on("clear_graffiti", () => {
      socket.to("graffiti_room").emit("clear_graffiti");
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`👤 User disconnected: ${socket.user?.username}`);
    });
  } catch (err) {
    console.error("Socket connection error:", err);
  }
});

// Start Server
const PORT = config.port;

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║   🚀 FSFS Backend Server Running   ║
║   Port: ${PORT}                       
║   Environment: ${config.nodeEnv}         
║   URL: http://localhost:${PORT}        ║
╚════════════════════════════════════╝
  `);
});

export default app;
