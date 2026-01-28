import axios, { AxiosInstance, AxiosError } from "axios";
import { ApiResponse, AuthResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add token to every request
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("fsfs_token");
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("fsfs_token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth Endpoints
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const res = await this.client.post("/auth/register", { username, email, password });
    return res.data.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await this.client.post("/auth/login", { email, password });
    return res.data.data;
  }

  async getProfile(): Promise<ApiResponse> {
    const res = await this.client.get("/auth/me");
    return res.data;
  }

  // Forum Endpoints
  async getPosts(): Promise<ApiResponse> {
    const res = await this.client.get("/forum/posts");
    return res.data;
  }

  async getPost(id: number): Promise<ApiResponse> {
    const res = await this.client.get(`/forum/posts/${id}`);
    return res.data;
  }

  async createPost(title: string, content: string, category: string): Promise<ApiResponse> {
    const res = await this.client.post("/forum/posts", { title, content, category });
    return res.data;
  }

  async getComments(postId: number): Promise<ApiResponse> {
    const res = await this.client.get(`/forum/posts/${postId}/comments`);
    return res.data;
  }

  async createComment(postId: number, content: string): Promise<ApiResponse> {
    const res = await this.client.post(`/forum/posts/${postId}/comments`, { content });
    return res.data;
  }
}

export const apiClient = new ApiClient();
