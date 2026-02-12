import { useRef, useState } from "react";
import { MdDone, MdDoneAll, MdDelete } from "react-icons/md";

export default function MessageBubble({
  text,
  mine,
  time,
  seen,
  type,
  lat,
  lng,
  onDelete,
}) {
  const startX = useRef(0);
  const [dx, setDx] = useState(0);

  function onPointerDown(e) {
    startX.current = e.clientX;
  }

  function onPointerMove(e) {
    if (!startX.current) return;
    const diff = e.clientX - startX.current;
    if (diff < 0) setDx(Math.max(diff, -90));
  }

  function onPointerUp() {
    if (dx < -60) setDx(-90);
    else setDx(0);
    startX.current = 0;
  }

  return (
    <div className={`relative flex ${mine ? "justify-end" : "justify-start"}`}>

      {/* delete bg */}
      <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center">
        <button
          onClick={onDelete}
          className="h-9 w-9 rounded-md bg-red-600 text-white flex items-center justify-center"
        >
          <MdDelete />
        </button>
      </div>

      <div
        style={{ transform: `translateX(${dx}px)` }}
        className="transition-transform duration-150 max-w-[75%]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* bubble */}
        <div
          className={[
            "px-4 py-2 rounded-2xl text-sm shadow-sm",
            mine
              // ✅ سبز تم پروژه — نه primary
              ? "bg-gradient-to-r from-green-600 to-green-700 text-white rounded-br-md"
              : "bg-background border border-border rounded-bl-md",
          ].join(" ")}
        >
          {type === "location" ? (
            <a
              href={`https://www.google.com/maps?q=${lat},${lng}`}
              target="_blank"
              rel="noreferrer"
              className="underline font-medium text-white"
            >
              📍 Location
            </a>
          ) : (
            text
          )}
        </div>

        {/* meta */}
        <div className={`mt-1 text-[11px] flex items-center gap-1 ${mine ? "justify-end" : ""}`}>
          {time && <span className="text-muted-foreground">{time}</span>}
          {mine &&
            (seen ? (
              <MdDoneAll size={14} className="text-green-600" />
            ) : (
              <MdDone size={14} className="text-muted-foreground" />
            ))}
        </div>
      </div>
    </div>
  );
}
