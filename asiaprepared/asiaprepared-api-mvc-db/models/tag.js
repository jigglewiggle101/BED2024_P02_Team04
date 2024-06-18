const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Tag {
  constructor(tagID, tagName) {
    this.tagID = tagID;
    this.tagName = tagName;
  }

  static async createTag(tagName) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        INSERT INTO dbo.Tag (TagName)
        VALUES (@tagName);
        SELECT SCOPE_IDENTITY() AS tagID;
      `;

      const request = connection.request();
      request.input("tagName", sql.VarChar(50), tagName);

      const result = await request.query(sqlQuery);

      connection.close();

      return new Tag(result.recordset[0].tagID, tagName);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async deleteTag(tagID) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        DELETE FROM dbo.Tag
        WHERE TagID = @tagID;
      `;

      const request = connection.request();
      request.input("tagID", sql.Int, tagID);

      await request.query(sqlQuery);

      connection.close();

      return true; // Or you can return a success message if needed
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = Tag;
