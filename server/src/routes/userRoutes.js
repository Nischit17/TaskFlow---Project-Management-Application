const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(auth);

// User routes
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);

module.exports = router;
