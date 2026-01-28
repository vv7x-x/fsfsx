/**
 * Global Type Definitions
 */

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthPayload {
  user: {
    id: number;
  };
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  category: string;
  created_at: Date;
  updated_at: Date;
  username?: string;
  avatar?: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  username?: string;
  avatar?: string;
}

export interface Message {
  id: number;
  user_id: number;
  content: string;
  created_at: Date;
  username?: string;
  avatar?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface JwtPayload {
  user: {
    id: number;
  };
  iat: number;
  exp: number;
}

// Socket.io Events
export interface SocketUser {
  id: number;
  username: string;
}

declare module "express" {
  interface Request {
    user?: AuthPayload["user"];
  }
}

declare module "socket.io" {
  interface Socket {
    user?: SocketUser;
  }
}
