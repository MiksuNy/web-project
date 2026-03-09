import { FiHome, FiInbox, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function MobilePanel() {
  const navigate = useNavigate();

  const currentPage = window.location.pathname;

  const buttons = [
    { name: "Home", icon: <FiHome />, path: "/" },
    { name: "Post", icon: <FiPlus />, path: "/post", highlight: true, toggleClose: true },
    { name: "Messages", icon: <FiInbox />, path: "/messages", badge: 3 },
  ];

  return (
    <div className="md:hidden fixed flex justify-evenly z-100 bottom-0 w-screen bg-background select-none pb-2 border shadow-2xl">

      {buttons.map((btn, index) => (
        !btn.highlight ? (
          <Link
            key={index}
            to={btn.path}
            className={`flex flex-col gap-1 items-center p-2 pt-4 cursor-pointer text-2xl active:text-green-600 ${currentPage === btn.path ? "text-green-600" : ""}`}
          >
            {btn.icon}
            <span className="text-xs">{btn.name}</span>
            {btn.badge && (
              <span className="absolute translate-x-3 -translate-y-1.5 w-5 h-5 flex items-center justify-center text-xs font-semibold text-white bg-green-600 rounded-full shadow">
                {btn.badge}
              </span>
            )}
          </Link>
        ) : (
          <div key={index} className="flex flex-col p-2 cursor-pointer w-17 h-17 rounded-full -translate-y-2 border-2 border-accent shadow-md bg-linear-150 from-green-600 to-gray-600 active:from-green-700 active:to-green-800 transition-colors text-white" onClick={() => {
            if (btn.toggleClose && currentPage === btn.path) {
              navigate("/");
            } else {
              navigate(btn.path);
            }
          }}>
            <span className={`text-5xl flex justify-center ${btn.toggleClose && currentPage === btn.path ? "-rotate-45" : ""} transition-transform`}>{btn.icon}</span>
          </div>
        )
      ))}

    </div>
  )
}
