import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
let socketRef = null;

export const getSocket = (token) => {
  if (socketRef?.connected) return socketRef;

  socketRef = io(API_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  return socketRef;
};

export const disconnectSocket = () => {
  if (socketRef) {
    socketRef.disconnect();
    socketRef = null;
  }
};