import { Typography, Box } from "@mui/material";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
    </Box>
  );
};

export default Dashboard;
