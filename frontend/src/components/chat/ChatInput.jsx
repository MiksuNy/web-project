// src/components/chat/ChatInput.jsx
import { useState } from "react";
import { MdSend, MdLocationOn, MdAttachMoney } from "react-icons/md";

export default function ChatInput({ onSend, onSendLocation }) {
  const [text, setText] = useState("");
  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const chip =
    "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 text-slate-700 text-sm font-medium";

  return (
    <div className="border-t border-slate-200 bg-white px-5 py-4">
      <div className="flex items-center gap-4 mb-3">
        <button type="button" onClick={() => onSendLocation?.()} className={chip}>
          <MdLocationOn /> Location
        </button>
        <button type="button" className={chip}>
          <MdAttachMoney /> Fee
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-12 rounded-xl border border-slate-200 bg-white flex items-center px-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            className="w-full outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <button
          type="button"
          onClick={send}
          className="h-12 w-12 rounded-xl bg-slate-200 hover:bg-slate-300 transition flex items-center justify-center"
          aria-label="Send"
        >
          <MdSend />
        </button>
      </div>
    </div>
  );
}