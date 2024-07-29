const Ticket = require("../models/ticket");

const createTicket = async (req, res) => {
  const { userID, title, description, images, status } = req.body;

  if (!userID || !title || !description || !status) {
    return res.status(400).json({ message: 'UserID, Title, Description, and Status are required' });
  }

  try {
    const newTicket = await Ticket.createTicket({ userID, title, description, images, status });
    res.status(201).json(newTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
};

const updateTicketStatus = async (req, res) => {
  const ticketID = parseInt(req.params.id);
  const { status } = req.body;

  try {
    const updated = await Ticket.updateTicketStatus(ticketID, status);
    if (!updated) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json({ message: 'Ticket status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating ticket status', error: error.message });
  }
};

const getTicketByID = async (req, res) => {
  const ticketID = parseInt(req.params.id);

  try {
    const ticket = await Ticket.getTicketByID(ticketID);
    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving ticket', error: error.message });
  }
};

const getAllTicketsWithReplies = async (req, res) => {
  try {
    const tickets = await Ticket.getAllTicketsWithReplies();
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets with replies:", error);
    res.status(500).json({ message: "Error fetching tickets with replies", error: error.message });
  }
};

module.exports = {
  createTicket,
  updateTicketStatus,
  getTicketByID,
  getAllTicketsWithReplies,
};
