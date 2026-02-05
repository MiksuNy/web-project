import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

export default function ChatBox() {
  return (
    <div className="flex flex-col h-[420px] rounded-lg border bg-card">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <MessageBubble text="Hello 👋" mine={false} />
        <MessageBubble text="Hi there!" mine />
      </div>

      <ChatInput />
    </div>
  );
}
