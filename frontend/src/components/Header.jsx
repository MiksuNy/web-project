import CreatePostForm from "./CreatePostForm/CreatePostForm";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { MdLogin, MdLogout, MdSettings, MdShield } from "react-icons/md";
import { FaInbox, FaPlus } from "react-icons/fa";
import { MdPerson } from "react-icons/md";

const Header = ({
  title = "HelpConnect",
  subtitle = "Connect with your community",
}) => {
  const navigate = useNavigate();
  const { user, userFetching, logout } = useAuth();

  const profileIconRef = useRef(null);
  const profileMenuRef = useRef(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  function profileIconClicked(e) {
    e.preventDefault();
    setShowProfileMenu((prev) => !prev);
  }

  // clean & correct version from main
  useEffect(() => {
    function handleClick(e) {
      if (
        showProfileMenu &&
        !profileMenuRef.current?.contains(e.target) &&
        !profileIconRef.current?.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showProfileMenu]);

  return (
    <>
      <header className="flex justify-between items-center h-17.5 px-8 border-b border-border bg-background z-99">
        {/* LEFT */}
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

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* LOGIN / USER AREA */}
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
                <div className="flex flex-row gap-3 content-center">
                  {/* Messages Button (your feature stays) */}
                  <button
                    onClick={() => navigate("/messages")}
                    className="relative flex items-center gap-2 px-4 py-1"
                  >
                    <FaInbox />
                    <span className="font-medium opacity-80">Messages</span>

                    {/* badge */}
                    <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-[11px] font-semibold text-white bg-red-500 rounded-full shadow">
                      3
                    </span>
                  </button>

                  {/* Post Button */}
                  <button
                    className="flex flex-row gap-2 justify-center items-center border-2 border-accent shadow-md bg-linear-150 from-green-600 to-gray-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 transition-colors px-4 py-1 rounded-full text-white select-none cursor-pointer"
                    onClick={() => setShowCreatePost(!showCreatePost)}
                  >
                    <FaPlus />
                    Post
                  </button>

                  {/* Profile Avatar */}
                  <div
                    className="m-auto w-10 h-10 rounded-full overflow-hidden border border-accent shadow-md bg-linear-150 from-green-600 to-gray-600 text-white font-bold flex justify-center items-center select-none cursor-pointer"
                    ref={profileIconRef}
                    onClick={profileIconClicked}
                  >
                    {user.firstName.charAt(0).toUpperCase()}
                    {user.lastName.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Profile Menu */}
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
                     
                     <span
                        onClick={() => {
                          navigate("/profile");
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-accent/20 rounded-lg cursor-pointer select-none"
                      >
                        <MdPerson />
                        Profile
                      </span>


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

      {showCreatePost && (
        <CreatePostForm onClose={() => setShowCreatePost(false)} />
      )}
    </>
  );
};

export default Header;
