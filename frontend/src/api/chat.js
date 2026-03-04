const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const createOrGetChat = async (otherUserId, token, subject = "General") => {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ otherUserId, subject }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Chat creation failed");
  return data; // chat object
};

export const getMessages = async (chatId, token) => {
  const res = await fetch(`${API_URL}/chat/${chatId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data.message || data.error || "Fetching messages failed");
  return data; // messages[]
};

export const sendMessage = async (chatId, text, token) => {
  const res = await fetch(`${API_URL}/chat/${chatId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Sending message failed");
  return data; // message
};