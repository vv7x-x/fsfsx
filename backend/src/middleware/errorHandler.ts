import { Request, Response, NextFunction } from "express";
import { sendError, ApiError } from "../utils/response";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return sendError(res, err, err.statusCode);
  }

  console.error("Unhandled Error:", err);
  return sendError(res, err, 500);
};
