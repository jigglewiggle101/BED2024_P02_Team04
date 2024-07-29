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

const getEmailByUserId = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const email = await User.getEmailByUserId(userId);
    res.json({ email });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user email");
  }
};

const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, contactNo, email, password } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const newUserData = { username };
  if (contactNo) newUserData.contactNo = contactNo;
  if (email) newUserData.email = email;
  if (password) newUserData.password = password;

  try {
    const updatedUser = await User.updateUser(userId, newUserData);
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
  getEmailByUserId,
  updateUser,
  deleteUser,
};
