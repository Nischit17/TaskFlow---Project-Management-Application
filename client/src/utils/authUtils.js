import { jwtDecode } from "jwt-decode";

// Check if token is valid
export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Check if token is expired
    if (decoded.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Set token in localStorage
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem("token");
};
