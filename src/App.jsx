import { useEffect } from "react";
import {
  useLocation,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import { Navbar } from "./pages/Navbar";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetail } from "./pages/ProductDetail";
import { I18nProvider } from "./i18n";
import { ThemeProvider } from "./pages/ThemeContext";
import AdminApp from "./pages/AdminPanel";
import { Footer } from "./pages/Footer";

function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return null;
}

function RootLayout() {
  return (
    <ThemeProvider>
      <I18nProvider>
        {/* dark: prefix работает благодаря class в tailwind.config */}
        <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-gray-950">
          <Navbar />
          <ScrollToHash />
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <ProductsPage /> },
      { path: "products/:id", element: <ProductDetail /> },
    ],
  },
  {
    path: "/admin", // ← отдельно, не внутри children
    element: (
      <I18nProvider>
        <AdminApp />
      </I18nProvider>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
