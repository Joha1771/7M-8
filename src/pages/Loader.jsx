import { useTranslation } from "../i18n/index";

export function Loader() {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 bg-white dark:bg-gray-950">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full dark:border-gray-800 animate-spin border-t-black dark:border-t-white" />
        </div>
        <span className="font-display text-xs tracking-[0.3em] uppercase text-gray-400 dark:text-gray-500 animate-pulse">
          {t.loader.loading}
        </span>
      </div>
    </div>
  );
}
