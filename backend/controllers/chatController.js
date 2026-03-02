const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

const createChat = async (req, res) => {
  try {
    const me = req.user.id;
    const { otherUserId } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [me, otherUserId] },
    });

    if (!chat) {
      chat = await Chat.create({ participants: [me, otherUserId] });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const me = req.user.id;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === me.toString()
    );
    if (!isParticipant) return res.status(403).json({ message: "Not allowed" });

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
    const me = req.user.id;
    const { text } = req.body;

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const isParticipant = chat.participants.some(
      (p) => p.toString() === me.toString()
    );
    if (!isParticipant) return res.status(403).json({ message: "Not allowed" });

    const message = await Message.create({
      chatId: req.params.chatId,
      sender: me,
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
