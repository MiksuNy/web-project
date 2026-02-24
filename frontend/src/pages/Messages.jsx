// src/pages/Messages.jsx

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

  // Active tab state (received / sent)
  const [tab, setTab] = useState("received");

  // When user opens chat, we store selected message here
  const [activeChat, setActiveChat] = useState(null);

  // Received messages list
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

  // Sent messages list
  const [sent, setSent] = useState([]);

  // Accept message → move from received to sent
  const accept = (msg) => {
    setReceived((r) => r.filter((x) => x.id !== msg.id));
    setSent((s) => [{ ...msg, accepted: true, connected: false }, ...s]);
  };

  // Decline message → remove from current tab
  const decline = (msg) => {
    if (tab === "received")
      setReceived((r) => r.filter((x) => x.id !== msg.id));
    else setSent((s) => s.filter((x) => x.id !== msg.id));
  };

  // Confirm connection → mark as connected
  const confirmConnection = (msg) => {
    setSent((s) =>
      s.map((x) => (x.id === msg.id ? { ...x, connected: true } : x)),
    );
  };

  // If chat is active → render ChatBox instead of list
  if (activeChat)
    return <ChatBox chat={activeChat} onBack={() => setActiveChat(null)} />;

  // Decide which list to render
  const list = tab === "received" ? received : sent;

  // Reusable green button style (Accept / Confirm)
  const greenBtn =
    "flex-1 h-11 rounded-full text-white font-semibold flex items-center justify-center gap-2 transition hover:opacity-90";

  // Reusable blue button style (Open Chat)
  const blueBtn =
    "flex-1 h-11 rounded-full text-white font-semibold flex items-center justify-center gap-2 transition hover:opacity-90";

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
        {/* ===== HEADER (Gradient Bar) ===== */}
        <div
          className="h-[60px] px-6 flex items-center justify-between 
                     bg-gradient-to-r from-[#2F9E44] to-[#2C3E50] 
                     rounded-t-2xl"
        >
          <span className="text-white text-lg font-semibold">Messages</span>

          {/* Close Button */}
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center 
                       text-white/80 hover:text-white transition"
          >
            <MdClose size={20} />
          </button>
        </div>
        {/* ===== Tabs Section ===== */}
        <div className="bg-slate-100 border-b">
          <div className="grid grid-cols-2 text-sm font-medium">
            {/* Received Tab */}
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

            {/* Sent Tab */}
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

        {/* ===== MESSAGE LIST ===== */}
        <div className="bg-slate-100/60 p-6 space-y-6">
          {/* Empty State */}
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
                {/* Top Row: Status + Date */}
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

                {/* Title */}
                <h3 className="mt-4 text-lg font-bold">Re: {m.title}</h3>

                {/* From / To */}
                <p className="text-sm text-slate-600 mt-1">
                  {isSent ? `To: ${m.from}` : `From: ${m.from}`}
                </p>

                {/* Message Text */}
                <p className="mt-3 text-sm italic text-slate-600">“{m.text}”</p>

                {/* Accepted Info Box */}
                {isSent && m.accepted && (
                  <div className="mt-4 bg-green-100 border border-green-200 rounded-xl p-4 text-sm">
                    <b className="text-green-800">Good news!</b> You can now
                    connect with {m.from}.
                  </div>
                )}

                {/* ===== ACTION BUTTONS ===== */}
                <div className="mt-6 flex gap-4">
                  {/* Received → Accept / Decline */}
                  {!isSent && (
                    <>
                      <button
                        onClick={() => accept(m)}
                        style={{ backgroundColor: "#15803D" }}
                        className={greenBtn}
                      >
                        <MdCheckCircle /> Accept
                      </button>

                      <button
                        onClick={() => decline(m)}
                        className="flex-1 h-11 rounded-full border-2 border-red-400 text-red-600 bg-white font-semibold"
                      >
                        <MdCancel className="inline mr-1" />
                        Decline
                      </button>
                    </>
                  )}

                  {/* Sent & Accepted → Open / Confirm / Decline */}
                  {isSent && m.accepted && (
                    <>
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
