import axios from "axios";

const API_URL = "/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    return Promise.reject({ message });
  }
);

// Auth API service
const authAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      return response;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
    }
  },

  // Get current user
  getCurrentUser: async () => {
    return api.get("/auth/me");
  },
};

export default authAPI;
