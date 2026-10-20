"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Search, Panda, Tv, UsersRound } from "lucide-react";
import CatalogueSearch from "./CatalogueSearch";
import { focus } from "./tvSeries/TvUI";

function NavigationLinks({ pathname = "" }) {
  return (
    <nav
      aria-label="Main navigation"
      className="flex items-center gap-1 sm:gap-2"
    >
      {[
        ["/", "Movies", Film],
        ["/series", "TV Series", Tv],
        ["/anime", "Anime", Panda],
        ["/actors", "Actors", UsersRound],
      ].map(([href, label, Icon]) => {
        const active =
          href === "/"
            ? pathname === "/" || pathname.startsWith("/movies")
            : pathname.startsWith(href) ||
              (href === "/series" &&
                pathname.toLowerCase().startsWith("/tvseries"));
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${focus} ${active ? "text-white" : "text-white/60 hover:text-white"}`}
          >
            <Icon
              aria-hidden="true"
              className={`size-[18px] ${active ? "text-red-500" : ""}`}
            />
            <span className="hidden sm:inline">{label}</span>
            {active && (
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded bg-red-500"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function ActiveNavigation() {
  return <NavigationLinks pathname={usePathname()} />;
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
      <header className="fixed inset-x-0 top-0 z-40 px-3 py-4 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:px-5 md:px-10">
        <div className="flex items-center xl:px-6 justify-between gap-2 xl:container xl:mx-auto">
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
          <div className="flex items-center gap-1 sm:gap-5">
            <Suspense fallback={<NavigationLinks />}>
              <ActiveNavigation />
            </Suspense>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search movies and TV series"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              className={`flex min-h-11 cursor-pointer min-w-11 items-center justify-center gap-2 rounded-lg px-2 text-white/70 transition-colors hover:text-white ${focus}`}
            >
              <Search aria-hidden="true" className="size-5" />
              <span className="hidden text-sm lg:inline">Search</span>
              <kbd className="ml-1 hidden rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/40 xl:inline">
                Ctrl K
              </kbd>
            </button>
          </div>
        </div>
      </header>
      {searchOpen && <CatalogueSearch onClose={closeSearch} />}
    </>
  );
}
