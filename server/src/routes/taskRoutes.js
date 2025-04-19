const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Task routes
router.post("/", taskController.createTask);
router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// Project-specific task routes
router.get("/project/:projectId", taskController.getProjectTasks);

// User-specific task routes
router.get("/user/:userId", taskController.getUserTasks);

module.exports = router;
