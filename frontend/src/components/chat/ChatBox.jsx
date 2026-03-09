import { useEffect, useRef, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { getMessages, getChatInfo, getStoredToken } from "@/api/chat";
import { getSocket } from "@/api/socket";
import { clearUnread } from "@/hooks/chatUnread";

const fmtTime = (d) =>
  new Date(d || Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const decodeUserIdFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?._id || payload?.id || payload?.sub || "";
  } catch {
    return "";
  }
};

export default function ChatBox({ chat, onBack, onChanged }) {
  const token = getStoredToken();
  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const myId =
    userObj?.id ||
    userObj?._id ||
    userObj?.user?.id ||
    userObj?.user?._id ||
    decodeUserIdFromToken(token);

  const chatId = chat?._id || chat?.chatId;

  const [peer, setPeer] = useState(chat?.from ?? "User");
  const [title, setTitle] = useState(chat?.title ?? "General");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const [peerId, setPeerId] = useState("");
  const [isPeerOnline, setIsPeerOnline] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!chatId) return;

      clearUnread(String(chatId));
      window.dispatchEvent(new Event("chat:updated"));

      const info = await getChatInfo(chatId, token);
      setTitle(info?.subject || "General");

      const other = (info?.participants || []).find(
        (p) => String(p?._id || p) !== String(myId),
      );
      
      setPeerId(String(other?._id || other || ""));

      const peerName = other
        ? `${other?.firstName || ""} ${other?.lastName || ""}`.trim() ||
          other?.email ||
          "User"
        : "User";

      setPeer(peerName);

      const list = await getMessages(chatId, token);

      const mapped = (Array.isArray(list) ? list : []).map((m) => {
        const senderId = String(m?.sender?._id || m?.sender || "");
        const mine = senderId === String(myId);

        return {
          id: m._id,
          text: m.text,
          mine,
          time: fmtTime(m.createdAt),
          senderName: mine ? "You" : peerName,
        };
      });

      setMessages(mapped);
    };

    load().catch(console.error);
  }, [chatId, token, myId]);

  useEffect(() => {
    const socket = getSocket(token);

    const onOnlineUsers = (ids = []) => {
      const set = new Set((ids || []).map(String));
      setIsPeerOnline(peerId ? set.has(String(peerId)) : false);
    };

    socket.on("online_users", onOnlineUsers);
    return () => socket.off("online_users", onOnlineUsers);
  }, [token, peerId]);


  useEffect(() => {
    if (!chatId) return;
    const socket = getSocket(token);

    socket.emit("join_chat", String(chatId));

    const onReceive = (m) => {
      if (String(m?.chatId) !== String(chatId)) return;

      const senderId = String(m?.sender || "");
      const mine = senderId === String(myId);

      setMessages((prev) => {
        if (prev.some((x) => String(x.id) === String(m._id))) return prev; // deduplication
        return [
          ...prev,
          {
            id: m._id,
            text: m.text,
            mine,
            time: fmtTime(m.createdAt),
            senderName: mine ? "You" : peer,
          },
        ];
      });

      clearUnread(String(chatId)); // open chat => no unread
      window.dispatchEvent(new Event("chat:updated"));
      onChanged?.();
    };

    socket.on("receive_message", onReceive);

    return () => {
      socket.off("receive_message", onReceive);
      socket.emit("leave_chat", String(chatId));
    };
  }, [chatId, token, myId, peer, onChanged]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = async (text) => {
    const value = (text || "").trim();
    if (!value || !chatId) return;

    const socket = getSocket(token);
    socket.emit("send_message", { chatId: String(chatId), text: value });
  };

  const sendLocation = () => {
    const id = Date.now();
    setMessages((m) => [
      ...m,
      { id, mine: true, type: "location_pending", text: "📍 Sharing location...", time: fmtTime(new Date()), seen: false },
    ]);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMessages((m) =>
          m.map((x) =>
            x.id === id
              ? { ...x, type: "location", lat: pos.coords.latitude, lng: pos.coords.longitude }
              : x
          )
        );
      },
      () => {
        setMessages((m) => m.map((x) => (x.id === id ? { ...x, text: "Location unavailable" } : x)));
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  return (
    <div className="absolute py-10 z-0 left-0 right-0 top-0 bottom-0 flex items-center justify-center pt-17 pb-18">
      <div className="max-w-5xl w-full md:w-10/12 h-full mx-auto border-x border-slate-200 bg-white flex flex-col">
        <div className="h-15 px-6 shrink-0 flex items-center gap-4">
          <button
            type="button"
            onClick={() => onBack?.()}
            className="mt-0.5 text-slate-600 hover:text-slate-900"
            aria-label="Back"
          >
            <MdArrowBack size={22} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className="font-semibold text-slate-900 leading-5 truncate">{peer}</div>
              <div className="shrink-0 text-xs flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${isPeerOnline ? "bg-green-600" : "bg-gray-400"}`}/>
                <span className={isPeerOnline ? "text-green-700" : "text-slate-500"}>
                  {isPeerOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <div className="text-sm text-slate-500 truncate">Re: {title}</div>
          </div>
        </div>

        <div className="h-[72vh] overflow-y-auto px-5 py-4 space-y-3 bg-slate-50">
          {messages.map((m) => (
            <MessageBubble key={m.id} {...m} senderName={m.senderName ?? peer} />
          ))}
          <div ref={bottomRef} />
        </div>

        <ChatInput onSend={onSend} onSendLocation={sendLocation} />
      </div>
    </div>
  );
}