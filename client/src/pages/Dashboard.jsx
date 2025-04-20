import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Assignment as TaskIcon,
  CheckCircle as CompletedIcon,
  AccessTime as InProgressIcon,
  ErrorOutline as OverdueIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../store/slices/taskSlice";
import { fetchProjects } from "../store/slices/projectSlice";
import { fetchUsers } from "../store/slices/userSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const StatCard = ({ title, value, icon, trend, trendText }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 }, height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 1.5,
            }}
          >
            {icon}
          </Box>
          <Typography
            variant={isMobile ? "body2" : "body1"}
            color="text.secondary"
          >
            {title}
          </Typography>
        </Box>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="div"
          sx={{ mb: 1, fontWeight: 500 }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: trend >= 0 ? "success.main" : "error.main",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {trend > 0 ? "+" : ""}
          {trend}% {trendText}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  const { projects, loading: projectsLoading } = useSelector(
    (state) => state.projects
  );
  const { loading: usersLoading } = useSelector((state) => state.users);

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    taskDistribution: [],
    projectDistribution: [],
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
      const completedTasks = tasks.filter(
        (task) => task.status === "completed"
      ).length;
      const inProgressTasks = tasks.filter(
        (task) => task.status === "in_progress"
      ).length;
      const overdueTasks = tasks.filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate < new Date() && task.status !== "completed";
      }).length;

      const taskDistribution = [
        { name: "Completed", value: completedTasks },
        { name: "In Progress", value: inProgressTasks },
        { name: "Overdue", value: overdueTasks },
      ];

      const projectDistribution = [
        {
          name: "Active",
          value: projects.filter((project) => project.status === "active")
            .length,
        },
        {
          name: "Completed",
          value: projects.filter((project) => project.status === "completed")
            .length,
        },
      ];

      const recentTasks = [...tasks]
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.created_at) -
            new Date(a.createdAt || a.created_at)
        )
        .slice(0, 4);

      const recentProjects = [...projects]
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.created_at) -
            new Date(a.createdAt || a.created_at)
        )
        .slice(0, 4);

      setStats({
        totalTasks: tasks.length,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        taskDistribution,
        projectDistribution,
        recentTasks,
        recentProjects,
      });
    }
  }, [tasks, projects]);

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

  const CHART_COLORS = ["#3f51b5", "#f50057", "#ff9800"];

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        height: "100%",
        backgroundColor: "background.default",
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{ mb: 1, fontWeight: 500 }}
      >
        Dashboard
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: { xs: 3, md: 4 } }}
      >
        Welcome back! Here's your overview.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon={<TaskIcon sx={{ color: "primary.main" }} />}
            trend={12}
            trendText="from last week"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Completed"
            value={stats.completedTasks}
            icon={<CompletedIcon color="success" />}
            trend={8}
            trendText="from last week"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="In Progress"
            value={stats.inProgressTasks}
            icon={<InProgressIcon color="info" />}
            trend={-2}
            trendText="from last week"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Overdue"
            value={stats.overdueTasks}
            icon={<OverdueIcon color="error" />}
            trend={1}
            trendText="from last week"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              minHeight: 400,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                p: { xs: 2, md: 3 },
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Task Distribution
              </Typography>
              <Box
                sx={{
                  flexGrow: 1,
                  width: "100%",
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.taskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 40 : 60}
                      outerRadius={isMobile ? 60 : 80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.taskDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconSize={8}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              minHeight: 400,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                p: { xs: 2, md: 3 },
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Project Status
              </Typography>
              <Box
                sx={{
                  flexGrow: 1,
                  width: "100%",
                  mt: 2,
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.projectDistribution}
                    margin={{
                      top: 20,
                      right: isMobile ? 10 : 30,
                      left: isMobile ? 10 : 20,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                      tickMargin={8}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                      barSize={isMobile ? 20 : 40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Items */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              minHeight: 300,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Recent Tasks
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding sx={{ height: "100%" }}>
                {stats.recentTasks.length > 0 ? (
                  stats.recentTasks.map((task, index) => (
                    <ListItem
                      key={task.id}
                      disablePadding
                      divider={index !== stats.recentTasks.length - 1}
                      sx={{ py: 2 }}
                    >
                      <ListItemText
                        primary={task.title}
                        secondary={`Due: ${new Date(
                          task.dueDate
                        ).toLocaleDateString()}`}
                        primaryTypographyProps={{
                          variant: isMobile ? "body2" : "subtitle2",
                          fontWeight: 500,
                        }}
                        secondaryTypographyProps={{
                          variant: "body2",
                          color: "text.secondary",
                        }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem disablePadding>
                    <ListItemText
                      primary="No recent tasks"
                      sx={{ color: "text.secondary" }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              minHeight: 300,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Recent Projects
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding sx={{ height: "100%" }}>
                {stats.recentProjects.length > 0 ? (
                  stats.recentProjects.map((project, index) => (
                    <ListItem
                      key={project.id}
                      disablePadding
                      divider={index !== stats.recentProjects.length - 1}
                      sx={{ py: 2 }}
                    >
                      <ListItemText
                        primary={project.title}
                        secondary={`Status: ${project.status}`}
                        primaryTypographyProps={{
                          variant: isMobile ? "body2" : "subtitle2",
                          fontWeight: 500,
                        }}
                        secondaryTypographyProps={{
                          variant: "body2",
                          color: "text.secondary",
                        }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem disablePadding>
                    <ListItemText
                      primary="No recent projects"
                      sx={{ color: "text.secondary" }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
