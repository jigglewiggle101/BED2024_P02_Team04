const Tag = require("../models/tag");

const createTag = async (req, res) => {
  const { tagName } = req.body;
  try {
    const newTag = await Tag.createTag(tagName);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTag = async (req, res) => {
  const { id } = req.params;
  try {
    await Tag.deleteTag(id);
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.getAllTags();
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTag,
  deleteTag,
  getAllTags,
};
