import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const initSocket = (token: string): Socket => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("✅ Connected to server");
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
