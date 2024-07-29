const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Bookmark {
    constructor(bookmarkID, userID, postID) {
        this.bookmarkID = bookmarkID;
        this.userID = userID;
        this.postID = postID;
    }

    static async createBookmark(userID, postID) {
      try {
        const connection = await sql.connect(dbConfig);
  
        // Check if the bookmark already exists
        const checkQuery = `
          SELECT BookmarkID
          FROM dbo.Bookmark
          WHERE UserID = @userID AND PostID = @postID;
        `;
  
        const checkRequest = connection.request();
        checkRequest.input("userID", sql.Int, userID);
        checkRequest.input("postID", sql.Int, postID);
  
        const checkResult = await checkRequest.query(checkQuery);
  
        if (checkResult.recordset.length > 0) {
          connection.close();
          return null; // Bookmark already exists
        }
  
        const sqlQuery = `
          INSERT INTO dbo.Bookmark (UserID, PostID)
          VALUES (@userID, @postID);
          SELECT SCOPE_IDENTITY() AS bookmarkID;
        `;
  
        const request = connection.request();
        request.input("userID", sql.Int, userID);
        request.input("postID", sql.Int, postID);
  
        const result = await request.query(sqlQuery);
  
        connection.close();
  
        return new Bookmark(
          result.recordset[0].bookmarkID,
          userID,
          postID
        );
      } catch (err) {
        throw new Error(err.message);
      }
    }

    static async deleteBookmark(bookmarkID) {
        try {
            const connection = await sql.connect(dbConfig);

            const sqlQuery = `
                DELETE FROM dbo.Bookmark WHERE BookmarkID = @bookmarkID;
            `;

            const request = connection.request();
            request.input("bookmarkID", sql.Int, bookmarkID);

            await request.query(sqlQuery);

            connection.close();

            return true; // Or you can return a success message if needed
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async searchBookmarkByContent(content) {
        try {
            const connection = await sql.connect(dbConfig);

            const sqlQuery = `
                SELECT 
                    b.BookmarkID, 
                    b.UserID, 
                    u.Username, 
                    b.PostID, 
                    p.Content 
                FROM dbo.Bookmark b 
                JOIN dbo.Post p ON b.PostID = p.PostID 
                JOIN dbo.UserAcc u ON b.UserID = u.UserID 
                WHERE p.Content LIKE @content;
            `;

            const request = connection.request();
            request.input("content", sql.VarChar, `%${content}%`);

            const result = await request.query(sqlQuery);

            connection.close();

            return result.recordset.map(row => ({
                bookmarkID: row.BookmarkID,
                userID: row.UserID,
                username: row.Username,
                postID: row.PostID,
                content: row.Content
            }));
        } catch (err) {
            throw new Error(err.message);
        }
    }

    static async getBookmarksByUserId(userID) {
      try {
          const connection = await sql.connect(dbConfig);
  
          const sqlQuery = `
              SELECT 
                  b.BookmarkID, 
                  b.UserID, 
                  b.PostID,
                  p.CreateBy
              FROM dbo.Bookmark b
              JOIN dbo.Post p ON b.PostID = p.PostID
              WHERE b.UserID = @userID;
          `;
  
          const request = connection.request();
          request.input("userID", sql.Int, userID);
  
          const result = await request.query(sqlQuery);
  
          connection.close();
  
          return result.recordset.map(row => ({
              bookmarkID: row.BookmarkID,
              userID: row.UserID,
              postID: row.PostID,
              createBy: row.CreateBy
          }));
      } catch (err) {
          throw new Error(err.message);
      }
  }
}

module.exports = Bookmark;
