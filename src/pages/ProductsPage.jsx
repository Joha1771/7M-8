import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { HeroBanner } from "./HeroBanner";
import { Loader } from "./Loader";
import { useTranslation } from "../i18n/index";
import axiosInstance from "../config/axios";

export function ProductsPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const PER_PAGE = 4;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/products");
        setProducts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const totalPages = Math.ceil(products.length / PER_PAGE);
  const visible = products.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  if (loading) return <Loader />;

  return (
    <div className="transition-colors duration-300 bg-white dark:bg-gray-950">
      <HeroBanner />

      {/* Section Header */}
      <div className="px-6 pt-16 pb-6 mx-auto max-w-7xl md:px-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-black font-display dark:text-white">
            {t.products.heading}
          </h2>
          <div className="flex items-center gap-3">
            <span className="font-sans text-sm text-gray-500 transition-colors cursor-pointer dark:text-gray-400 hover:text-black dark:hover:text-white">
              {t.products.shop}
            </span>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center justify-center text-black transition-colors border border-gray-300 rounded-full dark:border-gray-700 w-9 h-9 hover:border-black dark:hover:border-white dark:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="flex items-center justify-center text-black transition-colors border border-gray-300 rounded-full dark:border-gray-700 w-9 h-9 hover:border-black dark:hover:border-white dark:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 pb-24 mx-auto max-w-7xl md:px-10">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
          {visible.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
