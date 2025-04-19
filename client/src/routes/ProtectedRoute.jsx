import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress, Box } from "@mui/material";
import { isTokenValid } from "../utils/authUtils";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const tokenValid = isTokenValid();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !tokenValid) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
