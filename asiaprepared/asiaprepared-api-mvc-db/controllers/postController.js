const Post = require("../models/post");

const createPost = async (req, res) => {
  const { content, createBy, createDate, contentImage, tagID, voteCount } = req.body;

  if (!content || !createBy || !createDate) {
    return res.status(400).json({ message: 'Content, createdBy, and createDate are required' });
  }

  try {
    const newPost = await Post.createPost({ content, createBy, createDate, contentImage, tagID, voteCount });
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

const updatePost = async (req, res) => {
  const postID = parseInt(req.params.id);
  const { content, contentImage, tagID } = req.body;

  try {
    const updated = await Post.updatePost(postID, { content, contentImage, tagID });
    if (!updated) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

const deletePost = async (req, res) => {
  const postID = parseInt(req.params.id);

  try {
    const deleted = await Post.deletePost(postID);
    if (!deleted) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
};
