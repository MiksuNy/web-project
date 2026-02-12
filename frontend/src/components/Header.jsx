import CreatePostForm from "./CreatePostForm/CreatePostForm";

import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { MdLogin, MdLogout, MdSettings, MdShield } from "react-icons/md";

const Header = ({
  title = "HelpConnect",
  subtitle = "Connect with your community",
}) => {
  const navigate = useNavigate();
  const { user, userFetching, logout } = useAuth();

  const profileMenuRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  function profileIconClicked(e) {
    e.preventDefault();
    setShowProfileMenu(!showProfileMenu);
  }

  function closeProfileMenu(e) {
    if (showProfileMenu && !profileMenuRef?.current?.contains(e.target)) {
      setShowProfileMenu(false);
    }
  }

  document.addEventListener("mousedown", closeProfileMenu);

  return (
    <>
      <header className="flex justify-between items-center h-17.5 px-8 border-b border-border bg-background">
        {/* left */}
        <div
          className="flex items-center gap-3 text-green-600 select-none cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.svg"
            alt="HelpConnect logo"
            className="w-10 h-10 object-cover"
          />

          <div className="leading-tight">
            <h1 className="text-xl font-medium bg-linear-to-r from-green-600 to-gray-700 bg-clip-text text-transparent">
              {title}
            </h1>
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          </div>
        </div>

        {/* right side container */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/messages")}
            className="
    relative flex items-center gap-2
    px-5 py-2
    rounded-full
    bg-white
    border border-border
    text-foreground
    hover:bg-muted
    transition
    shadow-sm
  "
          >
            
            <span className="opacity-70"></span>

            <span className="font-medium opacity-80">Messages</span>

            {/* badge */}
            <span
              className="
      absolute -top-2 -right-2
      w-5 h-5
      flex items-center justify-center
      text-[11px] font-semibold
      text-white
      bg-red-500
      rounded-full
      shadow
    "
            >
              3
            </span>
          </button>

          {/* login / user area */}
          {!userFetching &&
            (!user ? (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-5 py-2 rounded-full button-primary"
              >
                <MdLogin />
                Log In
              </button>
            ) : (
              <>
                <div className="flex flex-row gap-2 items-center">
                  {/* Post button */}
                  <button
                    onClick={() => navigate("/#create-post")}
                    className="px-4 py-2 rounded-full button-primary"
                  >
                    Post
                  </button>

                  {/* Profile avatar */}
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden border border-accent bg-linear-150 from-green-600 to-gray-600 text-white font-bold flex justify-center items-center select-none cursor-pointer"
                    onClick={profileIconClicked}
                  >
                    {user.firstName.charAt(0).toUpperCase()}
                    {user.lastName.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Profile menu */}
                {showProfileMenu && (
                  <div
                    className="absolute top-16 right-8 w-48 bg-background border border-border rounded-lg shadow-lg z-50"
                    ref={profileMenuRef}
                  >
                    {user.role === "admin" && (
                      <span className="w-full flex items-center gap-2 px-4 py-2 hover:bg-accent/20 rounded-lg cursor-pointer select-none">
                        <MdShield />
                        Admin Panel
                      </span>
                    )}

                    <span className="w-full flex items-center gap-2 px-4 py-2 hover:bg-accent/20 rounded-lg cursor-pointer select-none">
                      <MdSettings />
                      Settings
                    </span>

                    <span
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-accent/20 rounded-lg cursor-pointer select-none"
                      onClick={async () => {
                        await logout();
                        navigate("/");
                      }}
                    >
                      <MdLogout />
                      Log Out
                    </span>
                  </div>
                )}
              </>
            ))}
        </div>
      </header>

      <CreatePostForm shown={false} />
    </>
  );
};

export default Header;
