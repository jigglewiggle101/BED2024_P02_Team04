const Post = require("../models/post");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

const getPostById = async (req, res) => {
  const postID = parseInt(req.params.id);

  if (isNaN(postID)) {
    return res.status(400).json({ message: 'Invalid postID' });
  }

  try {
    const post = await Post.getPostById(postID);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

const getVoteCountByPostID = async (req, res) => {
  const postID = parseInt(req.params.id);

  if (isNaN(postID)) {
    return res.status(400).json({ message: 'Invalid postID' });
  }

  try {
    const voteCount = await Post.getVoteCountByPostID(postID);
    res.json({ voteCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching vote count', error: error.message });
  }
};

const createPost = async (req, res) => {
  const { content, createBy, createDate, contentImage } = req.body;

  // Log the request body to ensure it's being received
  console.log('Request body:', req.body);

  if (!content || !createBy || !createDate) {
      return res.status(400).json({ message: 'Content, createdBy, and createDate are required' });
  }

  let contentImageBuffer = null;
  if (contentImage) {
      contentImageBuffer = Buffer.from(contentImage, 'base64');
  }

  try {
      const newPost = await Post.createPost({ content, createBy, createDate, contentImage: contentImageBuffer, tagID: null, voteCount: 0 });
      res.status(201).json(newPost);
  } catch (error) {
      console.error('Error creating post:', error);
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

  if (isNaN(postID)) {
    return res.status(400).json({ message: 'Invalid postID' });
  }

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
  getAllPosts,
  getPostById,
  getVoteCountByPostID
};
