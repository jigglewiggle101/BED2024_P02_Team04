const Comment = require("../models/comment");

const createComment = async (req, res) => {
  const { postID, userID, content, createDate } = req.body;

  console.log('Received request body:', req.body); // Add this line to log the request body

  if (!postID || !userID || !content || !createDate) {
    return res.status(400).json({ message: 'PostID, UserID, content, and createDate are required' });
  }

  try {
    const newComment = await Comment.createComment({ postID, userID, content, createDate });
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

const updateComment = async (req, res) => {
  const commentID = parseInt(req.params.id);
  const { content } = req.body;

  try {
    const updated = await Comment.updateComment(commentID, { content });
    if (!updated) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json({ message: 'Comment updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
};

const deleteComment = async (req, res) => {
  const commentID = parseInt(req.params.id);

  try {
    const deleted = await Comment.deleteComment(commentID);
    if (!deleted) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};


// Commit - Added Console.log for debugging