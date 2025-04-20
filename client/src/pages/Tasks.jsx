import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  FormHelperText,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../store/slices/taskSlice";
import { fetchProjects } from "../store/slices/projectSlice";
import { fetchUsers } from "../store/slices/userSlice";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

const Tasks = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const { users } = useSelector((state) => state.users);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: null,
    priority: "medium",
    status: "todo",
    projectId: "",
    assignedTo: "",
    createdBy: "",
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "",
    projectId: "",
    assignedTo: "",
    submit: "",
  });

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = (task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      priority: task.priority,
      status: task.status,
      projectId: task.projectId,
      assignedTo: task.assignedTo || "",
      createdBy: task.createdBy || "",
    });
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      dueDate: date,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // Title validation
    if (!formData.title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    } else if (formData.title.length < 3) {
      errors.title = "Title must be at least 3 characters long";
      isValid = false;
    }

    // Description validation
    if (formData.description && formData.description.length > 500) {
      errors.description = "Description must be less than 500 characters";
      isValid = false;
    }

    // Due date validation
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      if (isNaN(dueDate.getTime())) {
        errors.dueDate = "Invalid due date";
        isValid = false;
      }
    }

    // Project validation
    if (!formData.projectId) {
      errors.projectId = "Project is required";
      isValid = false;
    }

    // Priority validation
    if (!formData.priority) {
      errors.priority = "Priority is required";
      isValid = false;
    } else if (!["low", "medium", "high"].includes(formData.priority)) {
      errors.priority = "Priority must be low, medium, or high";
      isValid = false;
    }

    // Status validation
    if (!formData.status) {
      errors.status = "Status is required";
      isValid = false;
    } else if (
      !["todo", "in_progress", "completed"].includes(formData.status)
    ) {
      errors.status = "Status must be todo, in_progress, or completed";
      isValid = false;
    }

    // Assigned To validation (only if a value is provided)
    if (formData.assignedTo && formData.assignedTo !== "") {
      if (!users.find((user) => user.id === formData.assignedTo)) {
        errors.assignedTo = "Selected user does not exist";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Create a copy of formData to modify
      const taskData = {
        ...formData,
        createdBy: currentUser.id,
      };

      // Handle unassigned case - set to null if empty string
      if (taskData.assignedTo === "") {
        taskData.assignedTo = null;
      }

      await dispatch(createTask(taskData)).unwrap();
      handleClose();
      setFormData({
        title: "",
        description: "",
        dueDate: null,
        priority: "medium",
        status: "todo",
        projectId: "",
        assignedTo: "",
        createdBy: "",
      });
      setFormErrors({});
    } catch (error) {
      console.error("Failed to create task:", error);
      setFormErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to create task",
      }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      // Create a copy of formData to modify
      const taskData = { ...formData };

      // Handle unassigned case - set to null if empty string
      if (taskData.assignedTo === "") {
        taskData.assignedTo = null;
      }

      await dispatch(
        updateTask({ taskId: currentTask.id, taskData: taskData })
      ).unwrap();
      handleEditClose();
      setFormErrors({});
    } catch (error) {
      console.error("Failed to update task:", error);
      setFormErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to update task",
      }));
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleEdit = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      handleEditOpen(task);
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority =
        !priorityFilter || task.priority === priorityFilter;
      const matchesProject = !projectFilter || task.projectId === projectFilter;
      return (
        matchesSearch && matchesStatus && matchesPriority && matchesProject
      );
    })
    .sort((a, b) => {
      // Sort by creation date (newest first)
      const dateA = new Date(a.createdAt || a.created_at || 0);
      const dateB = new Date(b.createdAt || b.created_at || 0);
      return dateA - dateB; // Ascending order (oldest first)
    });

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

  const formatStatus = (status) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          New Task
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search tasks"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={projectFilter}
                label="Project"
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <MenuItem value="">All Projects</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading tasks...
                </TableCell>
              </TableRow>
            ) : filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    {projects.find((p) => p.id === task.projectId)?.title ||
                      "N/A"}
                  </TableCell>
                  <TableCell>
                    {users.find((u) => u.id === task.assignedTo)?.name ||
                      "Unassigned"}
                  </TableCell>
                  <TableCell>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "Not set"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      color={getPriorityColor(task.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={formatStatus(task.status)}
                      color={getStatusColor(task.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(task.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {formErrors.submit && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formErrors.submit}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              error={!!formErrors.title}
              helperText={formErrors.title}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              error={!!formErrors.description}
              helperText={formErrors.description}
              sx={{ mb: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!formErrors.dueDate}
                    helperText={formErrors.dueDate}
                    sx={{ mb: 2 }}
                  />
                )}
              />
            </LocalizationProvider>
            <FormControl
              fullWidth
              error={!!formErrors.projectId}
              sx={{ mb: 2 }}
            >
              <InputLabel>Project</InputLabel>
              <Select
                name="projectId"
                value={formData.projectId}
                label="Project"
                onChange={handleInputChange}
                required
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.title}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.projectId && (
                <FormHelperText>{formErrors.projectId}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Assigned To</InputLabel>
              <Select
                name="assignedTo"
                value={formData.assignedTo}
                label="Assigned To"
                onChange={handleInputChange}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                label="Priority"
                onChange={handleInputChange}
                error={!!formErrors.priority}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
              {formErrors.priority && (
                <FormHelperText error>{formErrors.priority}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleInputChange}
                error={!!formErrors.status}
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
              {formErrors.status && (
                <FormHelperText error>{formErrors.status}</FormHelperText>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            {formErrors.submit && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formErrors.submit}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              error={!!formErrors.title}
              helperText={formErrors.title}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              error={!!formErrors.description}
              helperText={formErrors.description}
              sx={{ mb: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!formErrors.dueDate}
                    helperText={formErrors.dueDate}
                    sx={{ mb: 2 }}
                  />
                )}
              />
            </LocalizationProvider>
            <FormControl
              fullWidth
              error={!!formErrors.projectId}
              sx={{ mb: 2 }}
            >
              <InputLabel>Project</InputLabel>
              <Select
                name="projectId"
                value={formData.projectId}
                label="Project"
                onChange={handleInputChange}
                required
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.title}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.projectId && (
                <FormHelperText>{formErrors.projectId}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Assigned To</InputLabel>
              <Select
                name="assignedTo"
                value={formData.assignedTo}
                label="Assigned To"
                onChange={handleInputChange}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                label="Priority"
                onChange={handleInputChange}
                error={!!formErrors.priority}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
              {formErrors.priority && (
                <FormHelperText error>{formErrors.priority}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleInputChange}
                error={!!formErrors.status}
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
              {formErrors.status && (
                <FormHelperText error>{formErrors.status}</FormHelperText>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Tasks;
