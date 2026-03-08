import { useEffect, useState } from "react";
import { getTotalUnread } from "@/hooks/chatUnread";

export default function useUnreadCount() {
  const [unreadTotal, setUnreadTotal] = useState(getTotalUnread());

  useEffect(() => {
    const refresh = () => setUnreadTotal(getTotalUnread());

    window.addEventListener("chat:unread-updated", refresh);
    window.addEventListener("storage", refresh);
    refresh();

    return () => {
      window.removeEventListener("chat:unread-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return unreadTotal;
}