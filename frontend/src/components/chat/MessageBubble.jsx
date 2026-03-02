
import { MdDone, MdDoneAll } from "react-icons/md";

export default function MessageBubble({
  text,
  mine,
  time,
  seen,
  type,
  lat,
  lng,
  senderName = "User",
}) {
  const initials = (senderName || "U")
    .split(" ")
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("");

  if (type === "system") {
    return (
      <div className="w-full flex justify-center">
        <div className="max-w-[560px] text-center text-sm px-4 py-2 rounded-lg bg-blue-100 text-blue-800 border border-blue-200">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 ${mine ? "justify-end" : "justify-start"}`}>
      {!mine && (
        <div className="w-10 shrink-0 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold text-sm">
            {initials}
          </div>
        </div>
      )}

      <div className="max-w-[760px] w-fit">
        {!mine && <div className="text-sm text-slate-600 mb-1">{senderName}</div>}

        <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 shadow-sm">
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

        <div className={`mt-1 flex items-center gap-2 text-xs ${mine ? "justify-end" : "justify-start"}`}>
          {time ? <span className="text-slate-400">{time}</span> : null}
          {mine ? (seen ? <MdDoneAll size={16} className="text-slate-500" /> : <MdDone size={16} className="text-slate-500" />) : null}
        </div>
      </div>
    </div>
  );
}