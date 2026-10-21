"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Film, MapPin } from "lucide-react";
import { FaFacebook, FaSquareXTwitter, FaYoutube } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";

const navigation = [
  { label: "Movies", href: "/" },
  { label: "Actors", href: "/actors" },
  { label: "TV series", href: "/series" },
  { label: "Anime & Donghua", href: "/anime" },
];

const socialPlatforms = [
  { label: "Facebook", Icon: FaFacebook },
  { label: "Instagram", Icon: RiInstagramFill },
  { label: "YouTube", Icon: FaYoutube },
  { label: "X", Icon: FaSquareXTwitter },
];

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-10 border-t border-gray-800 bg-black text-gray-100">
      <div className="xl:mx-auto xl:container px-6 sm:px-8  ">
        <div className="grid gap-x-12 gap-y-10 py-12 sm:grid-cols-2 sm:py-16 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label="MhdMovies home"
              className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gray-100"
            >
              <img
                src="https://inpdtdlijpglmifrebbg.supabase.co/storage/v1/object/public/images/logos/mhd.png"
                alt="MhdMovies"
                width={200}
                className="h-auto w-44 sm:w-48"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
              Your next great watch starts here. Explore movies, discover
              series, and find the stories you love.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gray-800 px-3 py-1.5 text-xs text-gray-400">
              <Film size={14} aria-hidden="true" />A world of stories, one
              place.
            </div>
          </div>

          <nav aria-labelledby="footer-explore-heading">
            <h2
              id="footer-explore-heading"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-100"
            >
              Explore
            </h2>
            <ul className="mt-5 space-y-1">
              {navigation?.map(({ label, href }) => (
                <li key={href + label}>
                  <Link
                    href={href}
                    className="group inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-gray-400 transition-colors hover:text-gray-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-100"
                  >
                    {label}
                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                      className="text-gray-600 transition-colors group-hover:text-gray-100 group-focus-visible:text-gray-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-100">
              MhdMovies
            </h2>
            <ul className="mt-5 space-y-1 text-sm text-gray-400">
              {/* Replace these labels with links when their pages are available. */}
              {["About", "Blog", "Partners"].map((label) => (
                <li key={label} className="flex min-h-11 items-center">
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-100">
              Stay connected
            </h2>
            <p className="mt-5 text-sm leading-7 text-gray-400">
              For everyone who loves a good story.
            </p>
            <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-gray-400">
              <MapPin
                size={16}
                className="mt-1 shrink-0 text-gray-500"
                aria-hidden="true"
              />
              <span>Dar es Salaam, Tanzania</span>
            </p>
            <div
              className="mt-5 flex gap-2"
              role="group"
              aria-label="Social media"
            >
              {/* Add verified profile URLs before enabling social links. */}
              {socialPlatforms.map(({ label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  disabled
                  aria-label={`${label} (coming soon)`}
                  title={`${label} - coming soon`}
                  className="flex cursor-pointer size-11 items-center justify-center rounded-full border border-gray-800 text-gray-500"
                >
                  <Icon size={17} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-800 py-6 text-xs leading-6 text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {currentYear !== null ? `${currentYear} ` : ""}MhdMovies. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
