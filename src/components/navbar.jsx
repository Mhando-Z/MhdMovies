"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Film, Search, Panda, Tv, UsersRound } from "lucide-react";
import { focus } from "./tvSeries/TvUI";
import CatalogueSearch from "./CatalogueSearch";

const NAV_ITEMS = [
  ["/", "Movies", Film],
  ["/series", "TV Series", Tv],
  ["/anime", "Anime", Panda],
  ["/actors", "Actors", UsersRound],
];

function isActive(href, pathname) {
  return href === "/"
    ? pathname === "/" || pathname.startsWith("/movies")
    : pathname.startsWith(href) ||
        (href === "/series" && pathname.toLowerCase().startsWith("/tvseries"));
}

/* Desktop (lg and up): links sit in the top header */
function DesktopLinks({ pathname = "" }) {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-2 lg:flex"
    >
      {NAV_ITEMS.map(([href, label, Icon]) => {
        const active = isActive(href, pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ${focus} ${active ? "text-white" : "text-white/60 hover:text-white"}`}
          >
            <Icon
              aria-hidden="true"
              className={`size-[18px] ${active ? "text-red-500" : ""}`}
            />
            <span>{label}</span>
            {active && (
              <motion.span
                layoutId="desktop-nav-indicator"
                aria-hidden="true"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded bg-red-500"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/* Mobile and tablet (below lg): app-style tab bar fixed to the bottom */
function BottomNav({ pathname = "" }) {
  return (
    <motion.nav
      aria-label="Main navigation"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/80 pb-[env(safe-area-inset-bottom)] text-white backdrop-blur-lg lg:hidden"
    >
      <div className="mx-auto grid max-w-xl grid-cols-4 px-2">
        {NAV_ITEMS.map(([href, label, Icon]) => {
          const active = isActive(href, pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition-colors ${focus} ${active ? "text-white" : "text-white/60"}`}
            >
              {/* {active && (
                <motion.span
                  layoutId="mobile-nav-indicator"
                  aria-hidden="true"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="absolute top-0 h-0.5 w-8 rounded-b bg-red-500"
                />
              )} */}
              <motion.span
                aria-hidden="true"
                whileTap={{ scale: 0.85 }}
                animate={{ y: active ? -2 : 0, scale: active ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="flex"
              >
                <Icon className={`size-5.5 ${active ? "text-red-500" : ""}`} />
              </motion.span>
              <span className={` ${active ? "text-red-500" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}

function ActiveDesktopLinks() {
  return <DesktopLinks pathname={usePathname()} />;
}

function ActiveBottomNav() {
  return <BottomNav pathname={usePathname()} />;
}

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const handleKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      {/* Top header: logo left, search right on mobile/tablet. No background. */}
      <header className="fixed inset-x-0 top-0 z-40 px-3 py-4 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:px-5">
        <div className="flex items-center justify-between gap-2 xl:container xl:mx-auto xl:px-6">
          <Link
            href="/"
            aria-label="MhdMovies home"
            className={`shrink-0 rounded ${focus}`}
          >
            <img
              src="https://inpdtdlijpglmifrebbg.supabase.co/storage/v1/object/public/images/logos/mhd.png"
              alt="MhdMovies"
              className="h-7 w-auto max-w-24 object-contain sm:h-8 sm:max-w-36"
            />
          </Link>
          <div className="flex items-center gap-1 lg:gap-5">
            <Suspense fallback={<DesktopLinks />}>
              <ActiveDesktopLinks />
            </Suspense>
            <motion.button
              type="button"
              onClick={() => setSearchOpen(true)}
              whileTap={{ scale: 0.9 }}
              aria-label="Search movies and TV series"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              className={`flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-2 text-white/70 transition-colors hover:text-white ${focus}`}
            >
              <Search aria-hidden="true" className="size-5" />
              <span className="hidden text-sm lg:inline">Search</span>
              <kbd className="ml-1 hidden rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/40 xl:inline">
                Ctrl K
              </kbd>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Bottom tab bar: mobile and tablet only */}
      <Suspense fallback={<BottomNav />}>
        <ActiveBottomNav />
      </Suspense>

      {searchOpen && <CatalogueSearch onClose={closeSearch} />}
    </>
  );
}
