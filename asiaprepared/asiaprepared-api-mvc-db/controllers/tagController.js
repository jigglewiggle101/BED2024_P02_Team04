const Tag = require("../models/tag");

const createTag = async (req, res) => {
  const { tagName } = req.body;

  if (!tagName) {
    return res.status(400).json({ message: 'Tag name is required' });
  }

  try {
    const newTag = await Tag.createTag(tagName);
    res.status(201).json(newTag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating tag', error: error.message });
  }
};

const deleteTag = async (req, res) => {
  const tagID = parseInt(req.params.id);

  try {
    const deleted = await Tag.deleteTag(tagID);
    if (!deleted) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting tag', error: error.message });
  }
};

module.exports = {
  createTag,
  deleteTag,
};
