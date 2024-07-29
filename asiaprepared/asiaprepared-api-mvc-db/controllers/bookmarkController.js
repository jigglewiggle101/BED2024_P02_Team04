const Bookmark = require("../models/bookmark");

const createBookmark = async (req, res) => {
  const { userID, postID } = req.body;

  if (!userID || !postID) {
    return res.status(400).json({ message: 'UserID and PostID are required' });
  }

  try {
    const newBookmark = await Bookmark.createBookmark(userID, postID);
    if (newBookmark) {
      res.status(201).json(newBookmark);
    } else {
      res.status(409).json({ message: 'Bookmark already exists' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating bookmark', error: error.message });
  }
};

const deleteBookmark = async (req, res) => {
    const bookmarkID = parseInt(req.params.id);

    try {
        const deleted = await Bookmark.deleteBookmark(bookmarkID);
        if (!deleted) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }
        res.json({ message: 'Bookmark deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting bookmark', error: error.message });
    }
};

const searchBookmarkByContent = async (req, res) => {
    const { content } = req.query;

    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    try {
        const bookmarks = await Bookmark.searchBookmarkByContent(content);
        res.json(bookmarks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching bookmarks', error: error.message });
    }
};

const getBookmarksByUserId = async (req, res) => {
  const userID = parseInt(req.params.id);

  try {
      const bookmarks = await Bookmark.getBookmarksByUserId(userID);
      res.json(bookmarks);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching bookmarks', error: error.message });
  }
};


module.exports = {
    createBookmark,
    deleteBookmark,
    searchBookmarkByContent,
    getBookmarksByUserId,
};
