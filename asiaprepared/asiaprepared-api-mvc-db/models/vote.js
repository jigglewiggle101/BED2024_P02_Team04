const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Vote {
  constructor(voteID, postID, userID, voteType) {
    this.voteID = voteID;
    this.postID = postID;
    this.userID = userID;
    this.voteType = voteType;
  }

  static async createVote(newVoteData) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        INSERT INTO dbo.Vote (PostID, UserID, VoteType)
        VALUES (@postID, @userID, @voteType);
        SELECT SCOPE_IDENTITY() AS voteID;
      `;

      const request = connection.request();
      request.input("postID", sql.Int, newVoteData.postID);
      request.input("userID", sql.Int, newVoteData.userID);
      request.input("voteType", sql.Char(1), newVoteData.voteType);

      const result = await request.query(sqlQuery);

      connection.close();

      return new Vote(
        result.recordset[0].voteID,
        newVoteData.postID,
        newVoteData.userID,
        newVoteData.voteType
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async deleteVote(voteID) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        DELETE FROM dbo.Vote WHERE VoteID = @voteID;
      `;

      const request = connection.request();
      request.input("voteID", sql.Int, voteID);

      await request.query(sqlQuery);

      connection.close();

      return true; // Or you can return a success message if needed
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = Vote;
