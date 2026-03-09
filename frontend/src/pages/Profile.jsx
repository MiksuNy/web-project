import { useState, useEffect, useMemo } from "react";
import {
  FiMail,
  FiCalendar,
  FiHeart,
  FiUser,
  FiMessageCircle,
  FiArrowLeft,
  FiTrash2,
} from "react-icons/fi";

import { useNavigate, useLocation } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultUser = {
    name: "minoo",
    email: "minoo@gmail.com",
  };

  const [user, setUser] = useState(() => {
    if (location.state?.updatedUser) {
      return location.state.updatedUser;
    }

    const saved = localStorage.getItem("profile");
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [posts, setPosts] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");

  /* LOAD DATA */

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");

    const userPosts = savedPosts.filter(
      (p) => p.author?.toLowerCase() === user.name?.toLowerCase(),
    );

    setPosts(userPosts);

    const savedChats = JSON.parse(localStorage.getItem("messages") || "[]");

    const userChats = savedChats.filter(
      (c) => c.to === user.name || c.from === user.name,
    );

    setChats(userChats);
  }, [user.name]);

  /* SAVE USER */

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(user));
  }, [user]);
  /* ACTIVITY */

  const activity = useMemo(() => {
    return posts.map((p) => ({
      id: p.id,
      title: p.title,
      type: p.type,
    }));
  }, [posts]);

  /* DELETE POST */

  const deletePost = (id) => {
    const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");

    const updated = allPosts.filter((p) => p.id !== id);

    localStorage.setItem("posts", JSON.stringify(updated));

    setPosts(
      updated.filter(
        (p) => p.author?.toLowerCase() === user.name?.toLowerCase(),
      ),
    );
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FiArrowLeft />
          <h2 className="text-xl font-semibold">Profile</h2>
        </div>

        <button
          onClick={() => navigate("/profile/edit", { state: { user } })}
          className="button-primary w-auto px-4 py-2 rounded-md"
        >
          Edit Profile
        </button>
      </div>

      {/* PROFILE CARD */}

      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-green-600 to-gray-500" />

        <div className="p-6 relative">
          <div className="absolute -top-12 left-6 w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-gray-500 text-white flex justify-center items-center text-2xl font-bold border-4 border-white">
            {initials}
          </div>

          <div className="mt-14 space-y-2">
            <h3 className="text-lg font-semibold">{user.name}</h3>

            <div className="text-sm text-muted-foreground space-y-1 mt-3">
              <div className="flex items-center gap-2">
                <FiMail /> {user.email}
              </div>

              <div className="flex items-center gap-2">
                <FiCalendar /> Joined January 2024
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-4">
        <Stat icon={<FiHeart />} label="My Posts" count={posts.length} />
        <Stat icon={<FiUser />} label="Activity" count={activity.length} />
        <Stat icon={<FiMessageCircle />} label="Chats" count={chats.length} />
      </div>

      {/* TABS */}

      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="flex text-sm border-b border-border">
          {["posts", "activity", "chats"].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-3 cursor-pointer transition ${
                activeTab === tab
                  ? "bg-green-50 text-green-700 border-b-2 border-green-600"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab === "posts" && `My Posts (${posts.length})`}
              {tab === "activity" && `Activity (${activity.length})`}
              {tab === "chats" && `Chats (${chats.length})`}
            </div>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {/* POSTS */}

          {activeTab === "posts" &&
            (posts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No posts yet</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="border border-border rounded-xl p-4 flex justify-between items-start"
                >
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        {post.type === "offer" ? <FiHeart /> : <FiUser />}

                        {post.type === "offer"
                          ? "I Can Help With"
                          : "I Need Help With"}
                      </span>

                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="font-semibold text-sm">{post.title}</h3>

                    <p className="text-xs text-muted-foreground">
                      {post.description}
                    </p>
                  </div>

                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))
            ))}

          {/* ACTIVITY */}

          {activeTab === "activity" &&
            (activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet</p>
            ) : (
              activity.map((a) => (
                <div
                  key={a.id}
                  className="border border-border rounded-lg p-3 flex items-center gap-3"
                >
                  <FiUser />

                  <p className="text-sm">Posted: {a.title}</p>
                </div>
              ))
            ))}

          {/* CHATS */}

          {activeTab === "chats" &&
            (chats.length === 0 ? (
              <p className="text-sm text-muted-foreground">No chats yet</p>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => navigate("/messages")}
                  className="border border-border rounded-lg p-3 flex justify-between items-center cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {chat.subject || "Chat"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {chat.message}
                    </p>
                  </div>

                  <FiMessageCircle />
                </div>
              ))
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
