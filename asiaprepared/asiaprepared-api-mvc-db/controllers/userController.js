const User = require("../models/user");

const createUser = async (req, res) => {
  const { username, contactNo, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    // Create new user data object
    const newUser = { username, email, password };
    if (contactNo) {
      newUser.contactNo = contactNo; // Include contactNo only if it is provided
    }

    const createdUser = await User.createUser(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, contactNo, email, password } = req.body;

  // Input validation
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Create new user data object
  const newUserData = {};
  if (username) newUserData.username = username;
  if (contactNo) newUserData.contactNo = contactNo;
  if (email) newUserData.email = email;
  if (password) newUserData.password = password;

  try {
    const updatedUser = await User.updateUser(userId, newUserData);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

module.exports = {
  createUser,
  updateUser,
};
