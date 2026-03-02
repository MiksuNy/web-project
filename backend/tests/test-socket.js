const { io } = require("socket.io-client");

// Insert JWT token here
const TOKEN = "USER_JWT_TOKEN_HERE";

// Test chat ID
const CHAT_ID = "CHAT_ID_HERE";

const socket = io("http://localhost:5000", {
  auth: { token: TOKEN }
});

socket.on("connect", () => {
  console.log("Connected as:", socket.id);

  // 1. Join chat
  socket.emit("join_chat", CHAT_ID);
  console.log("join_chat sent:", CHAT_ID);

  // 2. Send message after join
  setTimeout(() => {
    socket.emit("send_message", {
      chatId: CHAT_ID,
      text: "Hello from test!"
    });
    console.log("send_message sent");
  }, 1000);
});

// Listen for server events
socket.on("joined_chat", (chatId) => {
  console.log("joined_chat:", chatId);
});

socket.on("message_sent", (msg) => {
  console.log("message_sent:", msg);
});

socket.on("receive_message", (msg) => {
  console.log("receive_message:", msg);
});

socket.on("online_users", (users) => {
  console.log("online_users:", users);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});
