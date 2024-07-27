const sql = require("mssql");
const dbConfig = require("../dbConfig");
const poolPromise = new sql.ConnectionPool(dbConfig).connect();

class Login {
  constructor(id, username, email, password) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static async getUserByEmail(email) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query("SELECT * FROM UserAcc WHERE Useremail = @email");
      return result.recordset[0];
    } catch (err) {
      console.error("Error during getUserByEmail:", err);
      throw new Error("Database query failed");
    }
  }

  static async createUser(username, email, password) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("username", sql.VarChar, username)
        .input("email", sql.VarChar, email)
        .input("password", sql.VarChar, password)
        .query(
          `INSERT INTO UserAcc (Username, Useremail, UserPass) 
           VALUES (@username, @email, @password);
           SELECT SCOPE_IDENTITY() AS id, Username, Useremail, UserPass 
           FROM UserAcc 
           WHERE UserID = SCOPE_IDENTITY();`
        );

      const newUser = result.recordset[0];
      return new Login(newUser.id, newUser.Username, newUser.Useremail, newUser.UserPass);
    } catch (err) {
      console.error("Error during createUser:", err);
      throw new Error("Database insert failed");
    }
  }
}

module.exports = Login;
