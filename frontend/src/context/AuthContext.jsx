import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/auth";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [userFetching, setUserFetching] = useState(false);

  const fetchUser = async () => {
    if (userFetching) return;

    setUserFetching(true);
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const data = await api.me(token);
        setUser(data.user);
        setUserFetching(false);
      } catch (err) {
        console.error("Fetching user info failed:", err);
        localStorage.removeItem("token");
        setUser(null);
        setUserFetching(false);
      }
    } else {
      setUser(null);
      setUserFetching(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      localStorage.setItem("token", data.token);
      await fetchUser();
    } catch (err) {
      console.error("Login failed:", err.message);
      localStorage.removeItem("token");
      setUser(null);
      throw err;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
    } catch {
      console.error("Terminating session failed. Removing session only locally.");
    }
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userFetching, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
