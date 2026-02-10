import { conversations } from "@/data/conversations";

export default function ConversationList({ activeId, onSelect }) {
  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      {/* Sidebar header */}
      <div className="p-4 border-b border-border">
        <div className="font-medium">Messages</div>
        <div className="text-xs text-muted-foreground">Your conversations</div>
      </div>

      {/* Conversation items */}
      <div className="p-2 space-y-1">
        {conversations.map((c) => {
          const active = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => onSelect?.(c.id)}
              className={[
                "w-full text-left p-3 rounded-lg flex gap-3 items-start",
                active ? "bg-accent" : "hover:bg-accent/40",
              ].join(" ")}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                {c.initials}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {c.time}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground truncate">
                  {c.lastMessage}
                </div>
              </div>

              {/* Unread badge */}
              {c.unread > 0 && (
                <div className="ml-1 mt-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {c.unread}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
