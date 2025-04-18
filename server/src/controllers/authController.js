const jwt = require("jsonwebtoken");
const { User } = require("../models");

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res) => {
  console.log("Register request received:", {
    headers: req.headers,
    body: req.body,
  });

  try {
    const { name, email, password } = req.body;

    // Validate request body
    if (!name || !email || !password) {
      console.log("Missing required fields:", {
        name,
        email,
        password: !!password,
      });
      return res
        .status(400)
        .json({ message: "Please provide name, email and password" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    console.log("User created successfully:", user.id);

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

const login = async (req, res) => {
  console.log("Login request received:", {
    headers: req.headers,
    body: req.body,
  });

  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      console.log("Missing required fields:", { email, password: !!password });
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("User logged in successfully:", user.id);

    // Generate token
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error logging out" });
  }
};

module.exports = {
  register,
  login,
  logout,
};
