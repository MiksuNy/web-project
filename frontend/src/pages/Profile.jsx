import { useState, useEffect } from "react";
import {
  FiMail,
  FiCalendar,
  FiHeart,
  FiUser,
  FiMessageCircle,
  FiArrowLeft,
} from "react-icons/fi";

import { useNavigate, useParams } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    fetchProfile();
    fetchPosts();
    fetchChats();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();

      if (data?.userProfile) {
        setUser({
          firstName: data.userProfile.firstName || "",
          lastName: data.userProfile.lastName || "",
          email: data.userProfile.email || "",
          phone: data.userProfile.phone || "",
          location: data.userProfile.location || "",
          bio: data.userProfile.description || "",
        });
      }
    } catch (err) {
      console.log("Profile endpoint not ready yet");
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();

      if (Array.isArray(data)) {
        setPosts(data);
      } else if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.log("Posts endpoint not ready yet");
    }
  };

  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chat");
      const data = await res.json();

      if (Array.isArray(data)) {
        setChats(data);
      } else if (data.messages) {
        setChats(data.messages);
      }
    } catch (err) {
      console.log("Chat endpoint not ready yet");
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">Loading profile...</div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FiArrowLeft />
          <h2 className="text-xl font-semibold">Profile</h2>
        </div>

        <button
          onClick={() => navigate("/profile/edit")}
          className="button-primary px-4 py-2 rounded-md"
        >
          Edit Profile
        </button>
      </div>

      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-green-600 to-gray-500" />

        <div className="p-6 relative">
          <div className="absolute -top-12 left-6 w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-gray-500 text-white flex justify-center items-center text-2xl font-bold border-4 border-white">
            {initials}
          </div>

          <div className="mt-14 space-y-2">
            <h3 className="text-lg font-semibold">{fullName}</h3>

            <div className="text-sm text-muted-foreground space-y-1 mt-3">
              <div className="flex items-center gap-2">
                <FiMail /> {user.email}
              </div>

              {user.phone && (
                <div className="flex items-center gap-2">📞 {user.phone}</div>
              )}

              {user.location && (
                <div className="flex items-center gap-2">
                  📍 {user.location}
                </div>
              )}

              {user.bio && (
                <div className="flex items-center gap-2">📝 {user.bio}</div>
              )}

              <div className="flex items-center gap-2">
                <FiCalendar /> Joined January 2024
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Stat icon={<FiHeart />} label="My Posts" count={posts.length} />
        <Stat icon={<FiUser />} label="Activity" count={posts.length} />
        <Stat icon={<FiMessageCircle />} label="Chats" count={chats.length} />
      </div>

      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="flex text-sm border-b border-border">
          {["posts", "activity", "chats"].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-3 cursor-pointer
${
  activeTab === tab
    ? "bg-green-50 text-green-700 border-b-2 border-green-600"
    : "text-muted-foreground hover:bg-muted"
}`}
            >
              {tab === "posts" && `My Posts (${posts.length})`}
              {tab === "activity" && `Activity (${posts.length})`}
              {tab === "chats" && `Chats (${chats.length})`}
            </div>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {activeTab === "posts" &&
            posts.map((post) => (
              <div
                key={post._id || post.id}
                className="border border-border rounded-xl p-4 flex justify-between"
              >
                <div>
                  <h3 className="font-semibold text-sm">{post.title}</h3>

                  <p className="text-xs text-muted-foreground">
                    {post.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, count }) {
  return (
    <div className="bg-card rounded-xl p-6 text-center shadow-md">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
        {icon}
      </div>

      <h4 className="font-semibold text-xl">{count}</h4>

      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
