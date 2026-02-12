import { useState } from "react";
import ChatBox from "@/components/chat/ChatBox";

export default function Messages() {
  const [tab, setTab] = useState("received");
  const [activeChat, setActiveChat] = useState(null);

  // fake data — بعداً از بک‌اند میاد
  const [received, setReceived] = useState([
    {
      id: 1,
      title: "Can drive you to appointments",
      from: "Emily R.",
      text: "I need a ride next Saturday. Are you available?",
      date: "2026-01-20",
    },
    {
      id: 2,
      title: "Free math tutoring",
      from: "David K.",
      text: "Can you help my son after school?",
      date: "2026-01-19",
    },
  ]);

  const [sent, setSent] = useState([]);

  // accept → move to sent
  const accept = (msg) => {
    setReceived((r) => r.filter((x) => x.id !== msg.id));
    setSent((s) => [{ ...msg, accepted: true }, ...s]);
  };

  // open chat
  if (activeChat) {
    return (
      <main className="max-w-5xl mx-auto py-8 px-4">
        <ChatBox />
      </main>
    );
  }

  const list = tab === "received" ? received : sent;

  return (
    <main className="max-w-5xl mx-auto py-8 px-4">
      {/* header bar — global theme */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        
        {/* top bar */}
        <div className="bg-primary text-primary-foreground px-6 py-3 font-semibold">
          Messages
        </div>

        {/* tabs */}
        <div className="flex border-b border-border text-sm">
          <button
            onClick={() => setTab("received")}
            className={`flex-1 py-3 font-medium ${
              tab === "received" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            Received ({received.length})
          </button>

          <button
            onClick={() => setTab("sent")}
            className={`flex-1 py-3 font-medium ${
              tab === "sent" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            Sent ({sent.length})
          </button>
        </div>

        {/* list */}
        <div className="p-6 space-y-4">
          {list.length === 0 && (
            <div className="text-muted-foreground text-sm">
              No messages
            </div>
          )}

          {list.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-border p-4 bg-background space-y-2"
            >
              <div className="text-xs text-muted-foreground">
                {m.date}
              </div>

              <div className="font-medium">
                Re: {m.title}
              </div>

              <div className="text-sm text-muted-foreground">
                From: {m.from}
              </div>

              <p className="text-sm">{m.text}</p>

              {/* actions */}
              <div className="flex gap-3 pt-2">
                {tab === "received" && (
                  <>
                    <button
                      onClick={() => accept(m)}
                      className="button-primary px-4 py-2 rounded-lg"
                    >
                      Accept
                    </button>

                    <button className="px-4 py-2 rounded-lg border border-border hover:bg-accent">
                      Decline
                    </button>
                  </>
                )}

                {tab === "sent" && m.accepted && (
                  <>
                    <button
                      onClick={() => setActiveChat(m)}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                    >
                      Open Chat
                    </button>

                    <button className="button-primary px-4 py-2 rounded-lg">
                      Confirm Connection
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

