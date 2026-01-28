import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { sendError } from "../utils/response";
import { ApiError } from "../utils/response";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      throw new ApiError(401, "No token provided");
    }

    const decoded = verifyToken(token);
    req.user = decoded.user;
    next();
  } catch (err) {
    const error = err instanceof ApiError ? err : new ApiError(401, "Authentication failed");
    return sendError(res, error);
  }
};
