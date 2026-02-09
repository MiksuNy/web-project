const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["offer", "request"],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    budget: {
      type: Number,
      default: null
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
