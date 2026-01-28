import pool from "../config/database";
import { Message } from "../types";

export class MessageService {
  static async getMessages(limit = 50): Promise<Message[]> {
    const result = await pool.query(
      `
      SELECT messages.*, users.username, users.avatar 
      FROM messages 
      JOIN users ON messages.user_id = users.id 
      ORDER BY messages.created_at DESC 
      LIMIT $1
    `,
      [limit]
    );

    return result.rows.reverse();
  }

  static async saveMessage(userId: number, content: string): Promise<Message> {
    const result = await pool.query(
      "INSERT INTO messages (user_id, content) VALUES ($1, $2) RETURNING *",
      [userId, content]
    );

    return result.rows[0];
  }
}
