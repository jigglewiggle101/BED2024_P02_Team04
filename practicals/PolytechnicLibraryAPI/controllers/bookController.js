const { getAllBooks, updateBookAvailability } = require("../model/book");
require("dotenv").config(); // Ensure this is at the top of your file

async function getAllBooksController(req, res) {
  try {
    console.log("User info from token:", req.user); // Log user info
    const books = await getAllBooks();
    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateBookAvailabilityController(req, res) {
  const { bookId } = req.params;
  const { availability } = req.body;

  try {
    await updateBookAvailability(bookId, availability);
    res.status(200).json({ message: "Book availability updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getAllBooksController, updateBookAvailabilityController };