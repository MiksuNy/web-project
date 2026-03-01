import { FiHome, FiInbox, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function MobilePanel() {
  const navigate = useNavigate();
  
  return (
    <div className="md:hidden fixed flex justify-evenly z-100 bottom-0 w-screen bg-background select-none pb-2 border shadow-2xl">
      <div className="flex flex-col items-center p-2 cursor-pointer active:text-green-600">
        <FiHome className="w-6 h-6" />
        <span>Home</span>
      </div>
      <div className="flex flex-col p-2 cursor-pointer w-16 h-16 rounded-full -translate-y-4 border-2 border-accent shadow-md bg-linear-150 from-green-600 to-gray-600 active:from-green-700 active:to-green-800 transition-colors text-white" onClick={() => navigate("/post")}>
        <FiPlus className="m-auto w-10 h-10" />
      </div>
      <div className="flex flex-col items-center p-2 cursor-pointer active:text-green-600">
        <FiInbox className="w-6 h-6" />
        <span>Messages</span>
      </div>
    </div>
  )
}
