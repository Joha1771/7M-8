import { createContext, useCallback, useContext, useState } from "react";
import { LoginPage } from "../pages/Admin/LoginPage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("admin_auth");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((credentials) => {
    if (
      credentials.username === "admin" &&
      credentials.password === "admin123"
    ) {
      const user = { username: "admin", role: "Admin", avatar: "A" };
      setAdmin(user);
      localStorage.setItem("admin_auth", JSON.stringify(user));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem("admin_auth");
  }, []);

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function ProtectedRoute({ children }) {
  const { admin } = useAuth();
  if (!admin) return <LoginPage />;
  return children;
}
