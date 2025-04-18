const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const sequelize = require("./config/database");
const models = require("./models");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/auth.js"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Sync database (in development, you might want to use { force: true })
    await sequelize.sync();
    console.log("Database synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
};

startServer();
