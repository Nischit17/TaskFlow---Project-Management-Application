const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const auth = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.post("/logout", auth, logout);

module.exports = router;
