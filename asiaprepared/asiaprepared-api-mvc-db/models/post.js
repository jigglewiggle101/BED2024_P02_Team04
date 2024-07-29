const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Post {
  constructor(postID, content, createBy, createDate, contentImage, tagID, voteCount, username) {
    this.postID = postID;
    this.content = content;
    this.createBy = createBy;
    this.createDate = createDate;
    this.contentImage = contentImage;
    this.tagID = tagID;
    this.voteCount = voteCount;
    this.username = username;
  }

  static async getAllPosts() {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        SELECT p.PostID, p.Content, p.CreateBy, p.CreateDate, p.contentImage, p.TagID, p.VoteCount, u.Username
        FROM dbo.Post p
        JOIN dbo.UserAcc u ON p.CreateBy = u.UserID;
      `;

      const request = connection.request();
      const result = await request.query(sqlQuery);

      connection.close();

      return result.recordset.map(row => new Post(
        row.PostID,
        row.Content,
        row.CreateBy,
        row.CreateDate,
        row.contentImage,
        row.TagID,
        row.VoteCount,
        row.Username
      ));
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getPostById(postID) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        SELECT p.PostID, p.Content, p.CreateBy, p.CreateDate, p.contentImage, p.TagID, p.VoteCount, u.Username
        FROM dbo.Post p
        JOIN dbo.UserAcc u ON p.CreateBy = u.UserID
        WHERE p.PostID = @postID;
      `;

      const request = connection.request();
      request.input("postID", sql.Int, postID);
      const result = await request.query(sqlQuery);

      connection.close();

      if (result.recordset.length > 0) {
        const row = result.recordset[0];
        return new Post(
          row.PostID,
          row.Content,
          row.CreateBy,
          row.CreateDate,
          row.contentImage,
          row.TagID,
          row.VoteCount,
          row.Username
        );
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getVoteCountByPostID(postID) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        SELECT VoteCount FROM dbo.Post WHERE PostID = @postID;
      `;

      const request = connection.request();
      request.input("postID", sql.Int, postID);
      const result = await request.query(sqlQuery);

      connection.close();

      if (result.recordset.length > 0) {
        return result.recordset[0].VoteCount;
      } else {
        return 0;
      }
    } catch (err) {
      throw new Error(err.message);
    }
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

      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async deletePost(postID) {
    try {
      const connection = await sql.connect(dbConfig);

      // Delete associated votes
      const deleteVotesQuery = `
        DELETE FROM dbo.Vote WHERE PostID = @postID;
      `;
      const deleteVotesRequest = connection.request();
      deleteVotesRequest.input("postID", sql.Int, postID);
      await deleteVotesRequest.query(deleteVotesQuery);

      // Delete associated bookmarks
      const deleteBookmarksQuery = `
        DELETE FROM dbo.Bookmark WHERE PostID = @postID;
      `;
      const deleteBookmarksRequest = connection.request();
      deleteBookmarksRequest.input("postID", sql.Int, postID);
      await deleteBookmarksRequest.query(deleteBookmarksQuery);

      // Delete associated comments
      const deleteCommentsQuery = `
        DELETE FROM dbo.Comment WHERE PostID = @postID;
      `;
      const deleteCommentsRequest = connection.request();
      deleteCommentsRequest.input("postID", sql.Int, postID);
      await deleteCommentsRequest.query(deleteCommentsQuery);

      // Then delete the post itself
      const deletePostQuery = `
        DELETE FROM dbo.Post WHERE PostID = @postID;
      `;
      const deletePostRequest = connection.request();
      deletePostRequest.input("postID", sql.Int, postID);
      await deletePostRequest.query(deletePostQuery);

      connection.close();

      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = Post;
