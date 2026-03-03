import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import AdminDashboardSidePanel from "./AdminDashboardSidePanel";

export default function AdminDashboardLayout() {
  const navigate = useNavigate();
  const { user, userFetching, logout } = useAuth();

  if (userFetching || !user) {
    return <></>;
  }

  if (user.role !== "admin") {
    navigate("/");
  }

  return (
    <div>

      <Header inAdminPanel fixed />

      <div className="absolute flex flex-row top-17.5 bottom-0 left-0 right-0">

        <AdminDashboardSidePanel />

        <div className="w-full h-full overflow-y-auto p-16">
          <div className="max-w-5xl m-auto h-full">
            <Outlet />
          </div>
        </div>

      </div>

    </div>
  );
}
