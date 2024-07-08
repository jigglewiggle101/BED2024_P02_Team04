const { sql, poolPromise } = require("../dbConfig");

async function getAllBooks() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Books");
    return result.recordset;
  } catch (err) {
    throw new Error("Database query failed");
  }
}

async function updateBookAvailability(bookId, availability) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("availability", sql.Char, availability)
      .input("bookId", sql.Int, bookId)
      .query(
        "UPDATE Books SET availability = @availability WHERE book_id = @bookId"
      );
    console.log("Rows affected: ${result.rowsAffected}");
  } catch (err) {
    console.error("Error updating book availability:", err.message);
    throw new Error("Database update failed");
  }
}

module.exports = {
  getAllBooks,
  updateBookAvailability,
};