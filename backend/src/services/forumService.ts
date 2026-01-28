import pool from "../config/database";
import { Post, Comment } from "../types";
import { ApiError } from "../utils/response";

export class ForumService {
  static async getPosts(): Promise<Post[]> {
    const result = await pool.query(`
      SELECT posts.*, users.username, users.avatar 
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      ORDER BY posts.created_at DESC
    `);
    return result.rows;
  }

  static async getPostById(postId: number): Promise<Post> {
    const result = await pool.query(
      `
      SELECT posts.*, users.username, users.avatar 
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      WHERE posts.id = $1
    `,
      [postId]
    );

    if (result.rows.length === 0) {
      throw new ApiError(404, "Post not found");
    }

    return result.rows[0];
  }

  static async createPost(userId: number, title: string, content: string, category: string): Promise<Post> {
    const result = await pool.query(
      "INSERT INTO posts (user_id, title, content, category) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, title, content, category]
    );

    return result.rows[0];
  }

  static async getComments(postId: number): Promise<Comment[]> {
    const result = await pool.query(
      `
      SELECT comments.*, users.username, users.avatar 
      FROM comments 
      JOIN users ON comments.user_id = users.id 
      WHERE comments.post_id = $1 
      ORDER BY comments.created_at ASC
    `,
      [postId]
    );

    return result.rows;
  }

  static async createComment(postId: number, userId: number, content: string): Promise<Comment> {
    const result = await pool.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      [postId, userId, content]
    );

    return result.rows[0];
  }
}
