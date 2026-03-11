import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiHeart,
  FiUser,
  FiMessageCircle,
  FiArrowLeft,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/user_profile";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [chats] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const data = await apiRequest("/api/auth/userinfo");

      if (data?.user) {
        const profile = data.user;

        setUser({
          _id: profile._id,
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await apiRequest("/api/posts");

      const postsData = Array.isArray(data) ? data : data.posts || [];

      const myPosts = postsData.filter(
        (p) => p.author?._id === user?._id
      );

      setPosts(myPosts);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        Loading profile...
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      
      {/* Header */}
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
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-medium"
        >
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-green-600 to-gray-500" />

        <div className="p-6 relative">
          <div className="absolute -top-12 left-6 w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-gray-500 text-white flex justify-center items-center text-2xl font-bold border-4 border-white">
            {initials}
          </div>

          <div className="mt-14">
            <h3 className="text-lg font-semibold">{fullName}</h3>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <FiCalendar />
              Joined January 2024
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Stat icon={<FiHeart size={20} />} label="My Posts" count={posts.length} />
        <Stat icon={<FiUser size={20} />} label="Activity" count={posts.length} />
        <Stat icon={<FiMessageCircle size={20} />} label="Chats" count={chats.length} />
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="flex text-sm border-b border-border">
          {["posts", "activity", "chats"].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-3 cursor-pointer ${
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

          {/* POSTS */}
          {activeTab === "posts" &&
            posts.map((post) => (
              <div
                key={post._id || post.id}
                className="border border-border rounded-xl p-4"
              >
                <h3 className="font-semibold text-sm">{post.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {post.description}
                </p>
              </div>
            ))}

          {/* ACTIVITY */}
          {activeTab === "activity" &&
            posts.map((post) => (
              <div
                key={post._id}
                className="border border-border rounded-xl p-4"
              >
                <h3 className="font-semibold text-sm">{post.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {post.description}
                </p>
              </div>
            ))}

          {/* CHATS */}
          {activeTab === "chats" && (
            <div className="text-center text-sm text-muted-foreground">
              No chats yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, count }) {
  return (
    <div className="bg-card rounded-xl p-6 text-center shadow-md">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
        {icon}
      </div>

      <h4 className="font-semibold text-xl">{count}</h4>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}