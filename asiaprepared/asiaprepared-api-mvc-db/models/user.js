const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");
const Post = require("./post"); // Make sure to require the Post model

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

  static async getUsernameById(userId) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT Username FROM UserAcc WHERE UserID = @userId`;
    const request = connection.request();
    request.input("userId", sql.Int, userId);
    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length > 0) {
      return result.recordset[0].Username;
    } else {
      throw new Error('User not found');
    }
  }

  static async getEmailByUserId(userId) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT Useremail FROM UserAcc WHERE UserID = @userId`;
    const request = connection.request();
    request.input("userId", sql.Int, userId);
    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length > 0) {
      return result.recordset[0].Useremail;
    } else {
      throw new Error('User not found');
    }
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

    if (newUserData.contactNo) {
      sqlQuery += `,
        UserContactNo = @contactNo`;
      request.input("contactNo", sql.Char(8), newUserData.contactNo);
    }

    if (newUserData.email) {
      sqlQuery += `,
        Useremail = @email`;
      request.input("email", sql.VarChar(255), newUserData.email);
    }

    if (newUserData.password) {
      const hashedPassword = await bcrypt.hash(newUserData.password, 10);
      sqlQuery += `,
        UserPass = @password`;
      request.input("password", sql.VarChar(60), hashedPassword);
    }

    sqlQuery += ` WHERE UserID = @userId`;

    try {
      await request.query(sqlQuery);

      const result = await connection
        .request()
        .input("userId", sql.Int, userId)
        .query(`SELECT * FROM UserAcc WHERE UserID = @userId`);

      connection.close();

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
      throw error;
    }
  }

  static async deleteUser(userId) {
    try {
      const connection = await sql.connect(dbConfig);

      // Delete associated comments
      const deleteCommentsQuery = `
        DELETE FROM dbo.Comment WHERE UserID = @userId;
      `;
      await connection.request().input("userId", sql.Int, userId).query(deleteCommentsQuery);

      // Delete associated bookmarks
      const deleteBookmarksQuery = `
        DELETE FROM dbo.Bookmark WHERE UserID = @userId;
      `;
      await connection.request().input("userId", sql.Int, userId).query(deleteBookmarksQuery);

      // Delete associated ticket replies
      const deleteTicketRepliesQuery = `
        DELETE FROM dbo.TicketReply WHERE TicketID IN (SELECT TicketID FROM dbo.Ticket WHERE UserID = @userId);
      `;
      await connection.request().input("userId", sql.Int, userId).query(deleteTicketRepliesQuery);

      // Delete associated tickets
      const deleteTicketsQuery = `
        DELETE FROM dbo.Ticket WHERE UserID = @userId;
      `;
      await connection.request().input("userId", sql.Int, userId).query(deleteTicketsQuery);

      // Delete associated posts and related bookmarks
      const getPostsQuery = `
        SELECT PostID FROM dbo.Post WHERE CreateBy = @userId;
      `;

      
      // Delete associated votes
      const deleteVotesQuery = `
        DELETE FROM dbo.Vote WHERE UserID = @userId;
      `;
      await connection.request().input("userId", sql.Int, userId).query(deleteVotesQuery);      

      const postsResult = await connection.request().input("userId", sql.Int, userId).query(getPostsQuery);
      const posts = postsResult.recordset;

      for (const post of posts) {
        await Post.deletePost(post.PostID);
      }

      // Finally, delete the user
      const deleteUserQuery = `
        DELETE FROM dbo.UserAcc WHERE UserID = @userId;
      `;
      await connection.request().input("userId", sql.Int, userId).query(deleteUserQuery);

      connection.close();
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = User;
