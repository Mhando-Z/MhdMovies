// "use client";

// import Link from "next/link";
// import { ArrowUpRight, Star } from "lucide-react";
// import { Artwork } from "@/components/pages/movieDetailsUI";
// import { focus } from "./TvUI";

// export default function TvSeriesPoster({ show }) {
//   return (
//     <Link
//       href={`/series/${show.id}`}
//       className={`group min-w-0 rounded-xl ${focus}`}
//     >
//       <div className="relative aspect-2/3 overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10">
//         <Artwork
//           path={show.poster_path}
//           alt={`${show.name} poster`}
//           className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
//         />
//         <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
//         <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/75 px-2 py-1 text-xs font-medium text-white">
//           <Star className="size-3 fill-amber-400 text-amber-400" />
//           {show.vote_average > 0 ? show.vote_average.toFixed(1) : "NR"}
//         </span>
//         <span className="absolute bottom-3 left-3 rounded border border-white/20 bg-black/40 px-2 py-1 text-[9px] font-semibold uppercase tracking-widest text-white/85">
//           Series
//         </span>
//         <ArrowUpRight className="absolute bottom-3 right-3 size-5 text-white/70 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
//       </div>
//       <h3 className="mt-3 truncate text-sm font-semibold text-white transition-colors group-hover:text-red-400">
//         {show.name}
//       </h3>
//       <p className="mt-1 text-xs text-white/45">
//         {show.first_air_date?.slice(0, 4) || "Date TBA"}
//       </p>
//     </Link>
//   );
// }

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Film, Play } from "lucide-react";

/* ---------------------------------------------------------------
 * Summarizer
 * Extractive: keeps whole sentences from the start of the text until
 * the character budget is reached. Falls back to a word-boundary cut
 * when even the first sentence is too long. Zero dependencies.
 * (Move this to lib/summarize.js if you want to reuse it.)
 * ------------------------------------------------------------- */
function summarize(text, maxChars = 140) {
  if (!text || typeof text !== "string") return "";

  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxChars) return clean;

  const sentences = clean.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) ?? [clean];

  let out = "";
  for (const sentence of sentences) {
    const next = `${out}${sentence}`.trim();
    if (next.length > maxChars) break;
    out = `${next} `;
  }
  if (out.trim()) return out.trim();

  return `${clean.slice(0, maxChars).replace(/\s+\S*$/, "")}…`;
}

/* ---------------------------------------------------------------
 * Poster image with skeleton + fallback
 * ------------------------------------------------------------- */
function PosterImage({ path, title, className }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!path || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-900 text-white/30 ${className}`}
      >
        <Film aria-hidden="true" className="size-10" />
        <span className="sr-only">Image unavailable for {title}</span>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-zinc-800 motion-reduce:animate-none"
        />
      )}
      <img
        src={`https://image.tmdb.org/t/p/w500${path.startsWith("/") ? path : `/${path}`}`}
        alt={title}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}

/* ---------------------------------------------------------------
 * Circular rating badge (0-10 scale)
 * ------------------------------------------------------------- */
function RatingRing({ rating }) {
  const hasRating =
    typeof rating === "number" && Number.isFinite(rating) && rating > 0;
  const pct = hasRating ? Math.min(rating, 10) * 10 : 0;

  const tone = !hasRating
    ? "stroke-white/20"
    : rating >= 7
      ? "stroke-emerald-400"
      : rating >= 5
        ? "stroke-amber-400"
        : "stroke-rose-400";

  return (
    <div
      className="relative size-10 rounded-full bg-black/70 backdrop-blur-md"
      role="img"
      aria-label={
        hasRating ? `Rated ${rating.toFixed(1)} out of 10` : "Not rated"
      }
    >
      <svg
        viewBox="0 0 36 36"
        className="size-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          strokeWidth="2.5"
          className="stroke-white/15"
        />
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={`${pct} 100`}
          className={`${tone} transition-[stroke-dasharray] duration-700 ease-out motion-reduce:transition-none`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold tabular-nums text-white">
        {hasRating ? rating.toFixed(1) : "NR"}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------
 * MoviePoster
 * New optional prop: `overview` (TMDB's `overview` field).
 * ------------------------------------------------------------- */
export default function MoviePoster({
  title = "Untitled movie",
  rating,
  image,
  image2,
  overview,
  id,
  preview = false,
}) {
  const summary = useMemo(() => summarize(overview, 140), [overview]);

  // Reveal on hover, keyboard focus, or when forced via `preview`.
  const reveal = preview
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0";

  return (
    <Link
      href={`/series/${id}`}
      aria-label={`View details for ${title}`}
      className="group block min-w-0 rounded-xl text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500"
    >
      <div
        className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10
                   shadow-lg shadow-black/40 transition duration-500 ease-out
                   motion-reduce:transition-none motion-safe:group-hover:-translate-y-1
                   group-hover:ring-white/25 group-hover:shadow-2xl group-hover:shadow-black/60
                   group-focus-visible:ring-white/25"
      >
        <PosterImage
          key={image}
          path={image}
          title={title}
          className={`h-full w-full object-cover transition duration-700 ease-out motion-reduce:transition-none
                      motion-safe:group-hover:scale-105 group-hover:brightness-75 group-focus-visible:brightness-75
                      ${preview ? "brightness-75" : ""}`}
        />

        {/* Rating */}
        <div className="absolute right-2 top-2 z-10">
          <RatingRing rating={rating} />
        </div>

        {/* Readability gradient */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent transition-opacity duration-500 motion-reduce:transition-none
                      ${preview ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}
        />

        {/* Hover content */}
        <div
          className={`absolute inset-x-0 bottom-0 flex flex-col gap-3 p-3.5 transition duration-500 ease-out motion-reduce:transition-none motion-reduce:translate-y-0 ${reveal}`}
        >
          <div className="flex items-center gap-2.5">
            {image2 && (
              <div className="relative hidden size-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white/60 sm:block">
                <PosterImage
                  key={image2}
                  path={image2}
                  title=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <span className="line-clamp-2 text-sm font-semibold leading-snug">
              {title}
            </span>
          </div>

          {summary && (
            <p className="line-clamp-4 text-xs leading-relaxed text-white/75">
              {summary}
            </p>
          )}

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition-colors duration-200 group-hover:bg-red-600 group-hover:text-white group-focus-visible:bg-red-600 group-focus-visible:text-white">
            <Play aria-hidden="true" className="size-3.5 fill-current" />
            View details
          </span>
        </div>
      </div>

      <h3 className="mt-3 hidden line-clamp-2 text-sm font-medium text-white/80 transition-colors duration-200 group-hover:text-white group-focus-visible:text-white">
        {title}
      </h3>
    </Link>
  );
}
