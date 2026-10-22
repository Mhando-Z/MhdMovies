"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Star,
} from "lucide-react";
import { label } from "@/lib/anime/model";
import { AnimeArtwork, button, focus } from "./AnimeUI";
import AnimeTitle from "./AnimeTitle";
import { WatchlistButton } from "./AnimeLibrary";
import { useAnimeResource } from "./useAnimeResource";
import { BiSolidMoviePlay } from "react-icons/bi";

const SLIDE_DURATION = 8; // seconds each slide stays on screen
const EASE = [0.22, 1, 0.36, 1];

/* ---------- Motion variants ---------- */

const slideVariants = {
  enter: { opacity: 0 },
  center: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", when: "beforeChildren" },
  },
  exit: { opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

// One orchestrated moment: content staggers in, direction-aware.
const contentVariants = {
  enter: (d) => ({ x: d * 32 }),
  center: {
    x: 0,
    transition: { duration: 0.6, ease: EASE, staggerChildren: 0.07 },
  },
  exit: (d) => ({ x: d * -24, transition: { duration: 0.2 } }),
};

const itemVariants = {
  enter: { opacity: 0, y: 14 },
  center: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const posterVariants = {
  enter: (d) => ({ opacity: 0, x: d * 60, rotate: 8, scale: 0.96 }),
  center: {
    opacity: 1,
    x: 0,
    rotate: 3,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/* ---------- Auto-advance progress (lives inside the active thumbnail) ---------- */

function AutoProgress({ running, onDone }) {
  const progress = useMotionValue(0);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    if (!running) return;
    const controls = animate(progress, 1, {
      duration: SLIDE_DURATION * (1 - progress.get()),
      ease: "linear",
      onComplete: () => doneRef.current(),
    });
    return () => controls.stop();
  }, [running, progress]);

  return (
    <motion.span
      aria-hidden="true"
      style={{ scaleX: progress }}
      className="absolute inset-x-2 bottom-0 h-0.5 origin-left rounded-full bg-red-500"
    />
  );
}

/* ---------- A single featured slide ---------- */

function FeaturedSlide({ anime, direction, reduced }) {
  const { data: artwork } = useAnimeResource(`/api/anime/${anime.id}/logo`);
  const [failed, setFailed] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const background = artwork?.backdrop || anime.banner || anime.cover;
  const bgOpacity = !artwork?.backdrop && !anime.banner ? 0.45 : 0.8;
  const d = reduced ? 0 : direction;

  return (
    <motion.div
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="relative min-h-150"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-950" aria-hidden="true">
        {background && failed !== background && (
          <motion.img
            ref={(el) => {
              if (el?.complete && el.naturalWidth) setLoaded(true);
            }}
            src={background}
            alt=""
            fetchPriority="high"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(background)}
            initial={false}
            animate={{
              opacity: loaded ? bgOpacity : 0,
              // scale: loaded || reduced ? 1 : 1.06,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="size-full object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/65 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-black/25" />
      </div>

      {/* Content */}
      <motion.div
        custom={d}
        variants={contentVariants}
        className="relative xl:mx-auto grid xl:container items-center gap-10 px-6 pb-10 pt-32 md:min-h-[620px] md:grid-cols-[1fr_240px] md:pb-14 md:pt-40 lg:grid-cols-[1fr_300px] lg:gap-24"
      >
        <div className="min-w-0 max-w-2xl">
          <motion.p
            variants={itemVariants}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-400 backdrop-blur-sm"
          >
            The season’s spotlight
          </motion.p>

          <motion.div variants={itemVariants}>
            <AnimeTitle
              anime={anime}
              artwork={artwork || null}
              className="min-h-20 text-balance md:min-h-28 md:text-6xl"
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-5 flex flex-wrap items-center gap-y-2 text-xs text-white/75 md:text-sm"
          >
            {anime.score && (
              <span className="mr-3 flex items-center gap-1.5 rounded-md bg-amber-300/10 px-2 py-1 font-semibold text-amber-300">
                <Star className="size-4 fill-current" aria-hidden="true" />
                {anime.score.toFixed(1)}
                <span className="font-normal text-white/40">/ 10</span>
              </span>
            )}
            <div className="flex flex-wrap items-center divide-x divide-white/15">
              {anime.year && (
                <span className="px-3 first:pl-0">{anime.year}</span>
              )}
              {anime.format && (
                <span className="px-3 first:pl-0">{label(anime.format)}</span>
              )}
            </div>
            {anime.status && (
              <span className="ml-3 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] backdrop-blur-sm">
                {label(anime.status)}
              </span>
            )}
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-5 line-clamp-3 max-w-xl text-sm leading-7 text-white/65"
          >
            {anime.description ||
              "A new world, a different perspective. Discover the story and find your next favourite."}
          </motion.p>

          {anime.genres?.length > 0 && (
            <motion.ul
              variants={itemVariants}
              aria-label="Genres"
              className="mt-4 flex flex-wrap gap-2"
            >
              {anime.genres.slice(0, 3).map((genre) => (
                <li
                  key={genre}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 backdrop-blur-sm"
                >
                  {genre}
                </li>
              ))}
            </motion.ul>
          )}

          <motion.div
            variants={itemVariants}
            className="mt-7 flex flex-wrap items-start gap-3"
          >
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                href={`/anime/${anime.id}`}
                prefetch={false}
                className={`${button} group border-red-600 bg-red-600 shadow-lg shadow-red-950/40 hover:bg-red-700`}
              >
                <BiSolidMoviePlay className="w-5 h-5" />
                Watch now
              </Link>
            </motion.div>
            <WatchlistButton anime={anime} />
          </motion.div>
        </div>

        <motion.div
          custom={d}
          variants={posterVariants}
          whileHover={reduced ? undefined : { rotate: 0, scale: 1.03 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="hidden md:block"
        >
          <Link
            href={`/anime/${anime.id}`}
            prefetch={false}
            aria-label={`${anime.title} details`}
            className={`block rounded-2xl shadow-2xl shadow-black/60 ring-1 ring-white/10 ${focus}`}
          >
            <AnimeArtwork
              key={anime.cover}
              src={anime.cover}
              alt={`${anime.title} poster`}
              eager
              className="aspect-2/3 rounded-2xl border border-white/15"
            />
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Loading skeleton ---------- */

function HeroSkeleton() {
  return (
    <section
      aria-label="Loading featured anime"
      role="status"
      className="min-h-[600px] border-b border-white/10 bg-linear-to-br from-zinc-900 to-black px-6 pb-12 pt-40"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 motion-safe:animate-pulse md:grid-cols-[1fr_300px] lg:gap-24">
        <div className="space-y-5">
          <div className="h-6 w-44 rounded-full bg-white/10" />
          <div className="h-24 max-w-lg rounded-xl bg-white/10" />
          <div className="h-4 w-60 rounded bg-white/10" />
          <div className="h-16 max-w-xl rounded-xl bg-white/5" />
          <div className="flex gap-3 pt-2">
            <div className="h-11 w-44 rounded-lg bg-red-600/30" />
            <div className="h-11 w-36 rounded-lg bg-white/10" />
          </div>
        </div>
        <div className="hidden aspect-2/3 rotate-3 rounded-2xl bg-white/10 md:block" />
      </div>
      <span className="sr-only">Loading featured anime...</span>
    </section>
  );
}

/* ---------- Hero section ---------- */

export default function AnimeHeroSection({ Trending = [], loading = false }) {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [direction, setDirection] = useState(1);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const thumbRefs = useRef([]);
  const swiped = useRef(false);

  const count = Trending.length;
  const index = Math.min(selected, Math.max(0, count - 1));
  const anime = Trending[index];
  const playing =
    count > 1 && !reduced && !userPaused && !hovered && !focused && !tabHidden;

  const go = useCallback(
    (to, dir) => {
      if (!count) return;
      setDirection(dir);
      setSelected(((to % count) + count) % count);
    },
    [count],
  );
  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);

  // Pause when the tab is in the background.
  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Warm the cache for the next slide's backdrop.
  useEffect(() => {
    if (count < 2) return;
    const upcoming = Trending[(index + 1) % count];
    const src = upcoming?.banner || upcoming?.cover;
    if (src) new window.Image().src = src;
  }, [Trending, index, count]);

  // Keep the active thumbnail visible inside its scroller.
  useEffect(() => {
    thumbRefs.current[index]?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index, reduced]);

  if (!anime) return loading ? <HeroSkeleton /> : null;

  const handlePanEnd = (_, { offset, velocity }) => {
    if (count < 2) return;
    if (Math.abs(offset.x) < Math.abs(offset.y) * 1.5) return;
    if (Math.abs(offset.x) < 80 && Math.abs(velocity.x) < 500) return;
    swiped.current = true;
    setTimeout(() => (swiped.current = false), 60);
    if (offset.x < 0) next();
    else prev();
  };

  return (
    <section
      aria-label="Featured anime"
      aria-roledescription="carousel"
      aria-live={playing ? "off" : "polite"}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={(e) => setFocused(e.target.matches(":focus-visible"))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }}
      className="relative isolate overflow-hidden border-b border-white/10 bg-black"
    >
      <motion.div
        onPanEnd={handlePanEnd}
        onClickCapture={(e) => {
          if (swiped.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className="touch-pan-y"
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <div
            key={anime.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
          >
            <FeaturedSlide
              anime={anime}
              direction={direction}
              reduced={!!reduced}
            />
          </div>
        </AnimatePresence>
      </motion.div>

      {/* Controls */}
      <div className="relative xl:mx-auto flex xl:container items-center gap-4 px-6 pb-8">
        {count > 1 && (
          <div className="flex shrink-0 items-center gap-1">
            <motion.button
              type="button"
              aria-label="Previous featured anime"
              onClick={prev}
              whileTap={{ scale: 0.92 }}
              className={`${button} size-11 p-0`}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </motion.button>
            <motion.button
              type="button"
              aria-label="Next featured anime"
              onClick={next}
              whileTap={{ scale: 0.92 }}
              className={`${button} size-11 p-0`}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </motion.button>
            {!reduced && (
              <motion.button
                type="button"
                aria-label={
                  userPaused ? "Resume auto-advance" : "Pause auto-advance"
                }
                aria-pressed={userPaused}
                onClick={() => setUserPaused((v) => !v)}
                whileTap={{ scale: 0.92 }}
                className={`${button} size-11 p-0`}
              >
                {userPaused ? (
                  <Play className="size-4" aria-hidden="true" />
                ) : (
                  <Pause className="size-4" aria-hidden="true" />
                )}
              </motion.button>
            )}
            <span
              aria-hidden="true"
              className="ml-2 hidden w-14 text-xs tabular-nums text-white/40 sm:block"
            >
              <span className="text-white/80">
                {String(index + 1).padStart(2, "0")}
              </span>{" "}
              / {String(count).padStart(2, "0")}
            </span>
          </div>
        )}

        <div
          className="flex min-w-0 flex-1 snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Choose featured anime"
        >
          {Trending.map((item, position) => {
            const active = position === index;
            return (
              <button
                key={item.id}
                ref={(el) => (thumbRefs.current[position] = el)}
                type="button"
                aria-pressed={active}
                aria-label={`Feature ${item.title}`}
                onClick={() => go(position, position > index ? 1 : -1)}
                className={`relative flex min-h-14 min-w-36 max-w-52 flex-1 shrink-0 snap-start items-center gap-3 overflow-hidden rounded-lg border p-2 text-left transition-colors ${focus} ${
                  active
                    ? "border-transparent"
                    : "border-white/10 bg-black/30 hover:bg-white/10"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="hero-thumb-active"
                    aria-hidden="true"
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 32 }
                    }
                    className="absolute inset-0 rounded-lg border border-red-500/70 bg-red-500/10"
                  />
                )}
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={`relative h-10 w-7 shrink-0 rounded object-cover transition-opacity ${active ? "opacity-100" : "opacity-60"}`}
                  />
                ) : (
                  <span
                    className={`relative text-xs tabular-nums ${active ? "text-red-400" : "text-white/30"}`}
                  >
                    {String(position + 1).padStart(2, "0")}
                  </span>
                )}
                <span
                  className={`relative line-clamp-2 text-[11px] leading-4 transition-colors ${active ? "text-white" : "text-white/70"}`}
                >
                  {item.title}
                </span>
                {active && count > 1 && !reduced && (
                  <AutoProgress
                    key={anime.id}
                    running={playing}
                    onDone={next}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
