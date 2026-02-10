import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./pages/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminDashboardMain from "./pages/AdminDashboard/AdminDashboardMain";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminDashboardMain />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
