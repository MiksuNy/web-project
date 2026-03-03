import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import { useAuth } from "./context/AuthContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import MobilePanel from "./components/MobilePanel";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Post from "./pages/Post";
import Messages from "@/pages/Messages";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/post" element={user ? <Post /> : <Navigate to="/" />} />
      </Routes>

      <MobilePanel />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
