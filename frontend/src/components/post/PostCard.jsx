// PostCard.jsx
import { useState } from "react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaCalendar,
  FaHandshake,
  FaPaperPlane,
} from "react-icons/fa";
import { PiHandWavingFill } from "react-icons/pi";

const PostCard = ({ post, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  if (!post) return null;

  const isOffer = post.type === "offer";
  const canSend = subject.trim() && message.trim();

  const close = () => {
    setOpen(false);
    setSubject("");
    setMessage("");
  };

  const send = async () => {
    await onSubmit?.({
      postId: post.id,
      type: post.type,
      category: post.category,
      subject: subject.trim(),
      message: message.trim(),
    });
    close();
  };

  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg overflow-hidden shadow-sm flex flex-col">
      {/* Image */}
      <div className="h-52 w-full overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Header */}
      <div
        className={`flex items-center justify-between px-5 py-3 ${
          isOffer ? "bg-green-100" : "bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-2 text-accent-foreground text-sm font-medium">
          {isOffer ? <FaHandshake /> : <PiHandWavingFill />}
          <span>{isOffer ? "I Can Help With" : "I Need Help With"}</span>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
            isOffer ? "bg-green-800" : "bg-gray-600"
          }`}
        >
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </div>

      {/* Meta */}
      <div className="px-5 pb-4 space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <FaUser /> {post.user}
        </div>
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt /> {post.location}
        </div>
        <div className="flex items-center gap-2">
          <FaCalendar /> {post.date}
        </div>
        {post.budget ? (
          <div className="flex items-center gap-2">
            <span className="font-semibold">$</span> Budget: ${post.budget}
          </div>
        ) : null}
      </div>

      {/* Form */}
      {open ? (
        <div className="px-5 pb-4 space-y-3">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
            rows={4}
            className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-ring"
          />
        </div>
      ) : null}

      {/* Actions pinned bottom */}
      <div className="px-5 pb-5 mt-auto">
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={isOffer ? "button-primary" : "button-secondary"}
          >
            {isOffer ? "Request Help" : "Offer to Help"}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={send}
              disabled={!canSend}
              className={`${isOffer ? "button-primary" : "button-secondary"} ${
                !canSend ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <FaPaperPlane />
                {isOffer ? "Send Request" : "Send Offer"}
              </span>
            </button>

            <button
              type="button"
              onClick={close}
              className="rounded-lg px-4 py-3 text-sm font-semibold bg-muted text-muted-foreground hover:opacity-90 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;

