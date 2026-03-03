const jwt = require("jsonwebtoken");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

// Socket auth middleware (JWT)
const initSocket = (io) => {
  // Track online users
  let onlineUsers = new Map();

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers.authorization || "").replace("Bearer ", "");

      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded._id || decoded.id;
      console.log("Socket auth successful for user:", socket.userId);
      next();
    } catch (err) {
      console.error("Socket auth error:", err);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id, "→ userId:", socket.userId);

    // use token identity
    onlineUsers.set(String(socket.userId), socket.id);
    io.emit("online_users", Array.from(onlineUsers.keys()));

    // JOIN CHAT
    socket.on("join_chat", async (chatId) => {
      try {
        const chat = await Chat.findOne({
          _id: chatId,
          participants: socket.userId,
        });
        if (!chat) {
          console.log("JOIN FAILED:", socket.userId, "not in chat", chatId);
          return;
        }
        socket.join(String(chatId));
        console.log("JOIN OK:", socket.userId, "joined", chatId);
        socket.emit("joined_chat", chatId);
      } catch (err) {
        console.error("Error joining chat:", err);
      }
    });

    // SEND MESSAGE
    socket.on("send_message", async (data) => {
      try {
        const { chatId, text } = data || {};
        if (!chatId || !text) return;

        const chat = await Chat.findOne({
          _id: chatId,
          participants: socket.userId,
        });
        if (!chat) return;

        // sender from token only
        const saved = await Message.create({
          chatId,
          sender: socket.userId,
          text,
        });

        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: saved._id,
          updatedAt: Date.now(),
        });
        console.log("SEND OK:", socket.userId, "→", chatId, text);

        io.to(String(chatId)).emit("receive_message", {
          _id: saved._id,
          chatId,
          sender: socket.userId,
          text,
          createdAt: saved.createdAt,
        });
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(String(socket.userId));
      io.emit("online_users", Array.from(onlineUsers.keys()));
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = initSocket;
