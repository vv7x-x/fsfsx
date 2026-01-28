import { z } from "zod";

// Auth Validation
export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Forum Validation
export const createPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000),
});

// Message Validation
export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

export const validateRequest = <T,>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
    throw new Error(`Validation Error: ${errors}`);
  }
  return result.data;
};
