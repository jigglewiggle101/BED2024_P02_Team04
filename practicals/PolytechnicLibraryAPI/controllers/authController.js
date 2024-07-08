const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getUserByUsername, createUser } = require("../model/user");

async function registerUser(req, res) {
  const { username, password, role } = req.body;

  try {
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await createUser(username, hashedPassword, role);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.user_id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error during login:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

module.exports = { registerUser, login };