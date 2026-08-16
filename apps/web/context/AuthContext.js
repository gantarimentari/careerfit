"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const setTokenAndCookie = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      document.cookie = `token=${newToken}; path=/; max-age=604800; SameSite=Lax`;
      setToken(newToken);
    } else {
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      setToken(null);
    }
  };

  const fetchUser = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }
    setToken(storedToken);
    try {
      const res = await api.get("/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setTokenAndCookie(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });
      const { user: userData, token: userToken } = res.data;
      setTokenAndCookie(userToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Gagal masuk. Periksa email dan password Anda.";
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post("/register", { name, email, password });
      const { user: userData, token: userToken } = res.data;
      setTokenAndCookie(userToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Gagal mendaftar. Silakan coba lagi.";
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.patch("/me", data);
      setUser(res.data);
      return { success: true, user: res.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Gagal memperbarui profil.";
      return { success: false, error: errorMessage };
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete("/me");
    } catch (err) {
      console.warn("Delete account error:", err);
    } finally {
      setTokenAndCookie(null);
      setUser(null);
      router.push("/login");
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.warn("Logout API call error:", err);
    } finally {
      setTokenAndCookie(null);
      setUser(null);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        updateProfile,
        deleteAccount,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
