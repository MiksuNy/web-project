import { useState } from "react";
import { MdSend, MdLocationOn, MdAttachMoney } from "react-icons/md";

export default function ChatInput({ onSend, onSendLocation }) {
  const [text, setText] = useState("");

  const isEmpty = !text.trim();

  const send = () => {
    if (isEmpty) return;
    onSend(text.trim());
    setText("");
  };

  const chipLocation =
    "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium hover:bg-blue-200 transition";

  const chipFee =
    "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-600 text-sm font-medium hover:bg-green-200 transition";

  return (
    <div className="border-t border-slate-200 bg-white px-5 py-4">
      
      {/* Quick Buttons */}
      <div className="flex items-center gap-4 mb-3">
        <button
          type="button"
          onClick={() => onSendLocation?.()}
          className={chipLocation}
        >
          <MdLocationOn />
          Location
        </button>

        <button
          type="button"
          onClick={() => setText("What's the fee?")}
          className={chipFee}
        >
          <MdAttachMoney />
          Fee
        </button>
      </div>

      {/* Input + Send */}
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

        {/* Send Button */}
        <div
          role="button"
          aria-disabled={isEmpty}
          onClick={send}
          className={`h-12 w-12 rounded-xl 
            ${isEmpty
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-[#16A34A] hover:bg-[#15803D] active:bg-[#166534] text-white cursor-pointer"}
            flex items-center justify-center transition`}
        >
          <MdSend size={20} />
        </div>
      </div>
    </div>
  );
}