import {
  FaUser,
  FaMapMarkerAlt,
  FaCalendar,
  FaHandshake,
} from "react-icons/fa";
import { PiHandWavingFill } from "react-icons/pi";

const PostCard = ({ post }) => {
  if (!post) return null;

  return (
    <div className="bg-card text-card-foreground border rounded-lg overflow-hidden shadow-sm">
      {/* Image */}
      <div className="h-52 w-full overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-3 ${post.type === "offer" ? "bg-green-100" : "bg-gray-100"}`}>
        <div className="flex items-center gap-2 text-accent-foreground text-sm font-medium">
          {post.type === "offer" ? <FaHandshake /> : <PiHandWavingFill />}
          <span>
            {post.type === "offer" ? "I Can Help With" : "I Need Help With"}
          </span>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground ${post.type === "offer" ? "bg-green-800" : "bg-primary"}`}>
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="h-29 px-5 py-4 flex flex-col">
        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed h-full text-ellipsis overflow-hidden">
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
      </div>

      {/* Action */}
      <div className="px-5 pb-5">
        <button className={`w-full ${post.type === "offer" ? "button-primary" : "button-secondary"}`}>
          {post.type === "offer" ? "Request Help" : "Offer to Help"}
        </button>
      </div>
    </div>
  );
};


export default PostCard;
