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

  document.addEventListener('mousedown', closeProfileMenu);

  return (
    <>
      <header className="flex justify-between items-center h-17.5 px-8 border-b border-border bg-background">
        {/* left */}
        <div className="flex items-center gap-3 text-green-600 select-none cursor-pointer" onClick={() => navigate("/")}>
          <img
            src="/logo.svg"
            alt="HelpConnect logo"
            className="w-10 h-10 object-cover"
          />

          <div className="leading-tight">
            <h1 className="text-xl font-medium bg-linear-to-r from-green-600 to-gray-700 bg-clip-text text-transparent">{title}</h1>
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          </div>
        </div>

        {/* right - login CTA */}
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
              <div className="flex flex-row gap-2">

                {/* Other header items go here */}

                <div className="w-10 h-10 rounded-full overflow-hidden border border-accent bg-linear-150 from-green-600 to-gray-600 text-white font-bold flex justify-center items-center select-none cursor-pointer" onClick={profileIconClicked}>
                  {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                </div>

              </div>

              {/* Profile menu dropdown */}
              {showProfileMenu && (
                <div className="absolute top-16 right-8 w-48 bg-background border border-border rounded-lg shadow-lg z-50" ref={profileMenuRef}>

                  {user.role === "admin" && (
                    <span
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-accent/20 rounded-lg cursor-pointer select-none"
                    >
                      <MdShield />
                      Admin Panel
                    </span>
                  )}

                  <span
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-accent/20 rounded-lg cursor-pointer select-none"
                  >
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
          ))
        }
      </header>

      <CreatePostForm shown={false} />
    </>
  );
};

export default Header;
