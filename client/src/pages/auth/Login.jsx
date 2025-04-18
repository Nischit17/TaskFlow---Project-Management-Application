import { useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { LockOutlined as LockIcon } from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (_err) {
      // Error is handled by the useAuth hook
      console.log(_err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
        <LockIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2, width: "100%" }}
          onClose={clearError}
        >
          {error}
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 1, width: "100%" }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid>
            <Link component={RouterLink} to="/auth/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Login;
