const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Comment {
  constructor(commentID, postID, userID, content, createDate, username) {
    this.commentID = commentID;
    this.postID = postID;
    this.userID = userID;
    this.content = content;
    this.createDate = createDate;
    this.username = username;
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
  
      const updateQuery = `
        UPDATE dbo.Comment
        SET Content = @content
        WHERE CommentID = @commentID;
      `;
  
      const selectQuery = `
        SELECT CommentID, PostID, UserID, Content, CreateDate
        FROM dbo.Comment
        WHERE CommentID = @commentID;
      `;
  
      // Update the comment
      await connection
        .request()
        .input("commentID", sql.Int, commentID)
        .input("content", sql.VarChar(255), updatedCommentData.content)
        .query(updateQuery);
  
      // Fetch the updated comment
      const result = await connection
        .request()
        .input("commentID", sql.Int, commentID)
        .query(selectQuery);
  
      connection.close();
  
      const updatedComment = result.recordset.map(
        (row) =>
          new Comment(
            row.CommentID,
            row.PostID,
            row.UserID,
            row.Content,
            row.CreateDate
          )
      )[0];
  
      return updatedComment;
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

  static async getAllComments() {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        SELECT CommentID, PostID, UserID, Content, CreateDate
        FROM dbo.Comment;
      `;

      const request = connection.request();

      const result = await request.query(sqlQuery);

      connection.close();

      return result.recordset.map(row => new Comment(row.CommentID, row.PostID, row.UserID, row.Content, row.CreateDate));
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getCommentsByPostID(postID) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        SELECT c.CommentID, c.PostID, c.UserID, c.Content, c.CreateDate, u.Username
        FROM dbo.Comment c
        JOIN dbo.UserAcc u ON c.UserID = u.UserID
        WHERE c.PostID = @postID;
      `;

      const request = connection.request();
      request.input("postID", sql.Int, postID);
      const result = await request.query(sqlQuery);

      connection.close();

      return result.recordset.map(row => new Comment(row.CommentID, row.PostID, row.UserID, row.Content, row.CreateDate, row.Username));
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = Comment;
