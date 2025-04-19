const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Project routes
router.post("/", projectController.createProject);
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

// Project member management routes
router.post("/:id/members", projectController.addProjectMembers);
router.delete("/:id/members", projectController.removeProjectMembers);

module.exports = router;
