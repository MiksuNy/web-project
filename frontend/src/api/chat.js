// clean and validate token
const cleanToken = (token) => {
  if (!token) throw new Error("Missing authentication token");
  const clean = typeof token === "string" ? token.replace(/^Bearer\s+/i, "").trim() : "";
  if (!clean) throw new Error("Missing authentication token");
  return clean;
};

// get token from localStorage (if exists) and clean it
const getStoredToken = () => {
  const fromToken = localStorage.getItem("token");
  const fromUser = JSON.parse(localStorage.getItem("user") || "{}")?.token;
  return cleanToken(fromToken || fromUser || "");
};

const authHeader = (token) => ({
  Authorization: `Bearer ${cleanToken(token || getStoredToken())}`,
});

export const createOrGetChat = async (otherUserId, token, subject = "General", text, postId = null) => {
  const res = await fetch(`/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify({ otherUserId, subject, text, postId }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Chat creation failed");
  return data;
};

export const getMessages = async (chatId, token) => {
  const res = await fetch(`/api/chat/${chatId}`, {
    headers: authHeader(token),
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || data.error || "Fetching messages failed");
  return data;
};

export const getChatInfo = async (chatId, token) => {
  const res = await fetch(`/api/chat/${chatId}/info`, {
    headers: authHeader(token),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Fetching chat info failed");
  return data;
};

export const sendMessage = async (chatId, text, token) => {
  const res = await fetch(`/api/chat/${chatId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify({ text }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Sending message failed");
  return data;
};

// accepted chats
export const getMyChats = async (token) => {
  const res = await fetch(`/api/chat/my-chats`, {
    headers: authHeader(token),
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || data.error || "Fetching chats failed");
  return data;
};

// pending incoming requests
export const getMyRequests = async (token) => {
  const res = await fetch(`/api/chat/my-requests`, {
    headers: authHeader(token),
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || data.error || "Fetching requests failed");
  return data;
};

// accept pending request
export const acceptChatRequest = async (chatId, token) => {
  const res = await fetch(`/api/chat/requests/${chatId}/accept`, {
    method: "PATCH",
    headers: authHeader(token),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Accept request failed");
  return data;
};

export const declineChatRequest = async (chatId, token) => {
  const res = await fetch(`/api/chat/requests/${chatId}/decline`, {
    method: "PATCH",
    headers: authHeader(token),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Decline request failed");
  return data;
};

export const reopenChatRequest = async (chatId, token, text) => {
  const res = await fetch(`/api/chat/requests/${chatId}/reopen`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify({ text }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Failed to reopen chat request");
  return data;
};

export { getStoredToken };