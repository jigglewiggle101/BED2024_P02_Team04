const Login = require("../models/login");

const createUser = async (req, res) => {
  const newUser = req.body;
  try {
    const createdUser = await Login.createUser(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
};
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const loginResult = await Login.loginUser(username, password);

    if (loginResult.success) {
      res.status(200).json({
        success: true,
        message: loginResult.message,
        user: loginResult.user,
      });
    } else {
      res.status(401).json({
        success: false,
        message: loginResult.message,
      });
    }
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createUser,
  login,
};
