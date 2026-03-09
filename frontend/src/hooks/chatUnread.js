const KEY = "chat_unread_map";

export const getUnreadMap = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
};

export const setUnreadMap = (map) => {
  localStorage.setItem(KEY, JSON.stringify(map || {}));
  window.dispatchEvent(new Event("chat:unread-updated"));
};

export const incrementUnread = (chatId) => {
  if (!chatId) return;
  const map = getUnreadMap();
  map[chatId] = (map[chatId] || 0) + 1;
  setUnreadMap(map);
};

export const clearUnread = (chatId) => {
  if (!chatId) return;
  const map = getUnreadMap();
  delete map[chatId];
  setUnreadMap(map);
};

export const getTotalUnread = () =>
  Object.values(getUnreadMap()).reduce((a, b) => a + Number(b || 0), 0);