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
import { deleteProject } from "../store/slices/projectSlice";

const ProjectCard = ({ project }) => {
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
    navigate(`/projects/${project.id}/edit`);
  };

  const handleDelete = async () => {
    handleMenuClose();
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await dispatch(deleteProject(project.id)).unwrap();
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "info";
      case "on_hold":
        return "warning";
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
            {project.title}
          </Typography>
          <IconButton onClick={handleMenuOpen} size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {project.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            label={project.status}
            color={getStatusColor(project.status)}
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            Due: {new Date(project.dueDate).toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Members: {project.members?.length || 0}
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

export default ProjectCard;
