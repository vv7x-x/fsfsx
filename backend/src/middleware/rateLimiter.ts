import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

// General rate limiter
export const createRateLimiter = (
  windowMs: number = 15 * 60 * 1000,
  max: number = 100,
  message: string = "Too many requests from this IP"
) => {
  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Auth rate limiter (stricter)
export const authLimiter = createRateLimiter(15 * 60 * 1000, 5, "Too many login attempts");

// API rate limiter
export const apiLimiter = createRateLimiter(15 * 60 * 1000, 100, "Rate limit exceeded");
