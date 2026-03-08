const mongoose = require("mongoose");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const createChat = async (req, res) => {
  try {
    const me = req.user.id;
    const { otherUserId, subject, text } = req.body;

    if (!otherUserId || !mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: "Valid otherUserId is required" });
    }

    if (String(otherUserId) === String(me)) {
      return res.status(400).json({ message: "Cannot create chat with yourself" });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "First message text is required" });
    }

    const otherUserExists = await User.exists({ _id: otherUserId });
    if (!otherUserExists) {
      return res.status(404).json({ message: "Other user not found" });
    }

    let chat = await Chat.findOne({
      participants: { $all: [me, otherUserId], $size: 2 },
    });

    // if chat already exists -> not create another request
    if (chat) {
      return res.status(200).json(chat);
    }

    chat = await Chat.create({
      participants: [me, otherUserId],
      subject: subject || "General",
      requestedBy: me,
      status: "pending",
    });

    const firstMessage = await Message.create({
      chatId: chat._id,
      sender: me,
      receiver: otherUserId,
      text: text.trim(),
    });

    chat.lastMessage = firstMessage._id;
    chat.updatedAt = new Date();
    await chat.save();

    return res.status(201).json(chat);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    if (chat.status !== "accepted") {
      return res.status(403).json({ message: "Chat request not accepted yet" });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === me.toString()
    );
    if (!isParticipant) return res.status(403).json({ message: "Not allowed" });

    const receiver = chat.participants.find((p) => p.toString() !== me.toString());

    const message = await Message.create({
      chatId: req.params.chatId,
      sender: me,
      receiver,
      text: text.trim(),
    });

    await Chat.findByIdAndUpdate(req.params.chatId, {
      lastMessage: message._id,
      updatedAt: Date.now(),
    });

    // Emit socket events for realtime UI (chat + unread badge)
    const io = req.app.get("io");
    if (io) {
      const payload = {
        _id: message._id,
        chatId: String(req.params.chatId),
        sender: String(me),
        text: message.text,
        createdAt: message.createdAt,
      };

      io.to(String(req.params.chatId)).emit("receive_message", payload); // open chat window
      if (receiver) {
        io.to(`user:${String(receiver)}`).emit("new_message", payload); // Messages list/header unread
      }
    }

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get chat info (participants, etc.)
const getChatInfo = async (req, res) => {
  try {
    const me = req.user.id;
    const chat = await Chat.findById(req.params.chatId).populate(
      "participants",
      "firstName lastName email"
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p._id.toString() === me.toString()
    );
    if (!isParticipant) return res.status(403).json({ message: "Not allowed" });

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// incoming requests (Received requests tab)
const getMyRequests = async (req, res) => {
  try {
    const me = req.user.id;

    const requests = await Chat.find({
      participants: me,
      status: "pending",
      requestedBy: { $ne: me }, 
    })
      .populate("participants", "firstName lastName email")
      .populate({ path: "lastMessage", select: "text createdAt" })
      .sort({ updatedAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// accept request (moves to Chats tab)
const acceptChat = async (req, res) => {
  try {
    const me = req.user.id;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const isParticipant = chat.participants.some((p) => p.toString() === me.toString());
    if (!isParticipant) return res.status(403).json({ message: "Not allowed" });

    if (chat.requestedBy.toString() === me.toString()) {
      return res.status(403).json({ message: "Requester cannot accept own request" });
    }

    chat.status = "accepted";
    chat.acceptedAt = new Date();
    chat.updatedAt = new Date();
    await chat.save();

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const declineChat = async (req, res) => {
  try {
    const me = req.user.id;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const isParticipant = chat.participants.some((p) => String(p) === String(me));
    if (!isParticipant) return res.status(403).json({ message: "Not allowed" });

    if (!["pending", "accepted"].includes(chat.status)) {
      return res
        .status(400)
        .json({ message: "Only pending or accepted chats can be declined" });
    }

    chat.status = "declined";
    chat.updatedAt = new Date();
    await chat.save();

    return res.status(200).json(chat);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Chats tab = accepted and declined only
const getMyChats = async (req, res) => {
  try {
    const me = req.user.id;

    const chats = await Chat.find({
      participants: me,
      $or: [
        { status: "accepted" },
        { status: "declined" },                 // both sender and receiver see declined
        { status: "pending", requestedBy: me }, // only sender sees pending in Chats
      ],
    })
      .populate("participants", "firstName lastName email")
      .populate({ path: "lastMessage", select: "text createdAt" })
      .sort({ updatedAt: -1 });

    return res.status(200).json(chats);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteChat = async (req, res) => {
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

    await Message.deleteMany({ chatId: req.params.chatId });
    await Chat.findByIdAndDelete(req.params.chatId);

    res.json({ message: "Chat deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const reopenChatRequest = async (req, res) => {
  try {
    const me = String(req.user.id || req.user._id);
    const { chatId } = req.params;
    const text = String(req.body?.text || "").trim();

    if (!text) return res.status(400).json({ message: "Message text is required" });

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const isParticipant = chat.participants.some((p) => String(p) === me);
    if (!isParticipant) return res.status(403).json({ message: "Not allowed" });

    if (chat.status !== "declined") {
      return res.status(400).json({ message: "Only declined chats can be reopened" });
    }

    const receiver = chat.participants.find((p) => String(p) !== me);

    chat.status = "pending";
    chat.requestedBy = me;
    chat.updatedAt = new Date();
    await chat.save();

    const firstMessage = await Message.create({
      chatId: chat._id,
      sender: me,
      receiver,
      text,
    });

    chat.lastMessage = firstMessage._id;
    await chat.save();

    return res.json({ chat, message: firstMessage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChat,
  deleteChat,
  getMessages,
  sendMessage,
  getChatInfo,
  getMyChats,
  getMyRequests,
  acceptChat,
  declineChat,
  reopenChatRequest
};