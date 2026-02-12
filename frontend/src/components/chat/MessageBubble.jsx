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

  const down = (e) => (startX.current = e.clientX);

  const move = (e) => {
    if (!startX.current) return;
    const diff = e.clientX - startX.current;
    if (diff < 0) setDx(Math.max(diff, -80));
  };

  const up = () => {
    if (dx < -60 && onDelete) onDelete();
    setDx(0);
    startX.current = 0;
  };

  return (
    <div className={`flex items-end gap-2 mb-3 ${mine ? "justify-end" : "justify-start"}`}>

      {/* avatar other */}
      {!mine && (
        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
          P
        </div>
      )}

      <div
        style={{ transform: `translateX(${dx}px)` }}
        className="transition-transform duration-150 max-w-[72%]"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        touchAction="pan-y"
      >
        <div
          className={[
            "px-4 py-2 rounded-2xl text-sm shadow-sm",
            mine
              ? "bg-green-600 text-white rounded-br-md"
              : "bg-white border border-border rounded-bl-md",
          ].join(" ")}
        >
          {type === "location" ? (
            <a
              href={`https://www.google.com/maps?q=${lat},${lng}`}
              target="_blank"
              rel="noreferrer"
              className="underline font-medium"
            >
              📍 Open location
            </a>
          ) : (
            text
          )}
        </div>

        <div className={`mt-1 text-[11px] flex gap-1 ${mine && "justify-end"}`}>
          <span className="text-muted-foreground">{time}</span>
          {mine &&
            (seen ? (
              <MdDoneAll size={14} className="text-green-600" />
            ) : (
              <MdDone size={14} className="text-muted-foreground" />
            ))}
        </div>
      </div>

      {/* swipe delete button */}
      {mine && (
        <button
          onClick={onDelete}
          className="ml-2 opacity-0 hover:opacity-100 transition bg-red-600 text-white rounded-full p-2"
        >
          <MdDelete size={16} />
        </button>
      )}
    </div>
  );
}

