const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  subject: { type: String, required: true, default: "General" },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },

  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  acceptedAt: { type: Date, default: null },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);