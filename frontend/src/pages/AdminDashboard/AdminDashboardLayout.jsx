import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import AdminDashboardSidePanel from "./AdminDashboardSidePanel";

export default function AdminDashboardLayout() {
  const { user, userFetching, logout } = useAuth();

  return (
    <div>

      <Header inAdminPanel fixed />

      <div className="absolute flex flex-row top-17.5 bottom-0 left-0 right-0">

        <AdminDashboardSidePanel />

        <div className="w-full h-full overflow-y-auto">
          <Outlet />
        </div>

      </div>

    </div>
  )
}
