const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createChat,
  getMessages,
  sendMessage,
} = require("../controllers/chatController");

// router.use(auth);

// Create chat
router.post("/create", createChat);

// Get messages
router.get("/:chatId/messages", getMessages);

// Send message
router.post("/:chatId/message", sendMessage);

module.exports = router;
