import { authAPI } from "./api";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
} from "../store/slices/authSlice";

export const authService = {
  register: (userData) => async (dispatch) => {
    try {
      dispatch(registerStart());
      const response = await authAPI.register(userData);
      dispatch(registerSuccess(response.data));
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      dispatch(
        registerFailure(error.response?.data?.message || "Registration failed")
      );
      throw error;
    }
  },

  login: (credentials) => async (dispatch) => {
    try {
      dispatch(loginStart());
      const response = await authAPI.login(credentials);
      dispatch(loginSuccess(response.data));
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || "Login failed"));
      throw error;
    }
  },

  logout: () => async (dispatch) => {
    try {
      await authAPI.logout();
      localStorage.removeItem("token");
      dispatch(logout());
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if server logout fails
      localStorage.removeItem("token");
      dispatch(logout());
    }
  },
};
