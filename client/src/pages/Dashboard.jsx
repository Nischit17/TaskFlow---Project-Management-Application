import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  Assignment as TaskIcon,
  Folder as ProjectIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Warning as HighPriorityIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../store/slices/taskSlice";
import { fetchProjects } from "../store/slices/projectSlice";
import { fetchUsers } from "../store/slices/userSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  const { projects, loading: projectsLoading } = useSelector(
    (state) => state.projects
  );
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.auth.user);

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    highPriorityTasks: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    userTasks: 0,
    recentTasks: [],
    recentProjects: [],
  });

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (tasks.length > 0 && projects.length > 0) {
      // Calculate task statistics
      const completedTasks = tasks.filter(
        (task) => task.status === "completed"
      ).length;
      const pendingTasks = tasks.filter(
        (task) => task.status !== "completed"
      ).length;
      const highPriorityTasks = tasks.filter(
        (task) => task.priority === "high"
      ).length;

      // Calculate project statistics
      const activeProjects = projects.filter(
        (project) => project.status === "active"
      ).length;
      const completedProjects = projects.filter(
        (project) => project.status === "completed"
      ).length;

      // Get user's tasks
      const userTasks = currentUser
        ? tasks.filter((task) => task.assignedTo === currentUser.id).length
        : 0;

      // Get recent tasks and projects
      const recentTasks = [...tasks]
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.created_at) -
            new Date(a.createdAt || a.created_at)
        )
        .slice(0, 5);

      const recentProjects = [...projects]
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.created_at) -
            new Date(a.createdAt || a.created_at)
        )
        .slice(0, 5);

      setStats({
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks,
        highPriorityTasks,
        totalProjects: projects.length,
        activeProjects,
        completedProjects,
        userTasks,
        recentTasks,
        recentProjects,
      });
    }
  }, [tasks, projects, currentUser]);

  const loading = tasksLoading || projectsLoading || usersLoading;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TaskIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.totalTasks}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CompletedIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.completedTasks}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Tasks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ProjectIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.totalProjects}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Projects
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <HighPriorityIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {stats.highPriorityTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Priority Tasks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Task and Project Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Task Status
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Completed: {stats.completedTasks} (
                {stats.totalTasks > 0
                  ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                  : 0}
                %)
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 10,
                  bgcolor: "grey.200",
                  borderRadius: 5,
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    width: `${
                      stats.totalTasks > 0
                        ? (stats.completedTasks / stats.totalTasks) * 100
                        : 0
                    }%`,
                    height: "100%",
                    bgcolor: "success.main",
                    borderRadius: 5,
                  }}
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Pending: {stats.pendingTasks} (
                {stats.totalTasks > 0
                  ? Math.round((stats.pendingTasks / stats.totalTasks) * 100)
                  : 0}
                %)
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 10,
                  bgcolor: "grey.200",
                  borderRadius: 5,
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    width: `${
                      stats.totalTasks > 0
                        ? (stats.pendingTasks / stats.totalTasks) * 100
                        : 0
                    }%`,
                    height: "100%",
                    bgcolor: "warning.main",
                    borderRadius: 5,
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Project Status
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Active: {stats.activeProjects} (
                {stats.totalProjects > 0
                  ? Math.round(
                      (stats.activeProjects / stats.totalProjects) * 100
                    )
                  : 0}
                %)
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 10,
                  bgcolor: "grey.200",
                  borderRadius: 5,
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    width: `${
                      stats.totalProjects > 0
                        ? (stats.activeProjects / stats.totalProjects) * 100
                        : 0
                    }%`,
                    height: "100%",
                    bgcolor: "info.main",
                    borderRadius: 5,
                  }}
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Completed: {stats.completedProjects} (
                {stats.totalProjects > 0
                  ? Math.round(
                      (stats.completedProjects / stats.totalProjects) * 100
                    )
                  : 0}
                %)
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 10,
                  bgcolor: "grey.200",
                  borderRadius: 5,
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    width: `${
                      stats.totalProjects > 0
                        ? (stats.completedProjects / stats.totalProjects) * 100
                        : 0
                    }%`,
                    height: "100%",
                    bgcolor: "success.main",
                    borderRadius: 5,
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Tasks and Projects */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Tasks
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.recentTasks.length > 0 ? (
              <List>
                {stats.recentTasks.map((task) => (
                  <ListItem key={task.id} divider>
                    <ListItemText
                      primary={task.title}
                      secondary={`Status: ${task.status} | Priority: ${task.priority}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent tasks
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Projects
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.recentProjects.length > 0 ? (
              <List>
                {stats.recentProjects.map((project) => (
                  <ListItem key={project.id} divider>
                    <ListItemText
                      primary={project.title}
                      secondary={`Status: ${project.status}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent projects
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
