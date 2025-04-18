import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout as logoutAction,
  clearError,
} from "../slices/authSlice";
import authAPI from "../../services/api/authAPI";

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart());
    const data = await authAPI.register(userData);
    dispatch(registerSuccess(data));
    return data;
  } catch (error) {
    dispatch(registerFailure(error.message));
    throw error;
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const data = await authAPI.login(credentials);
    dispatch(loginSuccess(data));
    return data;
  } catch (error) {
    dispatch(loginFailure(error.message));
    throw error;
  }
};

export const logout = () => async (dispatch) => {
  try {
    await authAPI.logout();
    dispatch(logoutAction());
  } catch (error) {
    console.error("Logout error:", error);
    // Still dispatch logout action even if API call fails
    dispatch(logoutAction());
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loginStart());
    const data = await authAPI.getCurrentUser();
    dispatch(loginSuccess(data));
    return data;
  } catch (error) {
    dispatch(loginFailure(error.message));
    throw error;
  }
};

export const clearAuthError = () => (dispatch) => {
  dispatch(clearError());
};
