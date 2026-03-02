import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./pages/MainLayout";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboardSidePanel from "./pages/AdminDashboard/AdminDashboardLayout";
import MainPage from "./pages/AdminDashboard/pages/MainPage";
import PostsPage from "./pages/AdminDashboard/pages/PostsPage";
import UsersPage from "./pages/AdminDashboard/pages/UsersPage";
import ConnectionsPage from "./pages/AdminDashboard/pages/ConnectionsPage";
import AnalyticsPage from "./pages/AdminDashboard/pages/AnalyticsPage";
import ActivityPage from "./pages/AdminDashboard/pages/ActivityPage";
import Messages from "@/pages/Messages";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="/messages" element={<Messages />} />
          </Route>

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
