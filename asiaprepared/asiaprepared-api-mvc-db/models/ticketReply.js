const sql = require("mssql");
const dbConfig = require("../dbConfig");

class TicketReply {
  constructor(replyID, ticketID, userID, replyContent, replyDate) {
    this.replyID = replyID;
    this.ticketID = ticketID;
    this.userID = userID;
    this.replyContent = replyContent;
    this.replyDate = replyDate;
  }

  static async createReply(ticketID, userID, replyContent) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        INSERT INTO dbo.TicketReply (TicketID, UserID, ReplyContent, ReplyDate)
        VALUES (@ticketID, @userID, @replyContent, GETDATE());
        SELECT SCOPE_IDENTITY() AS replyID;
      `;

      const request = connection.request();
      request.input("ticketID", sql.Int, ticketID);
      request.input("userID", sql.Int, userID || null);
      request.input("replyContent", sql.VarChar(sql.MAX), replyContent);

      const result = await request.query(sqlQuery);

      connection.close();

      return new TicketReply(
        result.recordset[0].replyID,
        ticketID,
        userID,
        replyContent,
        new Date() // replyDate will be current date/time from SQL Server
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getRepliesByTicketID(ticketID) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        SELECT * FROM dbo.TicketReply WHERE TicketID = @ticketID;
      `;

      const request = connection.request();
      request.input("ticketID", sql.Int, ticketID);

      const result = await request.query(sqlQuery);

      connection.close();

      const replies = result.recordset.map(
        (reply) =>
          new TicketReply(
            reply.ReplyID,
            reply.TicketID,
            reply.UserID,
            reply.ReplyContent,
            reply.ReplyDate
          )
      );

      console.log("Retrieved replies:", replies); // Log retrieved replies for debugging

      return replies;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = TicketReply;
