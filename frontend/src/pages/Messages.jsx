import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "@/components/chat/ChatBox";
import {
  MdInbox,
  MdSend,
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdChatBubbleOutline,
  MdVerified,
} from "react-icons/md";

export default function Messages() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("received");
  const [activeChat, setActiveChat] = useState(null);

  const [received, setReceived] = useState([
    {
      id: 1,
      title: "Can drive you to appointments",
      from: "Emily R.",
      text: "Hi! I need a ride to my doctor appointment next Saturday. Would you be available?",
      date: "2026-01-20",
    },
    {
      id: 2,
      title: "Free math tutoring for kids",
      from: "David K.",
      text: "My son is struggling with algebra. Could you help him after school?",
      date: "2026-01-19",
    },
  ]);

  const [sent, setSent] = useState([]);

  // Accept → move to sent with accepted + connected flag
  const accept = (msg) => {
    setReceived((r) => r.filter((x) => x.id !== msg.id));
    setSent((s) => [{ ...msg, accepted: true, connected: false }, ...s]);
  };

  const decline = (msg) => {
    if (tab === "received")
      setReceived((r) => r.filter((x) => x.id !== msg.id));
    else setSent((s) => s.filter((x) => x.id !== msg.id));
  };

  // Confirm → mark as connected
  const confirmConnection = (msg) => {
    setSent((prev) =>
      prev.map((x) => (x.id === msg.id ? { ...x, connected: true } : x)),
    );
  };

  if (activeChat)
    return <ChatBox chat={activeChat} onBack={() => setActiveChat(null)} />;

  const list = tab === "received" ? received : sent;

  const greenBtn =
    "flex-1 h-11 rounded-full text-white font-semibold flex items-center justify-center gap-2 transition hover:opacity-90";

  const blueBtn =
    "flex-1 h-11 rounded-full text-white font-semibold flex items-center justify-center gap-2 transition hover:opacity-90";

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
        {/* HEADER */}
        <div className="h-[60px] px-6 flex items-center justify-between bg-gradient-to-r from-[#2F9E44] to-[#2C3E50] rounded-t-2xl">
          <span className="text-white text-lg font-semibold">Messages</span>

          <button
            onClick={() => navigate(-1)}
            className="text-white/80 hover:text-white transition"
            style={{ all: "unset", cursor: "pointer" }}
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* TABS */}
        <div className="bg-slate-100 border-b">
          <div className="grid grid-cols-2 text-sm font-medium">
            <button
              onClick={() => setTab("received")}
              className={`relative py-4 flex items-center justify-center gap-2 transition
                ${
                  tab === "received"
                    ? "bg-[#E6F4EA] text-[#15803D]"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
            >
              <MdInbox size={18} />
              Received
              {received.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                  {received.length}
                </span>
              )}
              {tab === "received" && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#15803D]" />
              )}
            </button>

            <button
              onClick={() => setTab("sent")}
              className={`relative py-4 flex items-center justify-center gap-2 transition
                ${
                  tab === "sent"
                    ? "bg-[#E6F4EA] text-[#15803D]"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
            >
              <MdSend size={18} />
              Sent
              {sent.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[#15803D] text-white">
                  {sent.length}
                </span>
              )}
              {tab === "sent" && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#15803D]" />
              )}
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="bg-slate-100/60 p-6 space-y-6">
          {list.length === 0 && (
            <div className="text-center text-slate-500 py-20">
              No new messages
            </div>
          )}

          {list.map((m) => {
            const isSent = tab === "sent";

            return (
              <div
                key={m.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-600">
                    {isSent && m.accepted ? (
                      <span className="text-green-700 flex items-center gap-1">
                        <MdCheckCircle /> Accepted
                      </span>
                    ) : (
                      "🔥 Needs Help"
                    )}
                  </span>
                  <span className="text-slate-400">{m.date}</span>
                </div>

                <h3 className="mt-4 text-lg font-bold">Re: {m.title}</h3>

                <p className="text-sm text-slate-600 mt-1">
                  {isSent ? `To: ${m.from}` : `From: ${m.from}`}
                </p>

                <p className="mt-3 text-sm italic text-slate-600">“{m.text}”</p>

                {/* ===== ACTIONS ===== */}
                <div className="mt-6">
                  {/* RECEIVED */}
                  {!isSent && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => accept(m)}
                        style={{ backgroundColor: "#15803D" }}
                        className={greenBtn}
                      >
                        <MdCheckCircle />
                        Accept
                      </button>

                      <button
                        onClick={() => decline(m)}
                        className="flex-1 h-11 rounded-full border-2 border-red-500 
                   text-red-600 bg-white font-semibold 
                   flex items-center justify-center gap-2"
                      >
                        <MdCancel size={18} />
                        Decline
                      </button>
                    </div>
                  )}

                  {/* SENT */}
                  {isSent && m.accepted && (
                    <>
                      {!m.connected && (
                        <div className="flex gap-4">
                          <button
                            onClick={() => setActiveChat(m)}
                            style={{ backgroundColor: "#1D4ED8" }}
                            className={blueBtn}
                          >
                            <MdChatBubbleOutline />
                            Open Chat
                          </button>

                          <button
                            onClick={() => confirmConnection(m)}
                            style={{ backgroundColor: "#15803D" }}
                            className={greenBtn}
                          >
                            <MdVerified />
                            Confirm Connection
                          </button>

                          <button
                            onClick={() => decline(m)}
                            className="h-11 px-6 rounded-full bg-slate-200 font-semibold"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {m.connected && (
                        <button
                          onClick={() => setActiveChat(m)}
                          className="w-full h-12 mt-4 rounded-2xl text-white font-semibold 
                     flex items-center justify-center gap-2 
                     transition hover:opacity-95"
                          style={{ backgroundColor: "#16A34A" }}
                        >
                          <MdChatBubbleOutline size={18} />
                          Open Chat
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
