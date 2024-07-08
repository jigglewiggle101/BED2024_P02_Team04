const { sql, poolPromise } = require("../dbConfig");

async function getUserByUsername(username) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM Users WHERE username = @username");
    return result.recordset[0];
  } catch (err) {
    console.error("Error during getUserByUsername:", err);
    throw new Error("Database query failed");
  }
}

async function createUser(username, passwordHash, role) {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("passwordHash", sql.VarChar, passwordHash)
      .input("role", sql.VarChar, role)
      .query(
        "INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role)"
      );
  } catch (err) {
    console.error("Error during createUser:", err);
    throw new Error("Database insert failed");
  }
}

module.exports = {
  getUserByUsername,
  createUser,
};