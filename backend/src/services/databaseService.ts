import pool from "../config/database";

export class DatabaseService {
  static async testConnection(): Promise<boolean> {
    try {
      const result = await pool.query("SELECT 1");
      return result.rows.length > 0;
    } catch (err) {
      console.error("Database connection test failed:", err);
      return false;
    }
  }

  static async closeConnection(): Promise<void> {
    await pool.end();
  }
}
