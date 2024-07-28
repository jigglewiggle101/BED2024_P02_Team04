const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Login = require("../models/login");

async function registerUser(req, res) {
  const { username, email, password } = req.body;

  try {
    const existingUser = await Login.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const role = email.includes("@admin.ap") ? "admin" : "user";

    const newUser = await Login.createUser(username, email, hashedPassword, role.trim());
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await Login.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.UserPass);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.UserID,
      role: user.UserRole.trim(),
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

module.exports = { registerUser, login };
