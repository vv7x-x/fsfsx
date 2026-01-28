/**
 * Frontend Type Definitions
 */

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
  username?: string;
  avatar?: string;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  username?: string;
  avatar?: string;
}

export interface Message {
  id: number;
  content: string;
  created_at: string;
  username?: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
