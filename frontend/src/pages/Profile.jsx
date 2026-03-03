import {
  FiMail,
  FiCalendar,
  FiHeart,
  FiUser,
  FiMessageCircle,
} from "react-icons/fi";
import { MdArrowBack, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">

      {/* Topbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-muted transition"
          >
            <MdArrowBack size={20} />
          </button>
          <h2 className="text-xl font-semibold">Profile</h2>
        </div>

        <button className="button-primary w-auto px-4 py-2 flex items-center gap-2 rounded-md">
          <MdEdit size={18} />
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-green-600 to-gray-500" />

        <div className="p-6 relative">
          <div className="absolute -top-12 left-6 w-24 h-24 rounded-full 
                          bg-gradient-to-br from-green-600 to-gray-500
                          text-white flex items-center justify-center 
                          text-2xl font-semibold border-4 border-white shadow-md">
            MI
          </div>

          <div className="mt-14 space-y-2">
            <h3 className="text-lg font-semibold">minoo</h3>
            <p className="text-muted-foreground">minoo@gmail.com</p>

            <div className="text-sm text-muted-foreground space-y-1 mt-3">
              <div className="flex items-center gap-2">
                <FiMail size={16} />
                minoo@gmail.com
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar size={16} />
                Joined January 2024
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Stat icon={<FiHeart />} label="Help Offers" />
        <Stat icon={<FiUser />} label="Help Requests" />
        <Stat icon={<FiMessageCircle />} label="Connections" />
      </div>

      {/* Tabs */}
      <div className="border-b flex gap-6 text-sm">
        <span className="border-b-2 border-green-600 pb-2 font-medium">
          My Posts (0)
        </span>
        <span className="pb-2 text-muted-foreground">Activity (0)</span>
        <span className="pb-2 text-muted-foreground">Chats (0)</span>
      </div>

      {/* Empty State */}
      <div className="bg-card rounded-xl p-10 text-center text-muted-foreground shadow-sm">
        <FiUser size={40} className="mx-auto mb-3" />
        <p className="font-medium">No posts yet</p>
        <p className="text-sm">Create your first post to help others</p>
      </div>
    </div>
  );
}

function Stat({ icon, label }) {
  return (
    <div className="bg-card rounded-xl p-6 text-center shadow-md space-y-2">
      <div className="flex justify-center text-lg text-green-600">
        {icon}
      </div>
      <h4 className="font-semibold text-lg">0</h4>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}