const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Comment {
  constructor(commentID, postID, userID, content, createDate) {
    this.commentID = commentID;
    this.postID = postID;
    this.userID = userID;
    this.content = content;
    this.createDate = createDate;
  }

  static async createComment(newCommentData) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        INSERT INTO dbo.Comment (PostID, UserID, Content, CreateDate)
        VALUES (@postID, @userID, @content, @createDate);
        SELECT SCOPE_IDENTITY() AS commentID;
      `;

      const request = connection.request();
      request.input("postID", sql.Int, newCommentData.postID);
      request.input("userID", sql.Int, newCommentData.userID);
      request.input("content", sql.VarChar(255), newCommentData.content);
      request.input("createDate", sql.Date, newCommentData.createDate);

      const result = await request.query(sqlQuery);

      connection.close();

      return new Comment(
        result.recordset[0].commentID,
        newCommentData.postID,
        newCommentData.userID,
        newCommentData.content,
        newCommentData.createDate
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async updateComment(commentID, updatedCommentData) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        UPDATE dbo.Comment
        SET Content = @content
        WHERE CommentID = @commentID;
      `;

      const request = connection.request();
      request.input("commentID", sql.Int, commentID);
      request.input("content", sql.VarChar(255), updatedCommentData.content);

      await request.query(sqlQuery);

      connection.close();

      return true; // Or you can return updated data if needed
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async deleteComment(commentID) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        DELETE FROM dbo.Comment WHERE CommentID = @commentID;
      `;

      const request = connection.request();
      request.input("commentID", sql.Int, commentID);

      await request.query(sqlQuery);

      connection.close();

      return true; // Or you can return a success message if needed
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = Comment;
