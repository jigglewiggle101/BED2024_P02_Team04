require("dotenv").config(); // Make sure this is at the very top
const express = require("express");
const { poolPromise } = require("./dbConfig");
const { registerUser, login } = require("./controllers/authController");
const {
  getAllBooksController,
  updateBookAvailabilityController,
} = require("./controllers/bookController");
const { verifyJWT, authorizeRoles } = require("./middlewares/authorizeUser");

const app = express();
app.use(express.json());

app.post("/register", registerUser);
app.post("/login", login);
app.get(
  "/books",
  verifyJWT,
  authorizeRoles("member", "librarian"),
  getAllBooksController
);
app.put(
  "/books/:bookId/availability",
  verifyJWT,
  authorizeRoles("librarian"),
  updateBookAvailabilityController
);

app.listen(3000, async () => {
  try {
    const pool = await poolPromise;
    console.log("Connected to MSSQL");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
  console.log("Server running on port 3000");
});