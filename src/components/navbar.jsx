"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavigationLinks({ pathname = "" }) {
  return (
    <nav
      aria-label="Main navigation"
      className="flex items-center gap-2 sm:gap-5"
    >
      {[
        ["/", "Movies"],
        ["/actors", "Actors"],
      ].map(([href, label]) => {
        const active =
          href === "/actors"
            ? pathname.startsWith("/actors")
            : pathname === "/" || pathname.startsWith("/movies");
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-xs font-medium transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400 sm:text-sm ${active ? "bg-white/10 text-white" : "text-white/60"}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function ActiveNavigation() {
  const pathname = usePathname();
  return <NavigationLinks pathname={pathname} />;
}

function Navbar() {
  return (
    <div className="fixed top-0 z-40 w-full p-4 text-white">
      <div className="flex items-center justify-between gap-5 px-1 sm:px-5 xl:container xl:mx-auto">
        {/* logo section */}
        <Link
          href="/"
          aria-label="MhdMovies home"
          className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400"
        >
          <img
            src="https://inpdtdlijpglmifrebbg.supabase.co/storage/v1/object/public/images/logos/mhd.png"
            alt="logo"
            className="h-8 w-auto"
          />
        </Link>
        <Suspense fallback={<NavigationLinks />}>
          <ActiveNavigation />
        </Suspense>
      </div>
    </div>
  );
}

export default Navbar;
