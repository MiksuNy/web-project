import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./pages/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboardLayout from "./pages/AdminDashboard/AdminDashboardLayout";
import AdminDashboardMain from "./pages/AdminDashboard/pages/AdminDashboardMain";
import AdminDashboardPosts from "./pages/AdminDashboard/pages/AdminDashboardPosts";
import AdminDashboardUsers from "./pages/AdminDashboard/pages/AdminDashboardUsers";
import AdminDashboardConnections from "./pages/AdminDashboard/pages/AdminDashboardConnections";
import AdminDashboardAnalytics from "./pages/AdminDashboard/pages/AdminDashboardAnalytics";
import AdminDashboardActivity from "./pages/AdminDashboard/pages/AdminDashboardActivity";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="/admin" element={<AdminDashboardLayout />}>
            <Route index element={<AdminDashboardMain />} />
            <Route path="posts" element={<AdminDashboardPosts />} />
            <Route path="users" element={<AdminDashboardUsers />} />
            <Route path="connections" element={<AdminDashboardConnections />} />
            <Route path="analytics" element={<AdminDashboardAnalytics />} />
            <Route path="activity" element={<AdminDashboardActivity />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
