import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const [received, setReceived] = useState([]);

  const [sent, setSent] = useState([]);
   useEffect(() => {
    const loadMessages = async () => {
      try {
        const rawToken =
          localStorage.getItem("token") ||
          JSON.parse(localStorage.getItem("user") || "{}")?.token ||
          "";
        const token = String(rawToken).replace(/^Bearer\s+/i, "").trim();

        const userObj = JSON.parse(localStorage.getItem("user") || "{}");
        const myId = userObj?.id || userObj?._id || userObj?.user?.id || userObj?.user?._id;

        const res = await fetch(`/api/chat/my-chats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || data?.error || "Failed to load chats");

        const mapped = (Array.isArray(data) ? data : []).map((c) => {
          const other = (c.participants || []).find((p) => String(p._id) !== String(myId));

          return {
            id: c._id,
            chatId: c._id,
            title: c.subject || "General",
            from: other
              ? `${other.firstName || ""} ${other.lastName || ""}`.trim() || other.email
              : "Unknown",
            text: c.lastMessage?.text || "Open chat",
            date: c.updatedAt ? new Date(c.updatedAt).toISOString().slice(0, 10) : "",
            accepted: true,
            connected: true,
          };
        });

        setReceived(mapped);
        setSent([]);
      } catch (err) {
        console.error(err);
      }
    };

    loadMessages();
  }, []);

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

  return (
    <main className="absolute py-10 z-0 left-0 right-0 top-0 bottom-0 flex items-center justify-center pt-17 pb-18">
      <div className="max-w-5xl w-full md:w-10/12 h-full mx-auto md:border-x border-slate-200 bg-white flex flex-col">
        {/* HEADER */}
        <div className="h-15 px-6 hidden md:flex items-center justify-between shrink-0">
          <span className="text-lg font-semibold">Messages</span>

          <Link
            to="/"
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <MdClose size={22} />
          </Link>
        </div>

        {/* TABS */}
        <div className="border-b border-t shrink-0">
          <div className="grid grid-cols-2 text-sm font-medium">
            <div
              onClick={() => setTab("received")}
              className={`relative py-4 flex items-center justify-center gap-2 transition hover:bg-gray-100
                ${tab === "received"
                  ? "text-green-700"
                  : "text-slate-600"
                }`}
            >
              <MdInbox size={18} />
              Received
              {received.length > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${tab === "received"
                  ? "bg-green-700"
                  : "bg-slate-700"
                  } text-white`}>
                  {received.length}
                </span>
              )}
              {tab === "received" && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-green-700" />
              )}
            </div>

            <div
              onClick={() => setTab("sent")}
              className={`relative py-4 flex items-center justify-center gap-2 transition hover:bg-gray-100
                ${tab === "sent"
                  ? "text-green-700"
                  : "text-slate-600"
                }`}
            >
              <MdSend size={18} />
              Sent
              {sent.length > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${tab === "sent"
                  ? "bg-green-700"
                  : "bg-slate-700"
                  } text-white`}>
                  {sent.length}
                </span>
              )}
              {tab === "sent" && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-green-700" />
              )}
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="p-6 space-y-6 overflow-y-auto">
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
                      "Needs Help"
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
                    <div className="flex flex-row gap-4">
                      <button
                        onClick={() => accept(m)}
                        className="button-primary flex items-center gap-2 justify-center text-nowrap"
                      >
                        <MdCheckCircle />
                        Accept
                      </button>

                      <button
                        onClick={() => decline(m)}
                        className="button-secondary flex items-center gap-2 justify-center text-nowrap text-black"
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
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            onClick={() => confirmConnection(m)}
                            className="button-primary flex items-center gap-2 justify-center text-nowrap"
                          >
                            <MdVerified />
                            Confirm Connection
                          </button>

                          <button
                            onClick={() => setActiveChat(m)}
                            className="button-secondary flex items-center gap-2 justify-center text-nowrap text-black"
                          >
                            <MdChatBubbleOutline />
                            Open Chat
                          </button>

                          <button
                            onClick={() => decline(m)}
                            className="button-secondary flex items-center gap-2 justify-center text-nowrap text-black"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {m.connected && (
                        <button
                          onClick={() => setActiveChat(m)}
                          className="button-secondary flex items-center gap-2 justify-center text-nowrap text-black"
                        >
                          <MdChatBubbleOutline />
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
