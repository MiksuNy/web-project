import {
  FaUser,
  FaMapMarkerAlt,
  FaCalendar,
  FaHandshake,
} from "react-icons/fa";

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
      <div className="flex items-center justify-between px-5 py-3 bg-accent">
        <div className="flex items-center gap-2 text-accent-foreground text-sm font-medium">
          <FaHandshake />
          <span>
            {post.type === "offer" ? "I Can Help With" : "I Need Help With"}
          </span>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
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
        <button className="w-full py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
          {post.type === "offer" ? "Request Help" : "Offer to Help"}
        </button>
      </div>
    </div>
  );
};


export default PostCard;
