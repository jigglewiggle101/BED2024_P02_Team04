const Vote = require("../models/vote");

const createVote = async (req, res) => {
  const { postID, userID, voteType } = req.body;

  if (!postID || !userID || !voteType) {
    return res.status(400).json({ message: 'PostID, UserID, and voteType are required' });
  }

  try {
    const newVote = await Vote.createVote({ postID, userID, voteType });
    res.status(201).json(newVote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating vote', error: error.message });
  }
};

const deleteVote = async (req, res) => {
  const voteID = parseInt(req.params.id);

  try {
    const deleted = await Vote.deleteVote(voteID);
    if (!deleted) {
      return res.status(404).json({ message: 'Vote not found' });
    }
    res.json({ message: 'Vote deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting vote', error: error.message });
  }
};

module.exports = {
  createVote,
  deleteVote,
};
