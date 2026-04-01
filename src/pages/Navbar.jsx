import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation, LANG_LABELS } from "../i18n/index";
import { useTheme } from "./ThemeContext";
import logo from "../assets/logo.svg";
/* ─── Sun Icon ────────────────────────────────────────────── */
function SunIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 3v1m0 16v1m8.66-13H20m-16 0H2.34M19.07 4.93l-.71.71M5.64 18.36l-.71.71M19.07 19.07l-.71-.71M5.64 5.64l-.71-.71M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z"
      />
    </svg>
  );
}

/* ─── Moon Icon ───────────────────────────────────────────── */
function MoonIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
      />
    </svg>
  );
}

/* ─── Navbar ─────────────────────────────────────────────── */
export function Navbar() {
  const navigate = useNavigate();
  const { t, lang, changeLang, langs } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center transition-colors duration-300 bg-white border-b border-gray-100 dark:bg-gray-950 dark:border-gray-800 animate-slide-down">
      <div className="max-w-[1344px] w-full mx-auto flex items-center justify-between px-8 py-4 transition-colors duration-300 bg-white border-b border-gray-100 dark:bg-gray-950 dark:border-gray-800 animate-slide-down">
        {/* Logo */}
        <img src={logo} alt="" />
        {/* Nav links */}
        <div className="items-center hidden gap-8 md:flex">
          {t.nav.links.map((item) => (
            <span
              key={item}
              className="font-sans text-sm text-gray-700 transition-colors cursor-pointer dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* ── Language Dropdown ── */}
          <div className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold font-sans transition-all
              border-gray-200 dark:border-gray-700
              text-gray-700 dark:text-gray-300
              hover:border-black dark:hover:border-white"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0c-2.5 2.5-4 5.7-4 10s1.5 7.5 4 10m0-20c2.5 2.5 4 5.7 4 10s-1.5 7.5-4 10M2 12h20"
                />
              </svg>
              {LANG_LABELS[lang]}
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown menu */}
            {langOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-2 overflow-hidden bg-white border border-gray-100 shadow-xl w-36 rounded-xl dark:bg-gray-900 dark:border-gray-700">
                  {langs.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        changeLang(l);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 font-sans text-sm transition-colors flex items-center justify-between
                      ${
                        lang === l
                          ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {LANG_LABELS[l]}
                      {lang === l && (
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Dark / Light Toggle (современный sliding toggle) ── */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative flex-shrink-0 transition-colors duration-300 bg-gray-200 rounded-full w-14 h-7 focus:outline-none dark:bg-gray-700"
          >
            {/* Sun — показывается в light mode */}
            <span
              className="absolute left-1.5 top-1/2 -translate-y-1/2 text-yellow-400
            transition-opacity duration-200 opacity-100 dark:opacity-0 pointer-events-none"
            >
              <SunIcon />
            </span>
            {/* Moon — показывается в dark mode */}
            <span
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-blue-400
            transition-opacity duration-200 opacity-0 dark:opacity-100 pointer-events-none"
            >
              <MoonIcon />
            </span>
            {/* Thumb */}
            <span
              className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow-md
            bg-white dark:bg-gray-950
            transition-transform duration-300 dark:translate-x-7 pointer-events-none"
            />
          </button>

          {/* ── Search ── */}
          <svg
            className="w-5 h-5 text-black transition-opacity cursor-pointer hover:opacity-60 dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>

          {/* ── Wishlist ── */}
          <svg
            className="w-5 h-5 text-black transition-opacity cursor-pointer hover:opacity-60 dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 0 1 6.364 0L12 7.636l1.318-1.318a4.5 4.5 0 1 1 6.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 0 1 0-6.364z"
            />
          </svg>

          {/* ── Bag ── */}
          <svg
            className="w-5 h-5 text-black transition-opacity cursor-pointer hover:opacity-60 dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
      </div>
    </nav>
  );
}
