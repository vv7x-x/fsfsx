import { Response } from "express";
import { ApiResponse } from "../types";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200, message = "Success"): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (res: Response, error: ApiError | Error, statusCode = 500): Response => {
  const message = error instanceof ApiError ? error.message : "Internal Server Error";
  const code = error instanceof ApiError ? error.statusCode : statusCode;

  const response: ApiResponse = {
    success: false,
    error: message,
  };

  console.error(`[ERROR] ${code}: ${message}`);
  return res.status(code).json(response);
};
