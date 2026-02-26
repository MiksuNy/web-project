require('dotenv').config();
const connectDB = require("./config/db");
const express = require('express');
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

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

// Track online users
let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User comes online
  socket.on("user_online", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("online_users", Array.from(onlineUsers.keys()));
  });

  // Join chat room
  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
  });

  // Send message (real-time)
  socket.on("send_message", (data) => {
    const { chatId, sender, text } = data;

    // Send to all users in chat room
    io.to(chatId).emit("receive_message", data);

    // Notify the other user
    socket.broadcast.emit("new_message_notification", {
      chatId,
      from: sender,
      text,
    });
  });

  // User disconnects
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
      }
    }
    io.emit("online_users", Array.from(onlineUsers.keys()));
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
