const Post = require("../models/postModel");

// POST /posts
const createPost = async (req, res) => {
  try {
    const { type, title, description, category, location, budget } = req.body;

    if (!["offer", "request"].includes(type)) {
      return res.status(400).json({ message: "Invalid type. Must be 'offer' or 'request'." });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = await Post.create({
      type,
      title,
      description,
      category,
      location,
      budget: type === "request" ? budget : null,
      imageUrl,
      user: req.user.id
    });

    res.status(201).json({
      message: "Post created",
      post: newPost
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /posts (all)
const getPosts = async (req, res) => {
  try {
    const { category, location, type } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (location) filter.location = location
    if (type) filter.type = type;

    const posts = await Post.find(filter).populate("user", "name email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /posts/my (only current user)
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).populate("user", "name email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getUserPosts
};
