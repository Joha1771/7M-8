import { create } from "zustand";
import { persist } from "zustand/middleware";

const ADMINS = [
  { username: "admin", password: "admin123", role: "Super Admin", avatar: "A" },
];

export const useAuthStore = create(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,

      login: ({ username, password }) => {
        const found = ADMINS.find(
          (a) => a.username === username && a.password === password
        );
        if (!found) return false;
        const { password: _, ...safeAdmin } = found;
        set({ admin: safeAdmin, isAuthenticated: true });
        return true;
      },

      logout: () => set({ admin: null, isAuthenticated: false }),
    }),
    {
      name: "nike-auth",
      partialize: (s) => ({ admin: s.admin, isAuthenticated: s.isAuthenticated }),
    }
  )
);
