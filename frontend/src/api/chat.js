const cleanToken = (token) => {
  if (!token) {
    throw new Error("Missing authentication token");
  }
  
  const clean = typeof token === "string" ? token.replace(/^Bearer\s+/i, "").trim() : "";
  if (!clean) {
    throw new Error("Missing authentication token");
  }
  return clean;
};

export const createOrGetChat = async (otherUserId, token, subject = "General") => {
  const res = await fetch(`/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cleanToken(token)}`,
    },
    body: JSON.stringify({ otherUserId, subject }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Chat creation failed");
  return data;
};

export const getMessages = async (chatId, token) => {
  const res = await fetch(`/api/chat/${chatId}`, {
    headers: {
      Authorization: `Bearer ${cleanToken(token)}`,
    },
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || data.error || "Fetching messages failed");
  return data;
};

export const getChatInfo = async (chatId, token) => {
  const res = await fetch(`/api/chat/${chatId}/info`, {
    headers: {
      Authorization: `Bearer ${cleanToken(token)}`,
    },
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
      Authorization: `Bearer ${cleanToken(token)}`,
    },
    body: JSON.stringify({ text }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Sending message failed");
  return data;
};

export const getMyChats = async (token) => {
  console.log("getMyChats called with token:", token?.substring(0, 20) + "...");
  const cleanedToken = cleanToken(token);
  console.log("Cleaned token:", cleanedToken.substring(0, 20) + "...");
  
  const res = await fetch(`/api/chat/my-chats`, {
    headers: {
      Authorization: `Bearer ${cleanedToken}`,
    },
  });

  console.log("Response status:", res.status);
  const data = await res.json().catch(() => []);
  console.log("Response data:", data);
  
  if (!res.ok) throw new Error(data.message || data.error || "Fetching chats failed");
  return data;
};