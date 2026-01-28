import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { sendSuccess, sendError, ApiError } from "../utils/response";
import { validateRequest, registerSchema, loginSchema } from "../utils/validation";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data = validateRequest(registerSchema, req.body);
      const { user, token } = await AuthService.register(data.username, data.email, data.password);

      return sendSuccess(res, { user, token }, 201, "Registration successful");
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(400, (err as Error).message);
      return sendError(res, error, error.statusCode);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const data = validateRequest(loginSchema, req.body);
      const { user, token } = await AuthService.login(data.email, data.password);

      return sendSuccess(res, { user, token }, 200, "Login successful");
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(400, (err as Error).message);
      return sendError(res, error, error.statusCode);
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const user = await AuthService.getProfile(userId);
      return sendSuccess(res, user, 200, "Profile retrieved");
    } catch (err) {
      const error = err instanceof ApiError ? err : new ApiError(400, (err as Error).message);
      return sendError(res, error, error.statusCode);
    }
  }
}
