import { useEffect, useRef, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { getMessages, getChatInfo, sendMessage, getStoredToken } from "@/api/chat";

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

  useEffect(() => {
    const load = async () => {
      if (!chatId) return;

      const info = await getChatInfo(chatId, token);
      setTitle(info?.subject || "General");

      const other = (info?.participants || []).find(
        (p) => String(p?._id || p) !== String(myId),
      );

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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = async (text) => {
    const value = (text || "").trim();
    if (!value || !chatId) return;

    try {
      const saved = await sendMessage(chatId, value, token);

      setMessages((prev) => [
        ...prev,
        {
          id: saved._id,
          text: saved.text,
          mine: true,
          time: fmtTime(saved.createdAt),
          senderName: "You",
        },
      ]);

      onChanged?.();
      window.dispatchEvent(new Event("chat:updated"));
    } catch (err) {
      console.error(err);
    }
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
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 leading-5">{peer}</div>
            <div className="text-sm text-slate-500 truncate">Re: {title}</div>
          </div>
        </div>

        <div className="h-[72vh] overflow-y-auto px-5 py-4 space-y-3 bg-slate-50">
          {messages.map((m) => (
            <MessageBubble key={m.id} {...m} senderName={m.senderName ?? peer} />
          ))}
          <div ref={bottomRef} />
        </div>

        <ChatInput onSend={onSend} />
      </div>
    </div>
  );
}