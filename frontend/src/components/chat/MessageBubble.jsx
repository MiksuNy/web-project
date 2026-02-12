export default function MessageBubble({ text, mine, time }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[70%] px-3 py-2 rounded-lg text-sm
          ${
            mine
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }
        `}
      >
        

        {text}

        {time && (
          <div
            className={`mt-1 text-[11px] text-muted-foreground ${mine ? "text-right" : ""}`}
          >
            {time}
          </div>
        )}
      </div>
    </div>
  );
}
