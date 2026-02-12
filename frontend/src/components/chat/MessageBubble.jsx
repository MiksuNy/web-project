import { useRef } from "react";
import { MdDone, MdDoneAll } from "react-icons/md";

export default function MessageBubble({ text, mine, time, seen, onDelete }) {
  const startX = useRef(0);

  function onTouchStart(e) {
    startX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;

    // swipe left threshold
    if (diff > 70) onDelete?.();
  }

  return (
    <div
      className={`flex ${mine ? "justify-end" : "justify-start"}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="max-w-[70%]">
        <div
          className={[
            "px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm",
            mine
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-background border border-border rounded-bl-md",
          ].join(" ")}
        >
          {text}
        </div>

        {time && (
          <div
            className={`mt-1 text-[11px] flex items-center gap-1 ${mine ? "justify-end" : ""}`}
          >
            {time && <span className="text-muted-foreground">{time}</span>}

            {mine &&
              (seen ? (
                <MdDoneAll size={14} className="text-green-600" />
              ) : (
                <MdDone size={14} className="text-muted-foreground" />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
