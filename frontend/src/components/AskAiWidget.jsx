import { useState } from "react";
import { askAi } from "@/api/ai";
import { useAuth } from "@/context/AuthContext";

export default function AskAiWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return null;

  const onAsk = async (e) => {
    e.preventDefault();

    const text = question.trim();
    if (!text) return;

    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);
    setError("");

    try {
      const reply = await askAi(text);
      setMessages((prev) => [...prev, { role: "ai", text: reply || "No response." }]);
    } catch (err) {
      setError(err.message || "Could not get AI response");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[1100] rounded-full !bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-blue-700"
      >
        Ask AI
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 z-[1100] w-[340px] rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-100 shadow-xl md:bottom-5 md:right-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Ask AI</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded px-2 py-1 text-xs text-slate-200 !bg-gray-600 hover:bg-slate-700"
        >
         ▼
        </button>
      </div>

      <div className="mb-2 max-h-56 overflow-y-auto rounded-lg border border-slate-700 bg-slate-950 p-2">
        {messages.length === 0 ? (
          <p className="text-xs text-slate-400">Start by asking a question.</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-slate-700 text-slate-100"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={onAsk} className="space-y-2">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something..."
          rows={3}
          className="w-full resize-none rounded border border-slate-600 bg-slate-800 px-2 py-2 text-sm text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="w-full rounded !bg-gray-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
