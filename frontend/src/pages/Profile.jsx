import { useState } from "react";
import {
  FiMail,
  FiCalendar,
  FiHeart,
  FiUser,
  FiMessageCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {/* Topbar */}
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
          className="button-primary w-auto px-4 py-2 rounded-md"
        >
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-green-600 to-gray-500" />

        <div className="p-6 relative">
          {/* Avatar */}
          <div className="absolute -top-12 left-6 w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-gray-500 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md">
            MI
          </div>

          <div className="mt-14 space-y-2">
            <h3 className="text-lg font-semibold">minoo</h3>
            <p className="text-muted-foreground">minoo@gmail.com</p>

            <div className="text-sm text-muted-foreground space-y-1 mt-3">
              <div className="flex items-center gap-2">
                <FiMail /> minoo@gmail.com
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar /> Joined January 2024
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Stat icon={<FiHeart />} label="Help Offers" color="text-green-600" />
        <Stat icon={<FiUser />} label="Help Requests" color="text-gray-600" />
        <Stat
          icon={<FiMessageCircle />}
          label="Connections"
          color="text-blue-600"
        />
      </div>

      {/* Tabs + Content */}
      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="flex text-sm border-b border-border">
          {["posts", "activity", "chats"].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-3 cursor-pointer transition
                ${
                  activeTab === tab
                    ? "bg-green-50 text-green-700 font-medium border-b-2 border-green-600"
                    : "text-muted-foreground hover:bg-muted"
                }`}
            >
              {tab === "posts" && "My Posts (0)"}
              {tab === "activity" && "Activity (0)"}
              {tab === "chats" && "Chats (0)"}
            </div>
          ))}
        </div>

        {/* Empty State */}
        <div className="p-12 text-center text-muted-foreground">
          <FiUser size={40} className="mx-auto mb-3 opacity-40" />

          {activeTab === "posts" && (
            <>
              <p className="font-medium text-foreground">No posts yet</p>
              <p className="text-sm mt-1">
                Create your first post to help others or request help
              </p>
            </>
          )}

          {activeTab === "activity" && (
            <p className="font-medium text-foreground">No activity yet</p>
          )}

          {activeTab === "chats" && (
            <p className="font-medium text-foreground">No chats yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* Stats Card */
function Stat({ icon, label, color }) {
  return (
    <div className="bg-card rounded-xl p-6 text-center shadow-md">
      <div
        className={`w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <h4 className="font-semibold text-xl">0</h4>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
