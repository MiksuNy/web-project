const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createChat,
  getMessages,
  sendMessage,
  getChatInfo,
  getMyChats,
  getMyRequests,
  acceptChat,
  declineChat,
  deleteChat,
  reopenChatRequest
} = require("../controllers/chatController");

router.use(auth);

// Create chat
router.post("/", createChat);

// Get my chats
router.get("/my-chats", getMyChats);

// Get my requests
router.get("/my-requests", getMyRequests);

// Reopen chat request
router.patch("/requests/:chatId/reopen", reopenChatRequest);

// Accept chat request
router.patch("/requests/:chatId/accept", acceptChat);

// Decline chat request
router.patch("/requests/:chatId/decline", declineChat);

// Get chat info (participants)
router.get("/:chatId/info", getChatInfo);

// Get messages
router.get("/:chatId", getMessages);

// Send message
router.post("/:chatId", sendMessage);

// Delete chat
router.delete("/:chatId", deleteChat);

module.exports = router;
