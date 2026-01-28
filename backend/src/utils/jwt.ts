import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { AuthPayload } from "../types";

export const generateToken = (userId: number, expiresIn = "7d"): string => {
  const payload: AuthPayload = {
    user: { id: userId },
  };
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
};

export const verifyToken = (token: string): AuthPayload => {
  try {
    return jwt.verify(token, config.jwtSecret) as AuthPayload;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
