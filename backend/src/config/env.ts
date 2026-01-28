import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "your_secret_key",
  databaseUrl: process.env.DATABASE_URL,
  socketUrl: process.env.SOCKET_URL || "http://localhost:5000",
  corsOrigin: process.env.CORS_ORIGIN || "*",
};

// Validate required env vars
const required = ["JWT_SECRET", "DATABASE_URL"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}
