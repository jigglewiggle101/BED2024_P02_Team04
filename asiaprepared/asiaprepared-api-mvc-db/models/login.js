const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Login {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
    static async createUser(newUserData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Users (name, email) VALUES (@username, @email); SELECT SCOPE_IDENTITY() As id;`;

        const request = connection.request();

        request.input("username", newUserData.username);
        request.input("email", newUserData.email);
        request.input("password", newUserData.password)

        const result = await request.query(sqlQuery);

        connection.close;

    }
    static async updateUser(id, newUserData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Users SET username = @username, email = @email WHERE id = @id`; // Parameterized query

        const request = connection.request();
        request.input("id", id);
        request.input("username", newUserData.username || null); // Handle optional fields
        request.input("email", newUserData.email || null);

        await request.query(sqlQuery);

        connection.close();

        return this.getUserById(id); // returning the updated book data
    }
}

module.exports = Login;

