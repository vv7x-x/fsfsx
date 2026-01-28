import bcrypt from "bcryptjs";
import pool from "../config/database";
import { User } from "../types";
import { generateToken } from "../utils/jwt";
import { ApiError } from "../utils/response";

export class AuthService {
  static async register(username: string, email: string, password: string) {
    // Check if user exists
    const userExists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

    if (userExists.rows.length > 0) {
      throw new ApiError(400, "User already exists with this email");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, avatar",
      [username, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    return { user, token };
  }

  static async login(email: string, password: string) {
    // Find user
    const result = await pool.query("SELECT id, username, email, password, avatar FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      throw new ApiError(401, "Invalid email or password");
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Remove password before returning
    delete user.password;

    const token = generateToken(user.id);

    return { user, token };
  }

  static async getProfile(userId: number): Promise<User> {
    const result = await pool.query("SELECT id, username, email, avatar, created_at, updated_at FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      throw new ApiError(404, "User not found");
    }

    return result.rows[0];
  }
}
