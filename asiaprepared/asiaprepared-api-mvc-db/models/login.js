const sql = require("mssql");
const dbConfig = require("../dbConfig");
const poolPromise = new sql.ConnectionPool(dbConfig).connect();

class Login {
  constructor(id, username, email, password, role) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
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

  static async createUser(username, email, password, role) {
    try {
      const trimmedRole = role.trim(); // Trim the role
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("username", sql.VarChar, username)
        .input("email", sql.VarChar, email)
        .input("password", sql.VarChar, password)
        .input("role", sql.VarChar, role)
        .query(
          `INSERT INTO UserAcc (Username, Useremail, UserPass, UserRole) 
          VALUES (@username, @email, @password, @role);
          SELECT SCOPE_IDENTITY() AS id, Username, Useremail, UserPass, UserRole 
          FROM UserAcc 
          WHERE UserID = SCOPE_IDENTITY();`
        );

      const newUser = result.recordset[0];
      return new Login(newUser.id, newUser.Username, newUser.Useremail, newUser.UserPass, newUser.UserRole.trim()); // Trim role here too
    } catch (err) {
      console.error("Error during createUser:", err);
      throw new Error("Database insert failed");
    }
  }
}

module.exports = Login;
