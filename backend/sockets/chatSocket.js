const jwt = require("jsonwebtoken");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

const initSocket = (io) => {
  let onlineUsers = new Map();

  io.use((socket, next) => {
    try {
      const raw =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization ||
        "";

      const token = String(raw).replace(/^Bearer\s+/i, "").trim();
      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.SECRET || process.env.JWT_SECRET);
      socket.userId = decoded._id || decoded.id;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    onlineUsers.set(String(socket.userId), socket.id);
    socket.join(`user:${String(socket.userId)}`);
    io.emit("online_users", Array.from(onlineUsers.keys()));

    socket.on("join_chat", async (chatId) => {
      const chat = await Chat.findOne({ _id: chatId, participants: socket.userId });
      if (!chat) return;
      socket.join(String(chatId));
      socket.emit("online_users", Array.from(onlineUsers.keys()));
    });

    socket.on("send_message", async (data) => {
      try {
        const { chatId, text } = data || {};
        if (!chatId || !text?.trim()) return;

        const chat = await Chat.findOne({ _id: chatId, participants: socket.userId });
        if (!chat) return;

        const receiver = chat.participants.find(
          (p) => String(p) !== String(socket.userId)
        );

        const saved = await Message.create({
          chatId,
          sender: socket.userId,
          receiver,
          text: text.trim(),
        });

        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: saved._id,
          updatedAt: Date.now(),
        });

        const payload = {
          _id: saved._id,
          chatId: String(chatId),
          sender: String(socket.userId),
          text: saved.text,
          createdAt: saved.createdAt,
        };

        io.to(String(chatId)).emit("receive_message", payload); // open chat
        if (receiver) io.to(`user:${String(receiver)}`).emit("new_message", payload); // list/header unread
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(String(socket.userId));
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = initSocket;