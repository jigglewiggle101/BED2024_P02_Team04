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
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
};

// const createUser = async (req, res) => {
//   const { username, contactNo, email, password } = req.body;

//   // Input validation
//   if (!username || !email || !password) {
//     return res.status(400).json({ message: 'Username, email, and password are required' });
//   }

//   try {
//     // Create new user data object
//     const newUser = { username, email, password };
//     if (contactNo) {
//       newUser.contactNo = contactNo; // Include contactNo only if it is provided
//     }

//     const createdUser = await User.createUser(newUser);
//     res.status(201).json(createdUser);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error creating user', error: error.message });
//   }
// };

// Commit - Changed userControllers.js to userController.js (without the s) and also included error handling for updateUser and getAllUsers
