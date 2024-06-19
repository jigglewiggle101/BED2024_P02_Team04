const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Post {
  constructor(postID, content, createBy, createDate, contentImage, tagID, voteCount) {
    this.postID = postID;
    this.content = content;
    this.createBy = createBy;
    this.createDate = createDate;
    this.contentImage = contentImage;
    this.tagID = tagID;
    this.voteCount = voteCount;
  }

  static async createPost(newPostData) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        INSERT INTO dbo.Post (Content, CreateBy, CreateDate, contentImage, TagID, VoteCount)
        VALUES (@content, @createBy, @createDate, @contentImage, @tagID, @voteCount);
        SELECT SCOPE_IDENTITY() AS postID;
      `;

      const request = connection.request();
      request.input("content", sql.VarChar(255), newPostData.content);
      request.input("createBy", sql.Int, newPostData.createBy);
      request.input("createDate", sql.Date, newPostData.createDate);
      request.input("contentImage", sql.VarBinary(sql.MAX), newPostData.contentImage || null);
      request.input("tagID", sql.Int, newPostData.tagID || null);
      request.input("voteCount", sql.Int, newPostData.voteCount || 0);

      const result = await request.query(sqlQuery);

      connection.close();

      return new Post(
        result.recordset[0].postID,
        newPostData.content,
        newPostData.createBy,
        newPostData.createDate,
        newPostData.contentImage,
        newPostData.tagID,
        newPostData.voteCount || 0
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async updatePost(postID, updatedPostData) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        UPDATE dbo.Post
        SET Content = @content,
            contentImage = @contentImage,
            TagID = @tagID
        WHERE PostID = @postID;
      `;

      const request = connection.request();
      request.input("postID", sql.Int, postID);
      request.input("content", sql.VarChar(255), updatedPostData.content);
      request.input("contentImage", sql.VarBinary(sql.MAX), updatedPostData.contentImage || null);
      request.input("tagID", sql.Int, updatedPostData.tagID || null);

      await request.query(sqlQuery);

      connection.close();

      return true; // Or you can return updated data if needed
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async deletePost(postID) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        DELETE FROM dbo.Post WHERE PostID = @postID;
      `;

      const request = connection.request();
      request.input("postID", sql.Int, postID);

      await request.query(sqlQuery);

      connection.close();

      return true; // Or you can return a success message if needed
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = Post;
