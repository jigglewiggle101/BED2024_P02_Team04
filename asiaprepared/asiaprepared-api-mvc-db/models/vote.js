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

      // Check if the user has already voted on this post
      const checkVoteQuery = `
        SELECT VoteID, VoteType FROM dbo.Vote WHERE PostID = @postID AND UserID = @userID;
      `;
      let request = connection.request();
      request.input("postID", sql.Int, newVoteData.postID);
      request.input("userID", sql.Int, newVoteData.userID);
      const checkResult = await request.query(checkVoteQuery);

      if (checkResult.recordset.length > 0) {
        // User has already voted, update the existing vote
        const existingVote = checkResult.recordset[0];
        if (existingVote.VoteType === newVoteData.voteType) {
          throw new Error('You have already voted on this post');
        } else {
          // Update the existing vote
          const updateVoteQuery = `
            UPDATE dbo.Vote SET VoteType = @voteType WHERE VoteID = @voteID;
          `;
          request = connection.request();
          request.input("voteID", sql.Int, existingVote.VoteID);
          request.input("voteType", sql.Char(1), newVoteData.voteType);
          await request.query(updateVoteQuery);

          // Update vote count in Post table
          const updateVoteCountQuery = `
            UPDATE dbo.Post
            SET VoteCount = VoteCount + CASE WHEN @voteType = 'U' THEN 2 ELSE -2 END
            WHERE PostID = @postID;
          `;
          request = connection.request();
          request.input("postID", sql.Int, newVoteData.postID);
          request.input("voteType", sql.Char(1), newVoteData.voteType);
          await request.query(updateVoteCountQuery);

          connection.close();

          return new Vote(
            existingVote.VoteID,
            newVoteData.postID,
            newVoteData.userID,
            newVoteData.voteType
          );
        }
      } else {
        // Insert new vote
        const insertVoteQuery = `
          INSERT INTO dbo.Vote (PostID, UserID, VoteType)
          VALUES (@postID, @userID, @voteType);
          SELECT SCOPE_IDENTITY() AS voteID;
        `;
        request = connection.request();
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
        request = connection.request();
        request.input("postID", sql.Int, newVoteData.postID);
        request.input("voteType", sql.Char(1), newVoteData.voteType);
        await request.query(updateVoteCountQuery);

        connection.close();

        return new Vote(
          result.recordset[0].voteID,
          newVoteData.postID,
          newVoteData.userID,
          newVoteData.voteType
        );
      }
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
      const voteTypeRequest = connection.request();
      voteTypeRequest.input("postID", sql.Int, vote.PostID);
      voteTypeRequest.input("voteType", sql.Char(1), vote.VoteType);
      await voteTypeRequest.query(updateVoteCountQuery);

      connection.close();

      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = Vote;
