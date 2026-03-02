require('dotenv').config();
const connectDB = require("./config/db");
const express = require('express');
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const Chat = require("./models/chatModel");
const Message = require("./models/messageModel");

const locationsRoutes = require('./routes/locationsRouter');
const authRoutes = require('./routes/authRouter');
const postsRoutes = require('./routes/postsRouter');
const aiRoutes = require('./routes/aiRouter');
const profileRoutes = require('./routes/profileRouter');
const chatRoutes = require('./routes/chatRouter');

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is working');
});

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);
app.use('/ai', aiRoutes);
app.use('/api', locationsRoutes);
app.use('/users', profileRoutes);
app.use('/chat', chatRoutes);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Socket auth middleware (JWT)
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

// Track online users
let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id, "→ userId:", socket.userId);

  // use token identity
  onlineUsers.set(String(socket.userId), socket.id);
  io.emit("online_users", Array.from(onlineUsers.keys()));

  // JOIN CHAT
  socket.on("join_chat", async (chatId) => {
    try {
      const chat = await Chat.findOne({ _id: chatId, participants: socket.userId });
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

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
