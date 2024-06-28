const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class User {
  constructor(id, username, contactNo, email, password) {
    this.id = id;
    this.username = username;
    this.contactNo = contactNo;
    this.email = email;
    this.password = password;
  }

  static async updateUser(userId, newUserData) {
    const connection = await sql.connect(dbConfig);

    let sqlQuery = `
      UPDATE dbo.UserAcc
      SET
        Username = @username,
        UserContactNo = @contactNo,
        Useremail = @email
    `;

    // Check if the password needs to be updated
    if (newUserData.password) {
      const hashedPassword = await bcrypt.hash(newUserData.password, 10);
      sqlQuery += `, UserPass = @password`;
    }

    sqlQuery += ` WHERE UserID = @userId`;

    const request = connection.request();
    request.input("userId", sql.Int, userId);
    request.input("username", sql.VarChar(30), newUserData.username);
    request.input("contactNo", sql.Char(8), newUserData.contactNo || null);
    request.input("email", sql.VarChar(255), newUserData.email || null);

    if (newUserData.password) {
      const hashedPassword = await bcrypt.hash(newUserData.password, 10);
      request.input("password", sql.VarChar(60), hashedPassword);
    }

    await request.query(sqlQuery);

    connection.close();
  }
  // // Method to create a new user (sign-up)
  // static async createUser(newUserData) {
  //     const connection = await sql.connect(dbConfig);

  //     // Hash the user's password
  //     const hashedPassword = await bcrypt.hash(newUserData.password, 10);

  //     // SQL query to insert the new user into the database
  //     const sqlQuery = `
  //       INSERT INTO dbo.UserAcc (Username, UserContactNo, Useremail, UserPass)
  //       VALUES (@username, @contactNo, @email, @password);
  //       SELECT SCOPE_IDENTITY() As id;
  //     `;

  //     // Create a request to execute the query
  //     const request = connection.request();
  //     // Add parameters to the query
  //     request.input("username", sql.VarChar(30), newUserData.username);
  //     request.input("contactNo", sql.Char(8), newUserData.contactNo);
  //     request.input("email", sql.VarChar(255), newUserData.email);
  //     request.input("password", sql.VarChar(60), hashedPassword);

  //     // Execute the query
  //     const result = await request.query(sqlQuery);

  //     // Close the connection
  //     connection.close();

  //     // Return a new User object with the newly created user's details
  //     return new User(result.recordset[0].id, newUserData.username, newUserData.contactNo, newUserData.email, hashedPassword);
  // }

  // // Method to login a user
  // static async login(username, password) {
  //     const connection = await sql.connect(dbConfig);
  //     const sqlQuery = SELECT * FROM dbo.UserAcc WHERE Username = @username;

  //     const request = connection.request();
  //     request.input("username", sql.VarChar(30), username);

  //     const result = await request.query(sqlQuery);

  //     connection.close();

  //     if (result.recordset.length === 0) {
  //       throw new Error('User not found');
  //     }

  //     const user = result.recordset[0];
  //     const isPasswordValid = await bcrypt.compare(password, user.UserPass);

  //     if (!isPasswordValid) {
  //       throw new Error('Invalid password');
  //     }
  // }
}

module.exports = User;
