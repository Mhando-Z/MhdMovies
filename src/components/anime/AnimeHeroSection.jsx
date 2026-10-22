"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BsCalendarEvent } from "react-icons/bs";
import { BiSolidMoviePlay } from "react-icons/bi";
import { Star } from "lucide-react";

import { label } from "@/lib/anime/model";
import AnimeTitle from "./AnimeTitle";
import { WatchlistButton } from "./AnimeLibrary";
import { useAnimeResource } from "./useAnimeResource";
import AnimeSlider from "../Swipper/AniSwiper";

const EMPTY_TRENDING = [];

function AnimeHeroSkeleton() {
  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      aria-label="Loading featured anime"
      role="status"
    >
      <div className="relative h-[600px] sm:h-[700px] md:h-screen md:max-h-[970px] md:min-h-[450px]">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />
        <div className="absolute inset-0 px-4 xl:container md:px-0 xl:mx-auto lg:px-8">
          <div className="flex h-full flex-col">
            <div className="invisible flex h-[70%] max-w-2xl flex-1 flex-col justify-center gap-5 md:visible md:h-full md:pl-8 lg:pl-0">
              <div className="h-5 w-36 animate-pulse rounded bg-white/15" />
              <div className="h-20 w-3/4 animate-pulse rounded bg-white/15" />
              <div className="h-5 w-48 animate-pulse rounded bg-white/10" />
              <div className="h-16 w-5/6 animate-pulse rounded bg-white/10" />
            </div>
            <div className="flex h-[30%] items-center justify-end md:absolute md:bottom-8 md:right-8 md:h-auto md:w-full md:max-w-md">
              <div className="mx-auto flex w-full max-w-100 gap-3 overflow-hidden md:mx-0">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="aspect-[2/3] w-1/3 shrink-0 animate-pulse rounded-xl bg-white/10"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">Loading featured anime</span>
    </section>
  );
}

// Keep this as a child: useAnimeResource is a hook and must run
// unconditionally, even when the selected anime changes.
function FeaturedAnimeContent({ anime }) {
  const { data: artwork } = useAnimeResource(`/api/anime/${anime.id}/logo`);
  const genres = useMemo(() => anime.genres?.slice(0, 4) ?? [], [anime.genres]);
  const score = Number(anime.score);
  const hasScore = Number.isFinite(score) && score > 0;

  return (
    <motion.div
      key={anime.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4 md:gap-5"
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-5 w-1 rounded-full bg-red-600" />
        <span className="text-sm font-medium tracking-wide text-white/80">
          Trending now
        </span>
      </div>

      <AnimeTitle
        anime={anime}
        artwork={artwork || null}
        className="text-balance md:text-6xl"
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/90">
        {hasScore && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{score.toFixed(1)}</span>
            <Star
              className="h-4 w-4 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            <span className="text-sm text-white/60">/ 10</span>
          </div>
        )}
        {anime.year && (
          <div className="flex items-center gap-2">
            <BsCalendarEvent className="h-4 w-4" aria-hidden="true" />
            <span>{anime.year}</span>
          </div>
        )}
        {anime.format && (
          <span className="text-sm text-white/80">{label(anime.format)}</span>
        )}
        {anime.status && (
          <span className="text-sm text-white/80">{label(anime.status)}</span>
        )}
      </div>

      {genres.length > 0 && (
        <ul aria-label="Genres" className="flex flex-wrap items-center gap-2">
          {genres.map((genre) => (
            <li
              key={genre}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm sm:text-sm"
            >
              {genre}
            </li>
          ))}
        </ul>
      )}

      {anime.description && (
        <p className="line-clamp-3 max-w-xl text-base leading-relaxed text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] md:line-clamp-4 md:text-lg xl:line-clamp-5">
          {anime.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Link
          href={`/anime/${anime.id}`}
          prefetch={false}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-base font-semibold text-white shadow-lg shadow-black/40 transition-all duration-200 hover:scale-105 hover:bg-red-700 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:px-6 md:py-3 md:text-lg"
        >
          <BiSolidMoviePlay className="h-5 w-5" aria-hidden="true" />
          Watch Now
        </Link>
        <WatchlistButton anime={anime} />
      </div>
    </motion.div>
  );
}

export default function AnimeHeroSection({
  Trending = EMPTY_TRENDING,
  loading = false,
}) {
  const [value, setValue] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const index = Math.min(Math.max(0, value), Math.max(0, Trending.length - 1));
  const currentAnime = Trending[index];

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  // Resolve and preload each image before cross-fading; ignore stale loads.
  // On narrow screens, a portrait cover works better than a landscape banner.
  useEffect(() => {
    const src = isMobile
      ? currentAnime?.cover || currentAnime?.banner
      : currentAnime?.banner || currentAnime?.cover;

    if (!src) {
      setImageUrl("");
      setImageError(true);
      return;
    }

    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (!cancelled) {
        setImageError(false);
        setImageUrl(src);
      }
    };
    img.onerror = () => {
      if (!cancelled) {
        setImageError(true);
        setImageUrl("");
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [currentAnime?.banner, currentAnime?.cover, isMobile]);

  if (!currentAnime) return loading ? <AnimeHeroSkeleton /> : null;

  return (
    <section
      className="relative w-full overflow-hidden font-roboto"
      aria-label="Featured trending anime"
    >
      {/* Identical hero sizing and positioning to TvHeroSection */}
      <div className="relative h-[600px] sm:h-[700px] md:h-screen md:max-h-[970px] md:min-h-[450px]">
        <div className="absolute inset-0 bg-black">
          <AnimatePresence initial={false}>
            {!imageError && imageUrl && (
              <motion.div
                key={imageUrl}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img
                  src={imageUrl}
                  alt=""
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40" />
        </div>

        <div className="absolute inset-0 px-4 xl:container md:px-0 xl:mx-auto lg:px-8">
          <div className="flex h-full flex-col">
            <div className="invisible flex h-[70%] max-w-2xl flex-1 flex-col justify-center gap-4 md:visible md:h-full md:gap-5 md:pl-8 lg:pl-0">
              <AnimatePresence mode="wait" initial={false}>
                <FeaturedAnimeContent
                  key={currentAnime.id}
                  anime={currentAnime}
                />
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex h-[30%] items-center justify-end md:absolute md:bottom-8 md:right-8 md:h-auto md:w-full md:max-w-md"
            >
              <div className="mx-auto w-full max-w-100 md:mx-0">
                <AnimeSlider
                  data={Trending}
                  value={index}
                  setValue={setValue}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
