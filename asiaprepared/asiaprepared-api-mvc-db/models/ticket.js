const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Ticket {
  constructor(
    ticketID,
    userID,
    title,
    description,
    ticketType,
    images,
    status,
    createdDate,
    updatedDate
  ) {
    this.ticketID = ticketID;
    this.userID = userID;
    this.title = title;
    this.description = description;
    this.ticketType = ticketType;
    this.images = images || null;
    this.status = status;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate || null;
  }

  static async createTicket(newTicketData) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        INSERT INTO dbo.Ticket (UserID, Title, Description, TicketType, Images, Status, CreatedDate)
        VALUES (@userID, @title, @description, @ticketType, @images, @status, GETDATE());
        SELECT SCOPE_IDENTITY() AS ticketID;
      `;

      const request = connection.request();
      request.input("userID", sql.Int, newTicketData.userID);
      request.input("title", sql.VarChar(100), newTicketData.title);
      request.input("description", sql.VarChar(sql.MAX), newTicketData.description);
      request.input("ticketType", sql.VarChar(50), newTicketData.ticketType); // Add ticketType here
      request.input("images", sql.VarBinary(sql.MAX), newTicketData.images || null);
      request.input("status", sql.VarChar(20), newTicketData.status);

      const result = await request.query(sqlQuery);

      connection.close();

      return new Ticket(
        result.recordset[0].ticketID,
        newTicketData.userID,
        newTicketData.title,
        newTicketData.description,
        newTicketData.ticketType, // Add ticketType here
        newTicketData.images,
        newTicketData.status,
        new Date(), // CreatedDate will be current date/time from SQL Server
        null // UpdatedDate initially null
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async updateTicketStatus(ticketID, newStatus) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        UPDATE dbo.Ticket
        SET Status = @status, UpdatedDate = GETDATE()
        WHERE TicketID = @ticketID;
      `;

      const request = connection.request();
      request.input("ticketID", sql.Int, ticketID);
      request.input("status", sql.VarChar(20), newStatus);

      await request.query(sqlQuery);

      connection.close();

      return true; // Or you can return updated data if needed
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getTicketByID(ticketID) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        SELECT * FROM dbo.Ticket WHERE TicketID = @ticketID;
      `;

      const request = connection.request();
      request.input("ticketID", sql.Int, ticketID);

      const result = await request.query(sqlQuery);

      connection.close();

      if (result.recordset.length === 0) {
        throw new Error("Ticket not found");
      }

      const {
        TicketID,
        UserID,
        Title,
        Description,
        TicketType,
        Images,
        Status,
        CreatedDate,
        UpdatedDate,
      } = result.recordset[0];

      return new Ticket(
        TicketID,
        UserID,
        Title,
        Description,
        TicketType,
        Images,
        Status,
        CreatedDate,
        UpdatedDate
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async updateTicketStatus(ticketID, newStatus) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        UPDATE dbo.Ticket
        SET Status = @status, UpdatedDate = GETDATE()
        WHERE TicketID = @ticketID;
      `;

      const request = connection.request();
      request.input("ticketID", sql.Int, ticketID);
      request.input("status", sql.VarChar(20), newStatus);

      await request.query(sqlQuery);

      connection.close();

      return true; // Or you can return updated data if needed
    } catch (err) {
      throw new Error(err.message);
    }
  }
  
  static async getAllTicketsWithReplies() {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
        SELECT * FROM dbo.Ticket;
      `;

      const request = connection.request();
      const result = await request.query(sqlQuery);

      connection.close();

      const tickets = result.recordset;

      for (const ticket of tickets) {
        const replies = await Ticket.getRepliesByTicketID(ticket.TicketID);
        ticket.replies = replies;
      }

      return tickets;
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

      return result.recordset;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}



module.exports = Ticket;
