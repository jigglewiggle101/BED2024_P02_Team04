const Comment = require("../models/comment");
const User = require("../models/user");

const createComment = async (req, res) => {
  const { postID, userID, content, createDate } = req.body;

  console.log('Received request body:', req.body);

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

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const updatedComment = await Comment.updateComment(commentID, { content });
    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json({ message: 'Comment updated successfully', comment: updatedComment });
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

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.getAllComments();
    for (const comment of comments) {
      comment.username = await User.getUsernameById(comment.userID);
    }
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

const getCommentsByPostID = async (req, res) => {
  const postID = parseInt(req.params.postID);

  if (isNaN(postID)) {
    return res.status(400).json({ message: 'Invalid postID' });
  }

  try {
    const comments = await Comment.getCommentsByPostID(postID);
    for (const comment of comments) {
      comment.username = await User.getUsernameById(comment.userID);
    }
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
  getCommentsByPostID,
};
