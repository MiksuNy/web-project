import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import ChatBox from "@/components/chat/ChatBox";
import {
  getMyChats,
  getMyRequests,
  acceptChatRequest,
  getStoredToken,
  declineChatRequest,
} from "@/api/chat";
import {
  MdInbox,
  MdSend,
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdChatBubbleOutline,
  MdVerified,
} from "react-icons/md";
import { getSocket } from "@/api/socket";
import { getUnreadMap, incrementUnread, clearUnread } from "@/hooks/chatUnread";

export default function Messages() {
  const [tab, setTab] = useState("received");
  const [activeChat, setActiveChat] = useState(null);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [unreadMap, setUnreadMap] = useState(getUnreadMap());

  const activeChatIdRef = useRef("");

  useEffect(() => {
    activeChatIdRef.current = String(
      activeChat?.chatId || activeChat?.id || "",
    );
  }, [activeChat]);

  useEffect(() => {
    const token = getStoredToken();
    const socket = getSocket(token);

    const userObj = JSON.parse(localStorage.getItem("user") || "{}");
    const myId =
      userObj?._id ||
      userObj?.id ||
      userObj?.user?._id ||
      userObj?.user?.id ||
      "";

    const onNewMessage = (payload) => {
      if (!payload?.chatId) return;
      if (String(payload.sender) === String(myId)) return;

      const incomingChatId = String(payload.chatId);
      const openedChatId = activeChatIdRef.current;

      const date = payload.createdAt
        ? new Date(payload.createdAt).toISOString().slice(0, 10)
        : "";

      setSent((prev) =>
        prev.map((c) =>
          String(c.chatId) === incomingChatId
            ? { ...c, text: payload.text, date }
            : c,
        ),
      );

      // important condition
      if (incomingChatId === openedChatId) {
        clearUnread(incomingChatId);
        setUnreadMap(getUnreadMap());
        return;
      }

      incrementUnread(incomingChatId);
      setUnreadMap(getUnreadMap());
    };

    const onUnreadUpdated = () => setUnreadMap(getUnreadMap());

    socket.on("new_message", onNewMessage);
    window.addEventListener("chat:unread-updated", onUnreadUpdated);

    return () => {
      socket.off("new_message", onNewMessage);
      window.removeEventListener("chat:unread-updated", onUnreadUpdated);
    };
  }, []);

  const decodeUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?._id || payload?.id || payload?.sub || "";
    } catch {
      return "";
    }
  };

  const mapChatToCard = (c, myId, isPending = false) => {
    const participants = Array.isArray(c.participants) ? c.participants : [];

    const other = participants.find((p) => {
      const pid = typeof p === "string" ? p : p?._id;
      return String(pid) !== String(myId);
    });

    const otherId = typeof other === "string" ? other : other?._id;
    const otherName =
      typeof other === "string"
        ? other
        : `${other?.firstName || ""} ${other?.lastName || ""} (${other?.email || "Unknown"})`.trim() ||
          other?.email ||
          "Unknown";

    const status = c.status || (isPending ? "pending" : "accepted");
    const requestedById =
      typeof c.requestedBy === "string" ? c.requestedBy : c.requestedBy?._id;

    return {
      id: c._id,
      chatId: c._id,
      title: c.subject || "General",
      from: otherName,
      text: c.lastMessage?.text || "New request",
      date: c.updatedAt ? new Date(c.updatedAt).toISOString().slice(0, 10) : "",
      status,
      accepted: status === "accepted",
      connected: false,
      otherUserId: otherId,
      requestedBy: requestedById,
      isRequester: String(requestedById) === String(myId),
    };
  };

  const loadData = useCallback(async () => {
    try {
      const token = getStoredToken();
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      const myId =
        userObj?.id ||
        userObj?._id ||
        userObj?.user?.id ||
        userObj?.user?._id ||
        decodeUserIdFromToken(token);

      const [requestsRes, chatsRes] = await Promise.all([
        getMyRequests(token),
        getMyChats(token),
      ]);

      const reqList = (Array.isArray(requestsRes) ? requestsRes : []).map((c) =>
        mapChatToCard(c, myId, true),
      );

      const chatListRaw = (Array.isArray(chatsRes) ? chatsRes : []).map((c) =>
        mapChatToCard(c, myId, c.status === "pending"),
      );

      const chatList = chatListRaw.filter(
        (c) =>
          c.status === "accepted" ||
          c.status === "declined" ||
          (c.status === "pending" && c.isRequester),
      );

      setReceived(reqList);
      setSent(chatList);

      // If there are received requests, show that tab first; otherwise Chats.
      setTab(reqList.length > 0 ? "received" : "sent");
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const onChatUpdated = () => loadData();
    window.addEventListener("chat:updated", onChatUpdated);
    return () => window.removeEventListener("chat:updated", onChatUpdated);
  }, [loadData]);

  const confirmConnection = (msg) => {
    setSent((prev) =>
      prev.map((x) => (x.id === msg.id ? { ...x, connected: true } : x)),
    );
  };

  const accept = async (msg) => {
    try {
      const token = getStoredToken();
      await acceptChatRequest(msg.chatId || msg.id, token);

      setReceived((r) => {
        const next = r.filter((x) => x.id !== msg.id);
        if (next.length === 0 && tab === "received") setTab("sent"); // NEW
        return next;
      });

      setSent((s) => [
        { ...msg, status: "accepted", accepted: true, connected: false },
        ...s,
      ]);
      window.dispatchEvent(new Event("chat:updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const decline = async (msg) => {
    if (tab === "received") {
      try {
        const token = getStoredToken();
        await declineChatRequest(msg.chatId || msg.id, token);
      } catch (err) {
        console.error(err);
      }

      setReceived((r) => {
        const next = r.filter((x) => x.id !== msg.id);
        if (next.length === 0) setTab("sent"); // NEW
        return next;
      });

      setSent((s) => [
        { ...msg, status: "declined", accepted: false, connected: false },
        ...s.filter((x) => x.id !== msg.id),
      ]);
      window.dispatchEvent(new Event("chat:updated"));
      return;
    }

    setSent((s) => s.filter((x) => x.id !== msg.id));
  };

  if (activeChat) {
    return (
      <ChatBox
        chat={activeChat}
        onBack={() => {
          setActiveChat(null);
          loadData();
        }}
        onChanged={loadData}
      />
    );
  }

  const list = tab === "received" ? received : sent;
  const openChat = (m) => {
    clearUnread(String(m.chatId || m.id));
    setUnreadMap(getUnreadMap());
    setActiveChat(m);
  };

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
                ${tab === "received" ? "text-green-700" : "text-slate-600"}`}
            >
              <MdInbox size={18} />
              Received requests
              {received.length > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    tab === "received" ? "bg-green-700" : "bg-slate-700"
                  } text-white`}
                >
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
                ${tab === "sent" ? "text-green-700" : "text-slate-600"}`}
            >
              <MdSend size={18} />
              Chats
              {sent.length > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    tab === "sent" ? "bg-green-700" : "bg-slate-700"
                  } text-white`}
                >
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
            const isUnread = !!unreadMap[String(m.chatId || m.id)];

            return (
              <div
                key={m.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-600">
                    {isSent ? (
                      m.status === "accepted" ? (
                        <span className="text-green-700 flex items-center gap-1">
                          <MdCheckCircle /> Accepted
                        </span>
                      ) : m.status === "declined" ? (
                        <span className="text-red-600 flex items-center gap-1">
                          <MdCancel /> Declined
                        </span>
                      ) : (
                        <span className="text-amber-600 flex items-center gap-1">
                          <MdInbox /> Pending
                        </span>
                      )
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

                <p className="text-xs text-slate-400 mt-1">
                  Chat ID: {m.chatId || m.id}
                </p>

                <p
                  className={`mt-3 text-sm italic flex items-center gap-2 ${
                    isUnread ? "font-bold text-slate-900" : "text-slate-600"
                  }`}
                >
                  {isUnread && (
                    <span className="inline-block w-3 h-3 rounded-full bg-red-600" />
                  )}
                  “{m.text}”
                </p>

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
                  {isSent && m.status === "accepted" && (
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
                            onClick={() => openChat(m)}
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
                          onClick={() => openChat(m)}
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
