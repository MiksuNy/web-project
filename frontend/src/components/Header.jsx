import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { MdLogin, MdLogout, MdSettings, MdShield } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

const Header = ({
  title = "HelpConnect",
  subtitle = "Connect with your community"
}) => {
  const navigate = useNavigate();
  const { user, userFetching, logout } = useAuth();

  const profileIconRef = useRef(null);

  const profileMenuRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  function profileIconClicked(e) {
    e.preventDefault();
    setShowProfileMenu(!showProfileMenu);
  }

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
      <header className="top-0 fixed md:relative flex gap-3 justify-between items-center w-full h-17.5 p-4 md:px-8 border-b border-border bg-background z-99">
        {/* mobile search bar */}
        <div className="md:hidden flex flex-row gap-2 py-2 px-3 items-center text-gray-500 border border-border rounded-full w-full shadow-md/5">
          <IoSearch /> Search...
        </div>

        {/* left */}
        <div className="md:flex hidden items-center gap-3 text-green-600 select-none cursor-pointer" onClick={() => navigate("/")}>
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
              <div className="flex flex-row gap-3 content-center">

                <button
                  className="md:flex hidden flex-row gap-2 justify-center items-center border-2 border-accent shadow-md bg-linear-150 from-green-600 to-gray-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 transition-colors px-4 py-1 rounded-full text-white select-none cursor-pointer"
                  onClick={() => navigate("/post")}>
                  <FaPlus />
                  Post
                </button>

                <div className="m-auto w-10 h-10 rounded-full overflow-hidden border border-accent shadow-md bg-linear-150 from-green-600 to-gray-600 text-white font-bold flex justify-center items-center select-none cursor-pointer" ref={profileIconRef} onClick={profileIconClicked}>
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
    </>
  );
};

export default Header;
