"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Captions,
  Check,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  Loader2,
  Maximize,
  Mic,
  Play,
  RectangleHorizontal,
  RotateCcw,
  Server,
  SkipForward,
  X,
} from "lucide-react";
import { releasedEpisodeCount, watchHref } from "@/lib/anime/model";
import { getAnimeSources, readPlayerEvent } from "@/lib/anime/sources";
import { AnimeArtwork, button, focus } from "./AnimeUI";
import AnimeEpisodes from "./AnimeEpisodes";
import { updateLibrary } from "./AnimeLibrary";

const AUTO_NEXT_SECONDS = 5;

/* Storage is optional: every read/write is guarded. */
const store = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch {
      /* ignore */
    }
  },
};

function Kbd({ children }) {
  return (
    <kbd className="inline-flex min-w-5 items-center justify-center rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/70">
      {children}
    </kbd>
  );
}

function Player({
  anime,
  episode,
  audio,
  source,
  autoNext,
  nextEpisode,
  altSource,
  onSwitchSource,
  onReload,
}) {
  const frame = useRef(null);
  const lastSaved = useRef(0);
  const finished = useRef(false);
  const started = useRef(false);
  const router = useRouter();
  const reduce = useReducedMotion();
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [ratio, setRatio] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const nextHref = nextEpisode ? watchHref(anime.id, nextEpisode, audio) : null;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!started.current) setSlow(true);
    }, 15000);
    const onMessage = (event) => {
      const data = readPlayerEvent(source, event, frame.current?.contentWindow);
      if (!data || finished.current) return;
      if (data.type === "error") {
        setError(true);
        return;
      }
      if (data.type === "progress") {
        started.current = true;
        setLoaded(true);
        setSlow(false);
        setError(false);
        if (data.duration > 0)
          setRatio(Math.min(1, Math.max(0, data.time / data.duration)));
        if (Date.now() - lastSaved.current > 5000) {
          lastSaved.current = Date.now();
          updateLibrary(anime, {
            episode,
            audio,
            time: data.time,
            duration: data.duration,
            completed: false,
          });
        }
      }
      if (data.type === "complete") {
        finished.current = true;
        setRatio(1);
        // Keep the next episode ready in Continue watching without claiming a seek.
        updateLibrary(anime, {
          episode: nextEpisode || episode,
          audio,
          time: 0,
          duration: 0,
          completed: !nextEpisode,
        });
        if (autoNext && nextEpisode) setCountdown(AUTO_NEXT_SECONDS);
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
    };
  }, [anime, audio, autoNext, episode, nextEpisode, source]);

  /* Auto-next countdown, cancellable by the viewer. */
  useEffect(() => {
    if (countdown === null || !nextHref) return;
    if (countdown <= 0) {
      router.push(nextHref, { scroll: false });
      return;
    }
    const tick = setTimeout(() => setCountdown((n) => n - 1), 1000);
    return () => clearTimeout(tick);
  }, [countdown, nextHref, router]);

  const showTrouble = (slow || error) && !loaded ? true : error;

  return (
    <>
      <div className="relative aspect-video w-full bg-black">
        <iframe
          ref={frame}
          src={source.src}
          title={`${anime.title} · Episode ${episode} · ${source.name}`}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className="absolute inset-0 size-full border-0 bg-black"
        />

        {/* Loading veil */}
        <AnimatePresence>
          {!loaded && !error && (
            <motion.div
              key="loading"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="size-7 animate-spin text-red-500 motion-reduce:animate-none" />
              <p className="text-xs text-white/50">
                Loading from {source.name}…
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auto-next countdown */}
        <AnimatePresence>
          {countdown !== null && nextHref && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-black/85 p-6 text-center backdrop-blur-sm"
            >
              <div className="relative grid size-20 place-items-center">
                <svg
                  viewBox="0 0 80 80"
                  className="absolute inset-0 -rotate-90"
                  aria-hidden="true"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 1 }}
                    animate={{ pathLength: 0 }}
                    transition={{
                      duration: reduce ? 0 : AUTO_NEXT_SECONDS,
                      ease: "linear",
                    }}
                  />
                </svg>
                <span className="text-2xl font-bold tabular-nums">
                  {Math.max(countdown, 0)}
                </span>
              </div>
              <div>
                <p className="text-xs text-white/50">Up next</p>
                <p className="mt-1 text-lg font-semibold">
                  Episode {nextEpisode}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push(nextHref, { scroll: false })}
                  className={`${button} border-red-600 bg-red-600 hover:bg-red-700`}
                >
                  <SkipForward className="size-4" />
                  Play now
                </button>
                <button
                  type="button"
                  onClick={() => setCountdown(null)}
                  className={button}
                >
                  <X className="size-4" />
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thin playback progress, only when the source reports it */}
      {ratio > 0 && (
        <div
          role="progressbar"
          aria-label="Episode progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(ratio * 100)}
          className="h-0.5 w-full bg-white/10"
        >
          <motion.div
            className="h-full origin-left bg-red-600"
            animate={{ scaleX: ratio }}
            transition={{ duration: reduce ? 0 : 0.6, ease: "easeOut" }}
          />
        </div>
      )}

      <AnimatePresence initial={false}>
        {showTrouble && (
          <motion.div
            key="trouble"
            role="status"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <p className="flex items-start gap-2.5 text-xs leading-6 text-amber-200">
                <AlertTriangle className="mt-1 size-3.5 shrink-0" />
                <span>
                  {error
                    ? "The player reported a playback problem."
                    : "If playback hasn't started, try another source."}{" "}
                  <span className="text-amber-200/70">
                    Availability varies by title, episode, and audio.
                  </span>
                </span>
              </p>
              <div className="flex gap-2">
                {altSource && (
                  <button
                    type="button"
                    onClick={() => onSwitchSource(altSource.id)}
                    className={`${button} border-amber-300/30 text-xs text-amber-200`}
                  >
                    <Server className="size-4" />
                    Try {altSource.name}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onReload}
                  className={`${button} text-xs`}
                >
                  <RotateCcw className="size-4" />
                  Reload
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function AnimeWatch({ anime, episode, audio, playable }) {
  const sources = useMemo(
    () => getAnimeSources(anime, episode, audio),
    [anime, episode, audio],
  );
  const router = useRouter();
  const reduce = useReducedMotion();
  const playerRef = useRef(null);
  const [sourceId, setSourceId] = useState("zoko");
  const [playing, setPlaying] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [autoNext, setAutoNext] = useState(false);
  const [theater, setTheater] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  const source = sources.find((item) => item.id === sourceId) || sources[0];
  const sourceIndex = Math.max(0, sources.indexOf(source));
  const altSource =
    sources.length > 1 ? sources[(sourceIndex + 1) % sources.length] : null;
  const nikaSource = sources.find((item) => item.id === "nika");
  const count = releasedEpisodeCount(anime);
  const nextEpisode =
    playable && count !== null && episode < count ? episode + 1 : null;
  const canAutoNext = source?.id === "nika" && Boolean(nextEpisode);
  const progress = count ? Math.min(1, episode / count) : null;

  /* Restore device preferences. */
  useEffect(() => {
    setSourceId(store.get("mhd:anime-source", "zoko"));
    setAutoNext(store.get("mhd:anime-auto-next", "0") === "1");
    setTheater(store.get("mhd:anime-theater", "0") === "1");
  }, []);

  useEffect(() => {
    if (playing && playable)
      updateLibrary(anime, { episode, audio, completed: false });
  }, [anime, episode, audio, playing, playable]);

  function chooseSource(id) {
    setSourceId(id);
    setAttempt(0);
    store.set("mhd:anime-source", id);
  }
  function start() {
    setPlaying(true);
    updateLibrary(anime, { episode, audio, completed: false });
  }
  function toggleAutoNext() {
    const value = !autoNext;
    setAutoNext(value);
    store.set("mhd:anime-auto-next", value ? "1" : "0");
  }
  function toggleTheater() {
    setTheater((value) => {
      store.set("mhd:anime-theater", value ? "0" : "1");
      return !value;
    });
  }
  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else playerRef.current?.requestFullscreen?.();
  }

  /* Keyboard shortcuts (ignored while typing or with modifiers). */
  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      )
        return;
      switch (event.key.toLowerCase()) {
        case "n":
          if (nextEpisode)
            router.push(watchHref(anime.id, nextEpisode, audio), {
              scroll: false,
            });
          break;
        case "p":
          if (episode > 1)
            router.push(watchHref(anime.id, episode - 1, audio), {
              scroll: false,
            });
          break;
        case "t":
          toggleTheater();
          break;
        case "f":
          toggleFullscreen();
          break;
        default:
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anime.id, audio, episode, nextEpisode, router]);

  const iconButton = `${button} ${focus}`;

  return (
    <main className="min-h-screen bg-black px-5 pb-20 pt-28 font-roboto text-white md:px-10 md:pt-32">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto max-w-[1446px]"
      >
        <Link
          href={`/anime/${anime.id}`}
          onClick={() => setPlaying(false)}
          className={`group mb-6 inline-flex min-h-11 items-center gap-2 rounded text-xs text-white/60 transition-colors hover:text-white ${focus}`}
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" />
          Title details
        </Link>

        <header className="mb-7">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
            Your animation room
          </p>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {anime.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm text-white/50">
              Episode {episode}
              {count ? ` of ${count}` : ""}{" "}
              <span className="mx-2 text-white/20">/</span>
              <span className="inline-flex items-center gap-1.5">
                {audio === "dub" ? (
                  <Mic className="size-3.5" />
                ) : (
                  <Captions className="size-3.5" />
                )}
                {audio === "dub" ? "Dubbed audio" : "Subtitled audio"}
              </span>
            </p>
            {progress !== null && (
              <div
                role="progressbar"
                aria-label="Series progress"
                aria-valuemin={0}
                aria-valuemax={count}
                aria-valuenow={episode}
                className="h-1 w-32 overflow-hidden rounded-full bg-white/10"
              >
                <motion.div
                  className="h-full origin-left rounded-full bg-red-600"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progress }}
                  transition={{ duration: reduce ? 0 : 0.7, ease: "easeOut" }}
                />
              </div>
            )}
          </div>
        </header>

        <div
          className={`grid items-start gap-8 ${theater ? "" : "xl:grid-cols-[minmax(0,1fr)_340px]"}`}
        >
          <div className="min-w-0">
            <section
              ref={playerRef}
              aria-label="Anime player"
              className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_24px_80px_-24px_rgba(220,38,38,0.25)]"
            >
              {playing && playable && source ? (
                <Player
                  key={`${source.src}-${attempt}`}
                  anime={anime}
                  episode={episode}
                  audio={audio}
                  source={source}
                  autoNext={autoNext && canAutoNext}
                  nextEpisode={nextEpisode}
                  altSource={altSource}
                  onSwitchSource={chooseSource}
                  onReload={() => setAttempt((n) => n + 1)}
                />
              ) : (
                <div className="relative isolate flex aspect-video min-h-56 items-center justify-center overflow-hidden p-6">
                  <div className="absolute inset-0 -z-10">
                    <AnimeArtwork
                      src={anime.banner || anime.cover}
                      className="h-full w-full"
                      eager
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/60" />
                  </div>
                  <div className="max-w-md text-center">
                    {playable ? (
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="relative inline-flex">
                          {!reduce && (
                            <motion.span
                              aria-hidden="true"
                              className="absolute inset-0 rounded-[inherit] border border-red-500"
                              animate={{
                                scale: [1, 1.25],
                                opacity: [0.6, 0],
                              }}
                              transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                ease: "easeOut",
                              }}
                            />
                          )}
                          <motion.button
                            type="button"
                            onClick={start}
                            whileHover={reduce ? undefined : { scale: 1.04 }}
                            whileTap={reduce ? undefined : { scale: 0.97 }}
                            className={`${button} relative border-red-600 bg-red-600 px-6 hover:bg-red-700`}
                          >
                            <Play className="size-5 fill-current" />
                            {/* Play episode {episode} */}
                          </motion.button>
                        </div>
                        <p> Play Episode {episode}</p>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-lg font-semibold">
                          Episode not confirmed
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-white/60">
                          This episode may be upcoming, out of range, or missing
                          a confirmed broadcast date.
                        </p>
                        <button
                          type="button"
                          onClick={() => router.refresh()}
                          className={`${button} mt-5`}
                        >
                          <RotateCcw className="size-4" />
                          Check again
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-4">
                {/* Sub / Dub segmented control */}
                <div
                  role="group"
                  aria-label="Audio"
                  className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1"
                >
                  {["sub", "dub"].map((value) => {
                    const active = audio === value;
                    return (
                      <Link
                        key={value}
                        href={watchHref(anime.id, episode, value)}
                        aria-current={active ? "page" : undefined}
                        scroll={false}
                        className={`${button} relative border-transparent text-xs ${active ? "text-red-300" : "text-white/50 hover:text-white"}`}
                      >
                        {active && (
                          <motion.span
                            layoutId="audio-pill"
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 34,
                            }}
                            className="absolute inset-0 rounded-[inherit] border border-red-500/40 bg-red-500/15"
                          />
                        )}
                        <span className="relative inline-flex items-center gap-1.5">
                          {value === "sub" ? (
                            <Captions className="size-4" />
                          ) : (
                            <Mic className="size-4" />
                          )}
                          {value === "sub" ? "Sub" : "Dub"}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={toggleTheater}
                    aria-label="Toggle theater mode"
                    aria-pressed={theater}
                    title="Theater mode (T)"
                    className={`${iconButton} hidden xl:inline-flex ${theater ? "text-red-300" : ""}`}
                  >
                    <RectangleHorizontal className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label="Fullscreen"
                    title="Fullscreen (F)"
                    className={iconButton}
                  >
                    <Maximize className="size-4" />
                  </button>
                  {playing && (
                    <>
                      <button
                        type="button"
                        onClick={() => setAttempt((n) => n + 1)}
                        aria-label="Reload player"
                        title="Reload player"
                        className={iconButton}
                      >
                        <RotateCcw className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlaying(false)}
                        aria-label="Close player"
                        title="Close player"
                        className={iconButton}
                      >
                        <X className="size-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Source picker */}
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.025] p-4">
              <p className="mb-3 flex items-center gap-2 text-xs text-white/50">
                <Server className="size-3.5" />
                Playback source
              </p>
              <div className="flex flex-wrap gap-2">
                {sources.map((item) => {
                  const active = source?.id === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => chooseSource(item.id)}
                      whileTap={reduce ? undefined : { scale: 0.96 }}
                      className={`${button} ${focus} text-xs transition-colors ${active ? "border-red-500/40 bg-red-500/10 text-red-300" : "text-white/60 hover:text-white"}`}
                    >
                      {active && <Check className="size-4" />}
                      {item.name}
                    </motion.button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs leading-6 text-white/40">
                Player not working? Try another source or audio option.
                Switching sources restarts the player.
              </p>
            </div>

            {/* Episode navigation */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {episode > 1 ? (
                  <Link
                    href={watchHref(anime.id, episode - 1, audio)}
                    scroll={false}
                    title="Previous episode (P)"
                    className={button}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Link>
                ) : (
                  <button type="button" className={button} disabled>
                    <ChevronLeft className="size-4" />
                    Previous
                  </button>
                )}
                {nextEpisode ? (
                  <Link
                    href={watchHref(anime.id, nextEpisode, audio)}
                    scroll={false}
                    title="Next episode (N)"
                    className={button}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Link>
                ) : (
                  <button type="button" className={button} disabled>
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!canAutoNext && nextEpisode && nikaSource && (
                  <button
                    type="button"
                    onClick={() => chooseSource(nikaSource.id)}
                    className={`${focus} min-h-11 rounded text-xs text-red-300 underline-offset-4 hover:underline`}
                  >
                    Switch to {nikaSource.name} for auto-next
                  </button>
                )}
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoNext && canAutoNext}
                  disabled={!canAutoNext}
                  onClick={toggleAutoNext}
                  className={`${focus} flex min-h-11 items-center gap-3 rounded text-xs disabled:cursor-not-allowed ${canAutoNext ? "text-white/70" : "text-white/30"}`}
                >
                  <span
                    className={`relative h-5 w-9 rounded-full border transition-colors ${autoNext && canAutoNext ? "border-red-500 bg-red-600" : "border-white/15 bg-white/10"}`}
                  >
                    <motion.span
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 32,
                      }}
                      className={`absolute top-0.5 size-4 rounded-full bg-white ${autoNext && canAutoNext ? "right-0.5" : "left-0.5"}`}
                    />
                  </span>
                  Auto-next
                </button>
              </div>
            </div>

            {/* Footnote + shortcuts */}
            <div className="mt-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="max-w-xl text-xs leading-6 text-white/35">
                  Continue watching is saved on this device. Progress and
                  auto-next are supported on NikaStream; automatic seeking is
                  unavailable.
                </p>
                <button
                  type="button"
                  onClick={() => setShowKeys((v) => !v)}
                  aria-expanded={showKeys}
                  className={`${focus} hidden min-h-11 items-center gap-2 rounded text-xs text-white/50 hover:text-white md:inline-flex`}
                >
                  <Keyboard className="size-4" />
                  Shortcuts
                </button>
              </div>
              <AnimatePresence initial={false}>
                {showKeys && (
                  <motion.dl
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 rounded-xl border border-white/10 bg-white/[0.025] p-4 text-xs text-white/60">
                      {[
                        ["N", "Next episode"],
                        ["P", "Previous episode"],
                        ["T", "Theater mode"],
                        ["F", "Fullscreen"],
                      ].map(([key, label]) => (
                        <div key={key} className="flex items-center gap-2">
                          <dt>
                            <Kbd>{key}</Kbd>
                          </dt>
                          <dd>{label}</dd>
                        </div>
                      ))}
                    </div>
                  </motion.dl>
                )}
              </AnimatePresence>
            </div>
          </div>

          <aside
            className={`min-w-0 rounded-2xl border border-white/10 p-4 md:p-5 ${theater ? "" : "xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto"}`}
          >
            <AnimeEpisodes
              key={`${anime.id}-${episode}`}
              anime={anime}
              selected={episode}
              audio={audio}
              compact
            />
          </aside>
        </div>
      </motion.div>
    </main>
  );
}
