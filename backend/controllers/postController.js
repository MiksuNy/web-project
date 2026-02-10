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

// PUT /posts/:id
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : post.imageUrl;

    post.type = req.body.type || post.type;
    post.title = req.body.title || post.title;
    post.description = req.body.description || post.description;
    post.category = req.body.category || post.category;
    post.location = req.body.location || post.location;
    post.budget = req.body.type === "request" ? req.body.budget : null;
    post.imageUrl = imageUrl;

    await post.save();

    res.json({ message: "Post updated", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /posts/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });
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
    if (location) filter.location = location;
    if (type) filter.type = type;

    const posts = await Post.find(filter).sort({ createdAt: -1 }).populate("user", "firstName email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /posts/:id (posts by user)
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id }).sort({ createdAt: -1 }).populate("user", "firstName email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getUserPosts,
  updatePost,
  deletePost
};
