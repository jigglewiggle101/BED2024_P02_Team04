const TicketReply = require("../models/ticketReply");

const createReply = async (req, res) => {
  const { ticketID, userID, replyContent } = req.body;

  if (!ticketID || !replyContent) {
    return res.status(400).json({ message: 'TicketID and ReplyContent are required' });
  }

  try {
    const newReply = await TicketReply.createReply(ticketID, userID, replyContent);
    res.status(201).json(newReply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating reply', error: error.message });
  }
};

const getRepliesByTicketID = async (req, res) => {
  const ticketID = parseInt(req.params.ticketID);

  try {
    const replies = await TicketReply.getRepliesByTicketID(ticketID);
    res.json(replies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving replies', error: error.message });
  }
};

module.exports = {
  createReply,
  getRepliesByTicketID,
};
