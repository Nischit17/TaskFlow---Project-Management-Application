import { Box, Container, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
