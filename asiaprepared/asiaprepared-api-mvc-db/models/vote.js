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

      // Insert vote
      const insertVoteQuery = `
        INSERT INTO dbo.Vote (PostID, UserID, VoteType)
        VALUES (@postID, @userID, @voteType);
        SELECT SCOPE_IDENTITY() AS voteID;
      `;

      const request = connection.request();
      request.input("postID", sql.Int, newVoteData.postID);
      request.input("userID", sql.Int, newVoteData.userID);
      request.input("voteType", sql.Char(1), newVoteData.voteType);

      const result = await request.query(insertVoteQuery);

      // Update vote count in Post table
      const updateVoteCountQuery = `
        UPDATE dbo.Post
        SET VoteCount = VoteCount + CASE WHEN @voteType = 'U' THEN 1 ELSE -1 END
        WHERE PostID = @postID;
      `;
      request.input("voteType", sql.Char(1), newVoteData.voteType);
      await request.query(updateVoteCountQuery);

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

      // Get vote details before deleting
      const getVoteQuery = `
        SELECT PostID, VoteType FROM dbo.Vote WHERE VoteID = @voteID;
      `;
      const request = connection.request();
      request.input("voteID", sql.Int, voteID);
      const voteResult = await request.query(getVoteQuery);
      const vote = voteResult.recordset[0];

      // Delete vote
      const deleteVoteQuery = `
        DELETE FROM dbo.Vote WHERE VoteID = @voteID;
      `;
      await request.query(deleteVoteQuery);

      // Update vote count in Post table
      const updateVoteCountQuery = `
        UPDATE dbo.Post
        SET VoteCount = VoteCount + CASE WHEN @voteType = 'U' THEN -1 ELSE 1 END
        WHERE PostID = @postID;
      `;
      request.input("postID", sql.Int, vote.PostID);
      request.input("voteType", sql.Char(1), vote.VoteType);
      await request.query(updateVoteCountQuery);

      connection.close();

      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = Vote;
