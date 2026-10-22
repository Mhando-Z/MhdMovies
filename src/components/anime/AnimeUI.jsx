// "use client";

// import Link from "next/link";
// import { BookOpen, Star } from "lucide-react";
// import { label } from "@/lib/anime/model";
// export {
//   button,
//   focus,
//   grid,
//   ResourceError,
//   CardSkeletons,
// } from "@/components/tvSeries/TvUI";

// export function AnimeArtwork({ src, alt = "", className = "", eager = false }) {
//   return (
//     <div className={`relative overflow-hidden bg-zinc-900 ${className}`}>
//       <BookOpen
//         aria-hidden="true"
//         className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-white/15"
//       />
//       {src && (
//         <img
//           src={src}
//           alt={alt}
//           loading={eager ? "eager" : "lazy"}
//           decoding="async"
//           onError={(event) => {
//             event.currentTarget.hidden = true;
//           }}
//           className="relative size-full object-cover"
//         />
//       )}
//     </div>
//   );
// }

// export function AnimeCard({ anime, subtitle, href }) {
//   return (
//     <Link
//       href={href || `/anime/${anime.id}`}
//       className="group min-w-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400"
//     >
//       <div className="relative overflow-hidden rounded-xl border border-white/10">
//         <AnimeArtwork
//           src={anime.cover}
//           alt={`${anime.title} poster`}
//           className="aspect-2/3 transition-transform duration-300 motion-safe:group-hover:scale-105"
//         />
//         <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-black/95 to-transparent px-3 pb-3 pt-12 text-[10px] font-semibold">
//           <span className="rounded bg-black/65 px-2 py-1">
//             {anime.country === "CN" ? "DONGHUA" : label(anime.format)}
//           </span>
//           {anime.score && (
//             <span className="flex items-center gap-1">
//               <Star className="size-3 fill-amber-400 text-amber-400" />
//               {anime.score.toFixed(1)}
//             </span>
//           )}
//         </div>
//       </div>
//       <h3 className="mt-3 text-sm line-clamp-1 font-medium leading-6 text-white/90 group-hover:text-red-400">
//         {anime.title}
//       </h3>
//       <p className="mt-1 text-xs leading-5 text-white/50">
//         {subtitle ||
//           `${anime.year || "TBA"} · ${label(anime.format)} · ${anime.episodes ? `${anime.episodes} eps` : "Episodes TBA"}`}
//       </p>
//     </Link>
//   );
// }

// export function SectionHeading({ eyebrow, title, href }) {
//   return (
//     <div className="mb-6 flex items-end justify-between gap-4">
//       <div>
//         {eyebrow && (
//           <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
//             {eyebrow}
//           </p>
//         )}
//         <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
//       </div>
//       {href && (
//         <Link
//           href={href}
//           className="shrink-0 rounded py-3 text-xs text-white/60 hover:text-white focus-visible:outline-2 focus-visible:outline-red-400"
//         >
//           View all <span aria-hidden="true">→</span>
//         </Link>
//       )}
//     </div>
//   );
// }

// export function AnimeLoading() {
//   return (
//     <main className="min-h-screen bg-black px-5 pb-20 pt-32 text-white md:px-10">
//       <div
//         className="mx-auto max-w-7xl motion-safe:animate-pulse"
//         role="status"
//       >
//         <span className="sr-only">Loading anime...</span>
//         <div className="mb-10 h-64 rounded-2xl bg-white/5" />
//         <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-6">
//           {Array.from({ length: 6 }, (_, i) => (
//             <div key={i} className="aspect-2/3 rounded-xl bg-white/10" />
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Play,
  Star,
} from "lucide-react";
import { label } from "@/lib/anime/model";
import { sameAnime, useAnimeLibrary, updateLibrary } from "./libraryStore";

export {
  button,
  focus,
  grid,
  ResourceError,
  CardSkeletons,
} from "@/components/tvSeries/TvUI";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const stripHtml = (text = "") =>
  text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isAiring = (anime) =>
  ["RELEASING", "AIRING", "ONGOING"].includes(
    String(anime?.status || "").toUpperCase(),
  );

/* -------------------------------------------------------------------------- */
/* Artwork: blur-up fade-in, graceful fallback                                */
/* -------------------------------------------------------------------------- */

export function AnimeArtwork({ src, alt = "", className = "", eager = false }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);

  // Cached images can finish loading before hydration attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-zinc-900 ${className}`}>
      <BookOpen
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-white/15"
      />
      {!loaded && !failed && src && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/6 to-transparent motion-safe:animate-pulse"
        />
      )}
      {src && !failed && (
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`relative size-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Card                                                                       */
/* -------------------------------------------------------------------------- */

const overlayParent = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.2, staggerChildren: 0.05, delayChildren: 0.04 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const overlayChild = (reduce) => ({
  hidden: { opacity: 0, y: reduce ? 0 : 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 30 },
  },
});

export function AnimeCard({
  anime,
  subtitle,
  href,
  watchHref,
  rank,
  saved: savedProp,
  onToggleSave,
  priority = false,
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const library = useAnimeLibrary();
  const [saveError, setSaveError] = useState(false);

  const saved = savedProp ?? library.some((item) => sameAnime(item, anime) && item.saved);
  const detailsHref = href || `/anime/${anime.id}`;
  const playHref = watchHref || `${detailsHref}#watch`;
  const synopsis = stripHtml(anime.description || anime.synopsis || "");
  const genres = Array.isArray(anime.genres) ? anime.genres.slice(0, 3) : [];
  const child = overlayChild(reduce);

  const toggleSave = () => {
    if (onToggleSave) onToggleSave(anime, !saved);
    else setSaveError(!updateLibrary(anime, { saved: !saved }));
  };

  return (
    <motion.article
      className="group relative min-w-0"
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      onFocusCapture={() => setActive(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setActive(false);
      }}
    >
      {/* Poster */}
      {saveError && <p role="status" className="mb-2 text-xs text-amber-300">Browser storage is unavailable.</p>}
      <div className="relative overflow-hidden rounded-xl border border-white/10 transition-colors duration-300 group-hover:border-red-400/50 group-focus-within:border-red-400/50 group-hover:shadow-[0_20px_50px_-12px_rgba(248,113,113,0.35)]">
        <motion.div
          animate={{ scale: active && !reduce ? 1.08 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimeArtwork
            src={anime.cover}
            alt={`${anime.title} poster`}
            eager={priority}
            className="aspect-2/3"
          />
        </motion.div>

        {/* Stretched link: the whole poster opens the details page */}
        <Link
          href={detailsHref}
          prefetch={false}
          aria-label={`${anime.title} details`}
          className="absolute inset-0 z-10 rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-red-400"
        />

        {/* Persistent bottom bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-black/95 to-transparent px-3 pb-3 pt-12 text-[10px] font-semibold">
          <span className="rounded bg-black/65 px-2 py-1 backdrop-blur-sm">
            {anime.country === "CN" ? "DONGHUA" : label(anime.format)}
          </span>
          {anime.score && (
            <span className="flex items-center gap-1">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {anime.score.toFixed(1)}
            </span>
          )}
        </div>

        {/* Top-left badges */}
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1.5">
          {rank && (
            <span className="rounded-md bg-red-500 px-2 py-1 text-[11px] font-bold leading-none text-white shadow-lg">
              #{rank}
            </span>
          )}
          {isAiring(anime) && (
            <span className="flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold backdrop-blur-sm">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full rounded-full bg-red-400 opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex size-1.5 rounded-full bg-red-400" />
              </span>
              Airing
            </span>
          )}
        </div>

        {/* Save button */}
        <motion.button
          type="button"
          onClick={toggleSave}
          aria-pressed={saved}
          aria-label={
            saved ? `Remove ${anime.title} from list` : `Save ${anime.title}`
          }
          whileTap={{ scale: 0.85 }}
          className="absolute right-2 top-2 z-30 grid size-8 place-items-center rounded-full border border-white/10 bg-black/60 backdrop-blur-sm transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-red-400"
        >
          <Bookmark
            className={`size-4 transition-colors ${
              saved ? "fill-red-400 text-red-400" : "text-white/80"
            }`}
          />
        </motion.button>

        {/* Hover / focus details panel */}
        <AnimatePresence>
          {active && (
            <motion.div
              key="details"
              variants={overlayParent}
              initial="hidden"
              animate="show"
              exit="exit"
              className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end bg-linear-to-t from-black via-black/85 to-black/30 p-3.5"
            >
              <motion.h4
                variants={child}
                className="line-clamp-2 text-sm font-semibold leading-5 text-white"
              >
                {anime.title}
              </motion.h4>

              <motion.div
                variants={child}
                className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/70"
              >
                {anime.score && (
                  <span className="flex items-center gap-1 font-semibold text-white">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    {anime.score.toFixed(1)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-3" />
                  {anime.year || "TBA"}
                </span>
                <span className="flex items-center gap-1">
                  <Clapperboard className="size-3" />
                  {anime.episodes ? `${anime.episodes} eps` : "TBA"}
                </span>
              </motion.div>

              {genres.length > 0 && (
                <motion.ul
                  variants={child}
                  className="mt-2.5 flex flex-wrap gap-1.5"
                >
                  {genres.map((genre) => (
                    <li
                      key={genre}
                      className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-white/80"
                    >
                      {genre}
                    </li>
                  ))}
                </motion.ul>
              )}

              <motion.p
                variants={child}
                className="mt-2.5 line-clamp-3 text-[11px] leading-4.5 text-white/60"
              >
                {synopsis || "No description available yet."}
              </motion.p>

              <motion.div
                variants={child}
                className="pointer-events-auto mt-3.5"
              >
                <Link
                  href={playHref}
                  prefetch={false}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Play className="size-3.5 fill-white" />
                  Watch now
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Caption */}
      <h3 className="mt-3 line-clamp-1 text-sm font-medium leading-6 text-white/90 transition-colors group-hover:text-red-400 group-focus-within:text-red-400">
        {anime.title}
      </h3>
      <p className="mt-1 text-xs leading-5 text-white/50">
        {subtitle ||
          `${anime.year || "TBA"} · ${label(anime.format)} · ${anime.episodes ? `${anime.episodes} eps` : "Episodes TBA"}`}
      </p>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/* Section heading                                                            */
/* -------------------------------------------------------------------------- */

export function SectionHeading({ eyebrow, title, href }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6 flex items-end justify-between gap-4"
    >
      <div className="flex items-stretch gap-3">
        <div>
          {eyebrow && (
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="group/link flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 transition-colors hover:border-red-400/50 hover:text-white focus-visible:outline-2 focus-visible:outline-red-400"
        >
          View all
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover/link:translate-x-1"
          />
        </Link>
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Horizontal scroller (new): drop-in row with arrow controls                 */
/* -------------------------------------------------------------------------- */

export function AnimeRow({ items = [], renderItem, className = "" }) {
  const scroller = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const sync = () => {
    const el = scroller.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  };

  useEffect(sync, [items.length]);

  const scrollBy = (dir) => {
    const el = scroller.current;
    el?.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrow =
    "absolute top-1/3 z-30 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/80 text-white backdrop-blur transition hover:border-red-400/60 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400 md:grid";

  return (
    <div className={`group/row relative ${className}`}>
      <AnimatePresence>
        {!edge.start && (
          <motion.button
            key="prev"
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`${arrow} -left-4`}
          >
            <ChevronLeft className="size-5" />
          </motion.button>
        )}
        {!edge.end && (
          <motion.button
            key="next"
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`${arrow} -right-4`}
          >
            <ChevronRight className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <div
        ref={scroller}
        onScroll={sync}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            className="w-36 shrink-0 snap-start sm:w-40 lg:w-44"
          >
            {renderItem ? (
              renderItem(item, i)
            ) : (
              <AnimeCard anime={item} rank={undefined} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading skeletons                                                          */
/* -------------------------------------------------------------------------- */

export function AnimeCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="relative aspect-2/3 overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="mt-3 h-3.5 w-4/5 rounded bg-white/10" />
      <div className="mt-2 h-3 w-1/2 rounded bg-white/5" />
    </div>
  );
}

export function AnimeLoading() {
  return (
    <main className="min-h-screen bg-black px-5 pb-20 pt-32 text-white md:px-10">
      <div className="mx-auto max-w-7xl" role="status">
        <span className="sr-only">Loading anime...</span>
        <div className="relative mb-10 h-64 overflow-hidden rounded-2xl bg-white/5">
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/8 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
