const Bookmark = require("../models/bookmark");

const createBookmark = async (req, res) => {
  const { userID, postID } = req.body;

  if (!userID || !postID) {
    return res.status(400).json({ message: 'UserID and PostID are required' });
  }

  try {
    const newBookmark = await Bookmark.createBookmark(userID, postID);
    res.status(201).json(newBookmark);
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

module.exports = {
  createBookmark,
  deleteBookmark,
};
