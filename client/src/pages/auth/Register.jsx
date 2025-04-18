import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
import { PersonAdd as PersonAddIcon } from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    if (formData.password !== formData.confirmPassword) {
      // You might want to handle this error differently
      alert("Passwords do not match");
      return;
    }

    try {
      const { ...registerData } = formData;
      await register(registerData);
      navigate("/dashboard");
    } catch {
      // Error is handled by the useAuth hook
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
        <PersonAddIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign up
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
          id="name"
          label="Full Name"
          name="name"
          autoComplete="name"
          autoFocus
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
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
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid>
            <Link component={RouterLink} to="/auth/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Register;
