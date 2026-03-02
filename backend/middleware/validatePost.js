const validatePost = (req, res, next) => {
  const { type, title, description, category, location, budget } = req.body;

  if (!["offer", "request"].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  if (!title || !description || !category || !location) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (type === "request" && budget !== undefined && isNaN(budget)) {
    return res.status(400).json({ message: "Budget must be a number" });
  }

  next();
};

module.exports = validatePost;
