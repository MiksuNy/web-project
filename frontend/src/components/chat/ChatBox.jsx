//  React hooks — all in one import (FIX duplicate)
import { useState, useRef, useEffect } from "react";

import { MdClose, MdDeleteOutline } from "react-icons/md";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatBox() {
  // message state — holds chat messages
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello", mine: false },
  ]);

  // rconst bottomRef = useRef(null);

  // auto scroll when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const bottomRef = useRef(null);

  // send handler — adds new message with time + seen simulation
  const send = (text) => {
    const id = Date.now();
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((m) => [...m, { id, text, mine: true, time, seen: false }]);

    // simulate "seen" like instagram after delay
    setTimeout(() => {
      setMessages((m) =>
        m.map((x) => (x.id === id ? { ...x, seen: true } : x)),
      );
    }, 1500);
  };

  // auto scroll when messages change (PRO behavior)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    //main chat container — themed + fixed height
    <div className="w-full max-w-2xl mx-auto border border-border rounded-2xl bg-card shadow-lg flex flex-col `h-[560px]` overflow-hidden">
      {/* ========================= */}
      {/* CHAT HEADER */}
      {/* ========================= */}
      <div className="flex items-center gap-3 border-b border-border p-3 bg-linear-to-r from-green-600 to-green-700 text-white">
        {/* avatar circle */}
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-bold">
          P
        </div>

        {/* name + status */}
        <div>
          <div className="font-medium">Prof. Williams</div>
          <div className="text-xs text-white/80">Request accepted</div>
        </div>

        {/* Close chat button */}
        <button
          className="ml-auto text-sm opacity-70 hover:opacity-100"
          onClick={() => alert("Close chat clicked")}
        >
          ✕
        </button>

        {/* Header actions (UI only for now) */}
        <div className="ml-auto flex items-center gap-2">
          <button
            className="h-9 w-9 rounded-md hover:bg-white/15 flex items-center justify-center"
            title="Delete conversation"
            onClick={() => alert("Delete clicked")}
          >
            <MdDeleteOutline size={20} />
          </button>

          <button
            className="h-9 w-9 rounded-md hover:bg-white/15 flex items-center justify-center"
            title="Close"
            onClick={() => alert("Close clicked")}
          >
            <MdClose size={20} />
          </button>
        </div>
      </div>

      {/* ========================= */}
      {/*  MESSAGE LIST */}
      {/* ========================= */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted/30">
        {messages.map((m) => (
          <MessageBubble key={m.id} {...m} />
        ))}

        {/* invisible anchor for auto scroll */}
        <div ref={bottomRef} />
      </div>

      {/* ========================= */}
      {/*  INPUT AREA */}
      {/* ========================= */}
      <ChatInput onSend={send} />
    </div>
  );
}
