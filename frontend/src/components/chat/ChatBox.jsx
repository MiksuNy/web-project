import { useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello 👋", mine: false },
  ]);

  const send = (text) =>
    setMessages((m) => [...m, { id: Date.now(), text, mine: true }]);

  return (
    <div className="border rounded-xl bg-card flex flex-col h-[520px]">
      {/* --- Chat header with profile and status --- */}
      {/* chat header — themed */}
      <div className="flex items-center gap-3 border-b border-border p-3 bg-linear-to-r from-green-600 to-green-700 text-white">
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
          P
        </div>

        <div>
          <div className="font-medium">Prof. Williams</div>
          <div className="text-xs text-muted-foreground">Request accepted</div>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <MessageBubble key={m.id} {...m} />
        ))}
      </div>

      <ChatInput onSend={send} />
    </div>
  );
}
