// React hooks
import { useState, useRef, useEffect } from "react";
import { MdClose, MdDeleteOutline } from "react-icons/md";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatBox() {
  // messages state
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello", mine: false, time: "10:00" },
  ]);

  // scroll anchor ref
  const bottomRef = useRef(null);

  // auto scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // send text message + time + seen
  const send = (text) => {
    const id = Date.now();
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((m) => [
      ...m,
      { id, text, mine: true, time, seen: false },
    ]);

    setTimeout(() => {
      setMessages((m) =>
        m.map((x) => (x.id === id ? { ...x, seen: true } : x))
      );
    }, 1500);
  };

  // delete message
  const removeMessage = (id) => {
    setMessages((m) => m.filter((x) => x.id !== id));
  };

  // send location message
  const sendLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        const id = Date.now();
        const time = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        setMessages((m) => [
          ...m,
          {
            id,
            mine: true,
            type: "location",
            lat: latitude,
            lng: longitude,
            time,
            seen: false,
          },
        ]);

        setTimeout(() => {
          setMessages((m) =>
            m.map((x) => (x.id === id ? { ...x, seen: true } : x))
          );
        }, 1500);
      },
      () => alert("Location permission denied"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto border border-border rounded-2xl bg-card shadow-lg flex flex-col h-[560px] overflow-hidden">
      
      {/* header */}
      <div className="flex items-center gap-3 border-b border-border p-3 bg-linear-to-r from-green-600 to-green-700 text-white">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
          P
        </div>

        <div>
          <div className="font-medium">Prof. Williams</div>
          <div className="text-xs text-white/80">Request accepted</div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            className="h-9 w-9 rounded-md hover:bg-white/15 flex items-center justify-center"
            onClick={() => alert("Delete clicked")}
          >
            <MdDeleteOutline size={20} />
          </button>

          <button
            className="h-9 w-9 rounded-md hover:bg-white/15 flex items-center justify-center"
            onClick={() => alert("Close clicked")}
          >
            <MdClose size={20} />
          </button>
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

      {/* input */}
      <ChatInput onSend={send} onSendLocation={sendLocation} />
    </div>
  );
}
