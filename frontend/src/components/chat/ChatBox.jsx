
import { useEffect, useRef, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function ChatBox({ chat, onBack }) {
  const peer = chat?.from ?? "Sarah M.";
  const title = chat?.title ?? "Can drive you to appointments";

  const [messages, setMessages] = useState([
    {
      id: 900,
      type: "system",
      text: `You are now connected with ${peer}. You can discuss details about "${title}".`,
    },
    {
      id: 1,
      text: chat?.text ?? "Hi! Would you be available?",
      mine: false,
      time: "11:33 AM",
      senderName: peer,
    },
  ]);

  const bottomRef = useRef(null);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const send = (text) => {
    const id = Date.now();
    setMessages((m) => [...m, { id, text, mine: true, time: now(), seen: false }]);

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: id + 1, text: "Got it 👍", mine: false, time: now(), senderName: peer },
      ]);
    }, 900);

    setTimeout(() => {
      setMessages((m) => m.map((x) => (x.id === id ? { ...x, seen: true } : x)));
    }, 1200);
  };

  const sendLocation = () => {
    const id = Date.now();
    setMessages((m) => [
      ...m,
      { id, mine: true, type: "location_pending", text: "📍 Sharing location...", time: now(), seen: false },
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
      <div className="max-w-5xl w-10/12 h-full mx-auto border-x border-slate-200 bg-white flex flex-col">
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

        <ChatInput onSend={send} onSendLocation={sendLocation} />
      </div>
    </div>
  );
}
