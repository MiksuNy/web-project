const { io } = require("socket.io-client");

// Put token of user A (sender) s7@user.com
const SENDER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODM2ZjZlYzMxMzI4MjIwZTlhNDgwMCIsImVtYWlsIjoiczdAdXNlci5jb20iLCJyb2xlIjoiYWRtaW4iLCJmaXJzdE5hbWUiOiJNYXJpYSIsImxhc3ROYW1lIjoiSyIsImRhdGVPZkJpcnRoIjoiMjAwMC0xMi0wNFQwMDowMDowMC4wMDBaIiwibG9jYXRpb24iOiJWYW50YWEiLCJwaG9uZSI6IjEyMzQ1NjciLCJpYXQiOjE3NzI5NzYyMjUsImV4cCI6MTgwNDUxMjIyNX0.9Jrq2JW5WuXqxilLE-QQAPvdwSh6Rq-onZupqj8VF3M";

// Put token of user B (receiver) s6@user.com
const RECEIVER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODM2YTY3ZDEyZmIzMzkyZTc1ZDRmMyIsImVtYWlsIjoiczZAdXNlci5jb20iLCJyb2xlIjoiY2xpZW50IiwiZmlyc3ROYW1lIjoic2pqcyIsImxhc3ROYW1lIjoiMTIzYWFhNDU2IiwiZGF0ZU9mQmlydGgiOiIyMDAwLTEyLTAyVDIyOjAwOjAwLjAwMFoiLCJsb2NhdGlvbiI6IlZhbnRhYSIsImlhdCI6MTc3Mjk3MjY5NywiZXhwIjoxODA0NTA4Njk3fQ.ZTf-laoLXAgK-u3II4SvnwrukvnTxBL4fbqwlCs3AYA";

const CHAT_ID = "69ad6dadcdb90b10d94f00d0";
const URL = "http://localhost:5000";

const mkClient = (name, token) => {
  const socket = io(URL, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log(`[${name}] connected:`, socket.id);
    socket.emit("join_chat", CHAT_ID);
    console.log(`[${name}] join_chat sent:`, CHAT_ID);
  });

  socket.on("connect_error", (err) => {
    console.log(`[${name}] connect_error:`, err.message);
  });

  socket.on("online_users", (users) => {
    console.log(`[${name}] online_users:`, users);
  });

  socket.on("receive_message", (msg) => {
    console.log(`[${name}] receive_message:`, msg);
  });

  socket.on("new_message", (msg) => {
    console.log(`[${name}] NEW_MESSAGE_NOTIFICATION:`, msg);
  });

  socket.on("disconnect", () => {
    console.log(`[${name}] disconnected`);
  });

  return socket;
};

const receiver = mkClient("RECEIVER", RECEIVER_TOKEN);
const sender = mkClient("SENDER", SENDER_TOKEN);

// Send after both connected/joined
setTimeout(() => {
  sender.emit("send_message", {
    chatId: CHAT_ID,
    text: "Hello from sender test",
  });
  console.log("[SENDER] send_message sent");
}, 1500);

// Auto close
setTimeout(() => {
  sender.disconnect();
  receiver.disconnect();
  process.exit(0);
}, 7000);