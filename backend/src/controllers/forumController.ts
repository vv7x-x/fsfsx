import { Request, Response } from "express";
import { ForumService } from "../services/forumService";
import { sendSuccess, sendError, ApiError } from "../utils/response";
import { validateRequest, createPostSchema, createCommentSchema } from "../utils/validation";

export class ForumController {
  static async getPosts(req: Request, res: Response) {
    try {
      const posts = await ForumService.getPosts();
      return sendSuccess(res, posts, 200, "Posts retrieved successfully");
    } catch (err) {
      const error = new ApiError(500, "Failed to fetch posts");
      return sendError(res, error, 500);
    }
  }

  static async getPostById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await ForumService.getPostById(parseInt(id));
      return sendSuccess(res, post, 200, "Post retrieved successfully");
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(500, "Failed to fetch post");
      return sendError(res, error, error.statusCode);
    }
  }

  static async createPost(req: Request, res: Response) {
    try {
      const data = validateRequest(createPostSchema, req.body);
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const post = await ForumService.createPost(userId, data.title, data.content, data.category);
      return sendSuccess(res, post, 201, "Post created successfully");
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(400, (err as Error).message);
      return sendError(res, error, error.statusCode);
    }
  }

  static async getComments(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const comments = await ForumService.getComments(parseInt(id));
      return sendSuccess(res, comments, 200, "Comments retrieved successfully");
    } catch (err) {
      const error = new ApiError(500, "Failed to fetch comments");
      return sendError(res, error, 500);
    }
  }

  static async createComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = validateRequest(createCommentSchema, req.body);
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const comment = await ForumService.createComment(parseInt(id), userId, data.content);
      return sendSuccess(res, comment, 201, "Comment created successfully");
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(400, (err as Error).message);
      return sendError(res, error, error.statusCode);
    }
  }
}
