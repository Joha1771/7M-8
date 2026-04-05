import { create } from "zustand";
import axiosInstance from "../Config/axios";

export const useAdminStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────
  products: [],
  orders: [],
  loadingProducts: false,
  loadingOrders: false,

  // ── Products ───────────────────────────────────────────
  fetchProducts: async () => {
    set({ loadingProducts: true });
    try {
      const res = await axiosInstance.get("/products");
      set({
        products: Array.isArray(res.data) ? res.data : (res.data.data ?? []),
      });
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      set({ loadingProducts: false });
    }
  },

  createProduct: async (formData) => {
    await axiosInstance.post("/products", formData);
    await get().fetchProducts();
  },

  updateProduct: async (id, formData) => {
    await axiosInstance.patch(`/products/${id}`, formData);
    await get().fetchProducts();
  },

  deleteProduct: async (id) => {
    await axiosInstance.delete(`/products/${id}`);
    await get().fetchProducts();
  },

  // ── Orders ─────────────────────────────────────────────
  fetchOrders: async () => {
    set({ loadingOrders: true });
    try {
      const res = await axiosInstance.get("/orders");
      set({
        orders: Array.isArray(res.data) ? res.data : (res.data.data ?? []),
      });
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      set({ loadingOrders: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    await axiosInstance.patch(`/orders/${id}`, { status });
    await get().fetchOrders();
  },
}));
