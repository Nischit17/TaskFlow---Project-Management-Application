import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteTask } from "../store/slices/taskSlice";

const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/tasks/${task.id}/edit`);
  };

  const handleDelete = async () => {
    handleMenuClose();
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(task.id)).unwrap();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "default";
      case "in_progress":
        return "warning";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "info";
      case "medium":
        return "warning";
      case "high":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Card sx={{ mb: 2, position: "relative" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            {task.title}
          </Typography>
          <IconButton onClick={handleMenuOpen} size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {task.description}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Chip
            label={task.status}
            color={getStatusColor(task.status)}
            size="small"
          />
          <Chip
            label={task.priority}
            color={getPriorityColor(task.priority)}
            size="small"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Project: {task.project?.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Assigned to: {task.assignee?.name || "Unassigned"}
          </Typography>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
