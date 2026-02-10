//  React hooks — all in one import (FIX duplicate)
import { useState, useRef, useEffect } from "react";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatBox() {

  // message state — holds chat messages
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello 👋", mine: false },
  ]);

  // ref used for auto-scroll to bottom
  const bottomRef = useRef(null);

  // send handler — adds new message
  const send = (text) =>
    setMessages((m) => [...m, { id: Date.now(), text, mine: true }]);


  // auto scroll when messages change (PRO behavior)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    //main chat container — themed + fixed height
    <div className="border border-border rounded-xl bg-card shadow-sm flex flex-col `h-[520px]` overflow-hidden">

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
