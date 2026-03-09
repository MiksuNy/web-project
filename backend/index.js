const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const initSocket = require("./sockets/chatSocket");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: { origin: "*" },
});

app.set("io", io);

initSocket(io);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
