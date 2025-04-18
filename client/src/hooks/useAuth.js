import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout as logoutAction,
  clearError,
} from "../store/slices/authSlice";
import authAPI from "../services/authAPI";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const login = async (email, password) => {
    try {
      dispatch(loginStart());
      const data = await authAPI.login({ email, password });
      dispatch(loginSuccess(data));
      return data;
    } catch (error) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  };

  const register = async (userData) => {
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

  const logout = () => {
    authAPI.logout().finally(() => {
      dispatch(logoutAction());
    });
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearError: () => dispatch(clearError()),
  };
};

export default useAuth;
