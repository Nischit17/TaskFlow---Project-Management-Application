import axios from "axios";

const API_URL = "http://localhost:5000/api";

const authAPI = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `${API_URL}/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout error:", error);
      // Still remove token even if server request fails
      localStorage.removeItem("token");
    }
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get user data" };
    }
  },
};

export default authAPI;
