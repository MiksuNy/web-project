const validatePost = (req, res, next) => {
  const { type, title, description, category, budget } = req.body;

  if (!["offer", "request"].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  // Location is determined from user's profile, so we don't validate it here
  if (!title || !description || !category) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (type === "request" && budget !== undefined && isNaN(budget)) {
    return res.status(400).json({ message: "Budget must be a number" });
  }

  next();
};

module.exports = validatePost;
