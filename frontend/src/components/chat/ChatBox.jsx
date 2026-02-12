import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function ChatBox() {
  
  const [messages, setMessages] = useState([
  { id: 1, text: "Hello 👋", mine: false, time: "10:00" },
  { id: 2, text: "hi", mine: true, time: "10:01", seen: true },
  { id: 3, text: "Got it 👍", mine: false, time: "10:02" },
]);


  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // send text
  const send = (text) => {
    const id = Date.now();

    setMessages((m) => [
      ...m,
      { id, text, mine: true, time: now(), seen: false },
    ]);

    // fake reply (DEV)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: id + 1, text: "Got it 👍", mine: false, time: now() },
      ]);
    }, 1200);

    // seen simulation
    setTimeout(() => {
      setMessages((m) =>
        m.map((x) => (x.id === id ? { ...x, seen: true } : x))
      );
    }, 1500);
  };

  // delete
  const removeMessage = (id) =>
    setMessages((m) => m.filter((x) => x.id !== id));

  // location send
  const sendLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const id = Date.now();
      setMessages((m) => [
        ...m,
        {
          id,
          mine: true,
          type: "location",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          time: now(),
          seen: false,
        },
      ]);
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto border border-border rounded-2xl bg-card shadow-lg flex flex-col h-[560px] overflow-hidden">

      {/* header */}
      <div className="flex items-center gap-3 p-3 border-b border-border bg-linear-to-r from-green-600 to-green-700 text-white">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
          P
        </div>
        <div>
          <div className="font-medium">Prof. Williams</div>
          <div className="text-xs text-white/80">online</div>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            {...m}
            onDelete={() => removeMessage(m.id)}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={send} onSendLocation={sendLocation} />
    </div>
  );
}

