const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createChat,
  getMessages,
  sendMessage,
} = require("../controllers/chatController");

router.use(auth);

// Create chat
router.post("/", createChat);

// Get messages
router.get("/:chatId/messages", getMessages);

// Send message
router.post("/:chatId/messages", sendMessage);

module.exports = router;
