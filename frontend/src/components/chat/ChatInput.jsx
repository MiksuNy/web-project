import { FiSend } from "react-icons/fi";

export default function ChatInput() {
  return (
    <div className="flex gap-2 border-t p-3 bg-background">
      <input
        className="flex-1 rounded-md border bg-input-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
        placeholder="Type a message..."
      />

      <button className="rounded-md bg-primary px-3 text-primary-foreground hover:opacity-90">
        <FiSend size={18} />
      </button>
    </div>
  );
}
