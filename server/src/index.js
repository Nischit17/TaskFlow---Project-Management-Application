const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const sequelize = require("./config/database");
const models = require("./models");

const app = express();

// Debug middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// CORS configuration
app.use(
  cors({
    origin: true, // Allow all origins during development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Basic middleware setup
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/projects", require("./routes/projectRoutes.js"));
app.use("/api/tasks", require("./routes/taskRoutes.js"));
app.use("/api/users", require("./routes/userRoutes.js"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5001;

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Force sync database to create tables that match our models
    await sequelize.sync({ force: true });
    console.log("Database synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
};

startServer();
