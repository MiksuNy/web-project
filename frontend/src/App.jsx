import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./pages/MainLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import AdminDashboardSidePanel from "./pages/AdminDashboard/AdminDashboardLayout";
import MainPage from "./pages/AdminDashboard/pages/MainPage";
import PostsPage from "./pages/AdminDashboard/pages/PostsPage";
import UsersPage from "./pages/AdminDashboard/pages/UsersPage";
import ConnectionsPage from "./pages/AdminDashboard/pages/ConnectionsPage";
import AnalyticsPage from "./pages/AdminDashboard/pages/AnalyticsPage";
import ActivityPage from "./pages/AdminDashboard/pages/ActivityPage";
import Post from "./pages/Post";
import Messages from "@/pages/Messages";

function App() {
  const { user } = useAuth();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/post" element={user ? <Post /> : <Navigate to="/" />} />
          </Routes>

          <Route path="/admin" element={<AdminDashboardSidePanel />}>
            <Route index element={<MainPage />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="connections" element={<ConnectionsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="activity" element={<ActivityPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
