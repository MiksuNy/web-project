import { useState } from "react";
import { MdSend } from "react-icons/md";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  function handleSend() {
    if (!text.trim()) return;

    // call parent sender
    onSend(text);

    // clear input after send
    setText("");
  }

  function onKey(e) {
    // send on Enter
    if (e.key === "Enter") handleSend();
  }

  return (
    <div className="flex gap-2 p-3 border-t border-border bg-background">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKey}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 rounded-md bg-input-background border border-border outline-none"
      />

      {/* send button */}
      <button
        onClick={handleSend}
        className="px-3 rounded-md button-primary flex items-center justify-center"
      >
        <MdSend />
      </button>
    </div>
  );
}
