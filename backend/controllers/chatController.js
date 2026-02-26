const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

const createChat = async (req, res) => {
  try {
    const { user1, user2 } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [user1, user2] },
    });

    if (!chat) {
      chat = await Chat.create({ participants: [user1, user2] });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { sender, text } = req.body;

    const message = await Message.create({
      chatId: req.params.chatId,
      sender,
      text,
    });

    await Chat.findByIdAndUpdate(req.params.chatId, {
      lastMessage: message._id,
      updatedAt: Date.now(),
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChat,
  getMessages,
  sendMessage,
};
