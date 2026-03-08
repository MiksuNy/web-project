import { BrowserRouter, Routes, Route } from "react-router-dom";
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

import Messages from "@/pages/Messages";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

import PostPage from "./pages/PostPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* MAIN APP */}
          <Route path="/" element={<MainLayout />}>

            <Route index element={<Home />} />

            <Route path="login" element={<Login />} />

            <Route path="register" element={<Register />} />
            <Route path="post/:id" element={<PostPage />} />

            {/* messages */}
            <Route path="messages" element={<Messages />} />

            {/* profile */}
            <Route path="profile" element={<Profile />} />

            <Route path="profile/edit" element={<EditProfile />} />

          </Route>


          {/* ADMIN DASHBOARD */}
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
