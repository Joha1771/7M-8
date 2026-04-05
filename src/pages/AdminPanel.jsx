import { useEffect } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { useAuthStore } from "../store/useAuthStore";
import { Sidebar } from "../components/Sidebar";
import { DashboardPage } from "./Admin/Dashboard";
import { OrdersPage } from "./Admin/OrdersPage";
import { ProductsAdminPage } from "./Admin/ProductsAdminPage";
import { LoginPage } from "./Admin/LogInPage";
import { I18nProvider } from "../i18n";
import { useState } from "react";

function AdminPanel() {
  const [page, setPage] = useState("dashboard");
  const { fetchProducts, fetchOrders } = useAdminStore();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0d0d0d",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        * { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
        .admin-input:focus { border-color: rgba(255,255,255,0.35) !important; outline: none; }
      `}</style>

      <Sidebar page={page} setPage={setPage} />

      <main style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>
        {page === "dashboard" && <DashboardPage />}
        {page === "products" && <ProductsAdminPage />}
        {page === "orders" && <OrdersPage />}
      </main>
    </div>
  );
}

// Protected wrapper — checks zustand auth store directly
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <LoginPage />;
  return children;
}

export default function AdminApp() {
  return (
    <I18nProvider>
      <ProtectedRoute>
        <AdminPanel />
      </ProtectedRoute>
    </I18nProvider>
  );
}
