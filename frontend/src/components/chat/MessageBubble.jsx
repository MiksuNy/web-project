import { useRef, useState } from "react";
import { MdDone, MdDoneAll, MdDelete } from "react-icons/md";

export default function MessageBubble({ text, mine, time, seen, type, lat, lng, onDelete })
 {

  {type === "location" ? (
  <a
    href={`https://www.google.com/maps?q=${lat},${lng}`}
    target="_blank"
    rel="noreferrer"
    className="underline font-medium"
  >
    📍 Open location in Google Maps
  </a>
) : (
  text
)}

  const startX = useRef(0);
  const [dx, setDx] = useState(0);

  // --- pointer works for mouse + touch (modern way) ---
  function onPointerDown(e) {
    startX.current = e.clientX;
  }

  function onPointerMove(e) {
    if (!startX.current) return;
    const diff = e.clientX - startX.current;

    // only allow left swipe
    if (diff < 0) setDx(Math.max(diff, -90));
  }

  function onPointerUp() {
    if (dx < -60) setDx(-90);
    else setDx(0);
    startX.current = 0;
  }

  return (
    <div className={`relative flex ${mine ? "justify-end" : "justify-start"}`}>
      
      {/* delete reveal background */}
      <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center">
        <button
          onClick={onDelete}
          className="h-9 w-9 rounded-md bg-destructive text-destructive-foreground flex items-center justify-center"
        >
          <MdDelete />
        </button>
      </div>

      {/* swipe layer */}
      <div
        style={{ transform: `translateX(${dx}px)` }}
        className="transition-transform duration-150 max-w-[75%]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div
          className={[
            "px-4 py-2 rounded-2xl text-sm shadow-sm",
            mine
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-background border border-border rounded-bl-md",
          ].join(" ")}
        >
          {text}
        </div>

        {/* meta row */}
        <div className={`mt-1 text-[11px] flex items-center gap-1 ${mine ? "justify-end" : ""}`}>
          {time && <span className="text-muted-foreground">{time}</span>}
          {mine && (
            seen
              ? <MdDoneAll size={14} className="text-green-600" />
              : <MdDone size={14} className="text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  );
}

