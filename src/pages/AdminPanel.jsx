import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../config/axios";
import { AuthProvider, ProtectedRoute } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";
import { DashboardPage } from "./Admin/DashboardPage";
import { ProductsPage } from "./ProductsPage";
import { OrdersPage } from "./Admin/OrdersPage";
import { I18nProvider } from "../i18n";
import { ProductsAdminPage } from "./Admin/ProductsAdminPage";

function AdminPanel() {
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const res = await axiosInstance.get("/products");
      setProducts(Array.isArray(res.data) ? res.data : (res.data.data ?? []));
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const res = await axiosInstance.get("/orders");
      setOrders(Array.isArray(res.data) ? res.data : (res.data.data ?? []));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

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
        {page === "dashboard" && (
          <DashboardPage products={products} orders={orders} />
        )}
        {page === "products" && (
          <ProductsAdminPage
            products={products}
            setProducts={setProducts}
            loading={loadingProducts}
            onRefresh={fetchProducts}
          />
        )}
        {page === "orders" && (
          <OrdersPage
            orders={orders}
            setOrders={setOrders}
            loading={loadingOrders}
            onRefresh={fetchOrders}
          />
        )}
      </main>
    </div>
  );
}

export default function AdminApp() {
  return (
    <I18nProvider>
      <AuthProvider>
        <ProtectedRoute>
          <AdminPanel />
        </ProtectedRoute>
      </AuthProvider>
    </I18nProvider>
  );
}
