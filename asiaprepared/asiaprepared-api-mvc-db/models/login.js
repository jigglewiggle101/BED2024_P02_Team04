const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Login {
  constructor(id, username, contactNo, email, password) {
    this.id = id;
    this.username = username;
    this.contactNo = contactNo || ""; // Handle NULL contactNo
    this.email = email || ""; // Handle NULL email
    this.password = password;
  }

  static async createUser(newUserData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `
      INSERT INTO UserAcc (Username, UserContactNo, Useremail, UserPass)
      VALUES (@username, @contact, @email, @password);
      SELECT SCOPE_IDENTITY() AS id, Username, UserContactNo, Useremail, UserPass
      FROM UserAcc
      WHERE UserID = SCOPE_IDENTITY();
    `;

    const request = connection.request();

    request.input("username", newUserData.username);
    request.input("password", newUserData.password);
    if (newUserData.contactNo) {
      request.input("contact", newUserData.contactNo);
    } else {
      request.input("contact", null);
    }

    if (newUserData.email) {
      request.input("email", newUserData.email);
    } else {
      request.input("email", null);
    }

    const result = await request.query(sqlQuery);

    connection.close();

    const newUser = result.recordset[0];
    return new Login(
      newUser.id,
      newUser.Username,
      newUser.UserContactNo,
      newUser.Useremail,
      newUser.UserPass
    );
  }

  static async loginUser(username, password) {
    try {
      await sql.connect(dbConfig);
      const sqlQuery = `
            SELECT UserID, Username
            FROM UserAcc
            WHERE Username = @username AND UserPass = @password;
        `;
      const request = new sql.Request();
      request.input("username", username);
      request.input("password", password);

      const result = await request.query(sqlQuery);
      sql.close();

      if (result.recordset.length > 0) {
        const user = result.recordset[0];
        return {
          success: true,
          message: "Login successful",
          user: user,
        };
      } else {
        return {
          success: false,
          message: "Invalid username or password",
        };
      }
    } catch (err) {
      console.error("Error logging in:", err.message);
      throw err;
    }
  }
}

module.exports = Login;
