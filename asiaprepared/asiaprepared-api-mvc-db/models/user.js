const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class User {
  constructor(userId, username, contactNo, email, password, role) {
    this.userId = userId;
    this.username = username;
    this.contactNo = contactNo || ""; // Handle NULL contactNo
    this.email = email || ""; // Handle NULL email
    this.password = password;
    this.role = role;
  }

  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM UserAcc`;
    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();

    // Map database results to User objects
    const users = result.recordset.map(
      (row) =>
        new User(
          row.UserID,
          row.Username,
          row.UserContactNo,
          row.Useremail,
          row.UserPass,
          row.UserRole
        )
    );

    return users;
  }

  static async updateUser(userId, newUserData) {
    const connection = await sql.connect(dbConfig);

    let sqlQuery = `
      UPDATE dbo.UserAcc
      SET
        Username = @username`;

    const request = connection.request();
    request.input("userId", sql.Int, userId);
    request.input("username", sql.VarChar(30), newUserData.username);

    // Add UserContactNo to query if it exists in newUserData
    if (newUserData.contactNo) {
      sqlQuery += `,
        UserContactNo = @contactNo`;
      request.input("contactNo", sql.Char(8), newUserData.contactNo);
    }

    // Add Useremail to query if it exists in newUserData
    if (newUserData.email) {
      sqlQuery += `,
        Useremail = @email`;
      request.input("email", sql.VarChar(255), newUserData.email);
    }

    // Check if the password needs to be updated
    if (newUserData.password) {
      const hashedPassword = await bcrypt.hash(newUserData.password, 10);
      sqlQuery += `,
        UserPass = @password`;
      request.input("password", sql.VarChar(60), hashedPassword);
    }

    sqlQuery += ` WHERE UserID = @userId`;

    try {
      await request.query(sqlQuery);

      // Fetch the updated user information
      const result = await connection
        .request()
        .input("userId", sql.Int, userId)
        .query(`SELECT * FROM UserAcc WHERE UserID = @userId`);

      connection.close();

      // Map the result to a User object and return it
      const updatedUser = result.recordset.map(
        (row) =>
          new User(
            row.UserID,
            row.Username,
            row.UserContactNo,
            row.Useremail,
            row.UserPass,
            row.UserRole
          )
      )[0];

      return updatedUser;
    } catch (error) {
      connection.close();
      throw error; // Rethrow the error to be caught by the controller
    }
  }

  static async deleteUser(userId) {
    const connection = await sql.connect(dbConfig);
    try {
      const sqlQuery = `DELETE FROM dbo.UserAcc WHERE UserID = @userId`;
      const request = connection.request();
      request.input("userId", sql.Int, userId);
      await request.query(sqlQuery);
      connection.close();
      return true; // Return true to indicate successful deletion
    } catch (error) {
      connection.close();
      throw error; // Rethrow the error to be caught by the controller
    }
  }
}

module.exports = User;
