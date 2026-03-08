const { io } = require("socket.io-client");

// Put token of user A (sender) s7@user.com
const SENDER_TOKEN = "USER_A_TOKEN";

// Put token of user B (receiver) s6@user.com
const RECEIVER_TOKEN = "USER_B_TOKEN_HERE";

const CHAT_ID = "CHAT_ID_HERE"; // Put an existing chat ID where both users are participants
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