import { IoCalendar, IoLocation, IoPeople } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";
import { useEffect, useState, useRef } from "react";
import { FaPencil, FaRegTrashCan } from "react-icons/fa6";

export default function AdminDashboardProductItem({ post, checked, onChange, onDeleteClicked }) {
  const [showContextMenu, setShowContextMenu] = useState(false);

  const contextMenuRef = useRef(null);
  const contextMenuButtonRef = useRef(null);

  function handleCheckboxChange(e) {
    onChange(e.target.checked);
  }

  function handleCardClick(e) {
    // ignore clicks inside context menu or button
    if (
      contextMenuRef.current?.contains(e.target) ||
      contextMenuButtonRef.current?.contains(e.target) ||
      e.target.type === "checkbox"
    ) return;

    onChange(!checked);
  }

  useEffect(() => {
    function close(e) {
      if (
        !contextMenuRef.current?.contains(e.target) &&
        !contextMenuButtonRef.current?.contains(e.target)
      ) {
        setShowContextMenu(false);
      }
    }

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className={`p-4 rounded-3xl shadow-md flex gap-4 ${checked ? "bg-gray-100" : "bg-background"} border border-border hover:bg-muted transition-colors select-none`} onClick={handleCardClick}>
      <div className="py-1 pl-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-row gap-2 justify-between items-center">
          <div className="flex flex-row gap-2 items-center">

            <div className={`flex items-center gap-2 text-accent-foreground text-sm font-medium ${post.type === "offer" ? "bg-green-300" : "bg-slate-300"} rounded-full px-3 py-2 font-semibold`}>
              <span className="-mt-0.5">
                {post.type === "offer" ? "Offer" : "Request"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-accent-foreground text-sm bg-gray-100 rounded-full px-3 py-2">
              <span className="-mt-0.5">
                {post.category}
              </span>
            </div>
          </div>

          <button className="w-8 h-8 flex items-center justify-center" onClick={() => setShowContextMenu(!showContextMenu)} ref={contextMenuButtonRef}>
            <HiDotsHorizontal className="w-4 h-4 absolute" />
          </button>

          {showContextMenu && <div className="absolute right-0 -translate-x-full translate-y-1/2 bg-background border border-border rounded-lg shadow-lg flex flex-col z-20" ref={contextMenuRef}>
            <span className="w-full flex items-center gap-2 px-4 py-2 hover:bg-accent/20 rounded-lg cursor-pointer select-none">
              <FaPencil />
              <span className="-mt-0.5">Edit</span>
            </span>
            <span className="w-full flex items-center gap-2 px-4 py-2 hover:bg-accent/20 rounded-lg cursor-pointer select-none text-red-500" onClick={onDeleteClicked}>
              <FaRegTrashCan />
              <span className="-mt-0.5">Delete</span>
            </span>
          </div>}

        </div>
        <strong>{post.title}</strong>
        <p>{post.description}</p>
        <div className="flex flex-row gap-4">
          <div className="flex flex-row gap-2 items-center">
            <IoPeople />
            <p className="-mt-0.5">{post.user}</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <IoLocation />
            <p className="-mt-0.5">{post.location}</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <IoCalendar />
            <p className="-mt-0.5">{post.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
