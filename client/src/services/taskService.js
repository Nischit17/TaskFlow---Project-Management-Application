import axios from "axios";
import { API_URL } from "../config";
import { getToken, isTokenValid } from "../utils/authUtils";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && isTokenValid()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, redirect to login
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

const taskService = {
  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await api.post("/tasks", taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all tasks
  getTasks: async (filters = {}) => {
    try {
      const response = await api.get("/tasks", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single task
  getTask: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get project tasks
  getProjectTasks: async (projectId, filters = {}) => {
    try {
      const response = await api.get(`/tasks/project/${projectId}`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user tasks
  getUserTasks: async (userId, filters = {}) => {
    try {
      const response = await api.get(`/tasks/user/${userId}`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default taskService;
