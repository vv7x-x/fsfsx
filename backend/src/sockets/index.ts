import { Server as SocketIOServer, Socket } from "socket.io";
import pool from "../config/database";
import { SocketUser, Message } from "../types";

export const initializeSocket = (io: SocketIOServer) => {
  // Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));
    next();
  });

  // Connection
  io.on("connection", async (socket: Socket) => {
    const user = socket.user as SocketUser | undefined;

    if (!user) {
      socket.disconnect();
      return;
    }

    console.log(`✅ User connected: ${user.username}`);

    // Chat
    socket.on("join_chat", () => {
      socket.join("global_chat");
    });

    socket.on("send_message", async (data: { content: string }) => {
      try {
        const result = await pool.query(
          "INSERT INTO messages (user_id, content) VALUES ($1, $2) RETURNING *",
          [user.id, data.content]
        );

        const message: Message = {
          ...result.rows[0],
          username: user.username,
        };

        io.to("global_chat").emit("message_sent", message);
      } catch (err) {
        console.error("Message Error:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Graffiti
    socket.on("join_graffiti", () => {
      socket.join("graffiti_room");
    });

    socket.on("draw", (data: any) => {
      socket.to("graffiti_room").emit("draw", data);
    });

    socket.on("clear_graffiti", () => {
      socket.to("graffiti_room").emit("clear_graffiti");
    });

    // Typing indicator
    socket.on("typing", () => {
      socket.broadcast.to("global_chat").emit("user_typing", { username: user.username });
    });

    socket.on("stop_typing", () => {
      socket.broadcast.to("global_chat").emit("user_stopped_typing", { username: user.username });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${user.username}`);
      socket.broadcast.emit("user_disconnected", { username: user.username });
    });

    // Error handling
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });
};
