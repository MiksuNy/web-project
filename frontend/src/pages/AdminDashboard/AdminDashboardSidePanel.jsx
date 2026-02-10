import { IoSpeedometer, IoDocument, IoPeople, IoChatbubbles, IoBarChart, IoPulse } from "react-icons/io5";
import { useNavigate } from "react-router";

export default function AdminDashboardSidePanel() {
  const navigate = useNavigate();

  const items = [
    {
      icon: <IoSpeedometer />,
      text: "Dashboard",
      path: "/admin"
    },
    {
      icon: <IoDocument />,
      text: "Posts",
      path: "/admin/posts"
    },
    {
      icon: <IoPeople />,
      text: "Users",
      path: "/admin/users"
    },
    {
      icon: <IoChatbubbles />,
      text: "Connections",
      path: "/admin/connections"
    },
    {
      icon: <IoBarChart />,
      text: "Analytics",
      path: "/admin/analytics"
    },
    {
      icon: <IoPulse />,
      text: "Activity",
      path: "/admin/activity"
    },
  ];

  return (
    <div className="flex flex-col items-stretch min-w-60 p-2 border-r border-border bg-background z-40">
      {items.map(item =>
        <div
          onClick={() => navigate(item.path)}
          className="flex items-center gap-2 p-2 px-3 rounded-xl select-none cursor-pointer hover:bg-muted active:bg-muted-foreground">
          {item.icon}{item.text}
        </div>
      )}
    </div>
  )
}
