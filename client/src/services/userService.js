import api from "./api";

const userService = {
  // Get all users
  getUsers: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error.response?.data || error.message;
    }
  },

  // Get a single user
  getUser: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
