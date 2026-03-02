// DEV ONLY — Chat preview page
// lets us see ChatBox without login flow

import ChatBox from "@/components/chat/ChatBox";

export default function ChatTest() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <ChatBox />
    </div>
  );
}
