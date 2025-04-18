import { createAsyncThunk } from "@reduxjs/toolkit";
import authAPI from "../../services/authAPI";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout as logoutAction,
} from "../slices/authSlice";

// Login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch }) => {
    try {
      dispatch(loginStart());
      const data = await authAPI.login(credentials);
      dispatch(loginSuccess(data));
      return data;
    } catch (error) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  }
);

// Register thunk
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { dispatch }) => {
    try {
      dispatch(registerStart());
      const data = await authAPI.register(userData);
      dispatch(registerSuccess(data));
      return data;
    } catch (error) {
      dispatch(registerFailure(error.message));
      throw error;
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await authAPI.logout();
      dispatch(logoutAction());
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logoutAction());
    }
  }
);

// Get current user thunk
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { dispatch }) => {
    try {
      dispatch(loginStart());
      const data = await authAPI.getCurrentUser();
      dispatch(loginSuccess(data));
      return data;
    } catch (error) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  }
);
