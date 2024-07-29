const User = require("../models/user");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving users");
  }
};

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const username = await User.getUsernameById(userId);
    res.json({ username });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user");
  }
};

const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id); // Parse userId from URL parameter
  const { username, contactNo, email, password } = req.body;

  // Input validation
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Create new user data object
  const newUserData = {
    username,
    password,
  };

  // Add optional fields if they exist in the request body
  if (contactNo) newUserData.contactNo = contactNo;
  if (email) newUserData.email = email;

  try {
    const updatedUser = await User.updateUser(userId, newUserData); // Get the updated user info
    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    await User.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
