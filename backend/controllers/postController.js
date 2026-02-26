const Post = require("../models/postModel");
const { buildPostQuery } = require("../utils/postQuery");

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

// PUT /posts/:postId
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
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

// DELETE /posts/:postId
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
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
    const { filter, limit, offset } = buildPostQuery(req.query);

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(offset).limit(limit)
      .populate("user", "firstName email");
    const total = await Post.countDocuments(filter);

    res.json({ posts, total, limit, offset });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /posts/user/:userId (posts by user ID)
const getUserPosts = async (req, res) => {
  try {
    const { filter, limit, offset } = buildPostQuery(req.query);

    filter.user = req.params.userId;

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("user", "firstName email");

    const total = await Post.countDocuments(filter);
    res.json({ posts, total, limit, offset });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /posts/:postId (single post by ID)
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate("user", "firstName email");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost
};
