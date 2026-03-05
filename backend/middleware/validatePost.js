const validatePost = (req, res, next) => {
  const { type, title, description, category, budget } = req.body;

  if (!["offer", "request"].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  // Location is defaulted to user's location in the controller, so it's not required here
  // It can also be set by the user, so we allow it to be optional
  if (!title || !description || !category) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (type === "request" && budget !== undefined && isNaN(budget)) {
    return res.status(400).json({ message: "Budget must be a number" });
  }

  next();
};

module.exports = validatePost;
