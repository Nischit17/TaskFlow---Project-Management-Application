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

const projectService = {
  // Create a new project
  createProject: async (projectData) => {
    try {
      const response = await api.post("/projects", projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all projects
  getProjects: async (filters = {}) => {
    try {
      const response = await api.get("/projects", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single project
  getProject: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a project
  updateProject: async (projectId, projectData) => {
    try {
      const response = await api.put(`/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a project
  deleteProject: async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add members to project
  addProjectMembers: async (projectId, members) => {
    try {
      const response = await api.post(`/projects/${projectId}/members`, {
        members,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove members from project
  removeProjectMembers: async (projectId, members) => {
    try {
      const response = await api.delete(`/projects/${projectId}/members`, {
        data: { members },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default projectService;
