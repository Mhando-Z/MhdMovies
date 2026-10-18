"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  ExternalLink,
  Loader2,
  Play,
  RotateCcw,
  Server,
  X,
} from "lucide-react";
import { getMovieSources } from "@/lib/movieSources";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500";
const preferenceKey = "mhd:movie-source";
const VidstackPlayer = dynamic(() => import("./vidstackPlayer"), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      className="flex aspect-video items-center justify-center bg-zinc-950 text-white/70"
    >
      Loading player...
    </div>
  ),
});

function EmbedPlayer({ source, title }) {
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => {
      setLoading(false);
      setSlow(true);
    }, 15000);
    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <>
      <div className="relative aspect-video bg-black">
        {loading && (
          <div
            role="status"
            className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3 bg-zinc-950 text-sm text-white/70"
          >
            <Loader2 className="size-5 motion-safe:animate-spin" /> Opening{" "}
            {source.name}...
          </div>
        )}
        <iframe
          src={source.src}
          title={`${title} — ${source.name}`}
          className="h-full w-full border-0"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setSlow(true);
          }}
        />
      </div>
      {slow && (
        <p role="status" className="px-5 py-3 text-sm text-amber-300">
          This server is taking longer than expected. Try another server or
          reload the player.
        </p>
      )}
    </>
  );
}

export default function MoviePlayer({
  movie,
  playRequest = 0,
  suspended = false,
  sources: directSources = [],
}) {
  const sources = [
    ...directSources.map((source) => ({ ...source, kind: "media" })),
    ...getMovieSources(movie),
  ];
  const [selectedId, setSelectedId] = useState("vidfast");
  const [playing, setPlaying] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const selected =
    sources.find((source) => source.id === selectedId) ?? sources[0];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(preferenceKey);
      if (saved) setSelectedId(saved);
    } catch {
      /* Playback remains available when browser storage is disabled. */
    }
  }, []);

  useEffect(() => {
    if (playRequest > 0) setPlaying(true);
  }, [playRequest]);

  useEffect(() => {
    if (suspended) setPlaying(false);
  }, [suspended]);

  function selectSource(sourceId) {
    setSelectedId(sourceId);
    setAttempt(0);
    try {
      localStorage.setItem(preferenceKey, sourceId);
    } catch {
      /* Optional preference. */
    }
  }

  return (
    <section
      id="movie-player"
      aria-labelledby="movie-player-title"
      className="scroll-mt-24"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
            Your screening room
          </p>
          <h2
            id="movie-player-title"
            className="text-2xl font-semibold tracking-tight md:text-3xl"
          >
            Watch {movie.title}
          </h2>
        </div>
        {playing && (
          <button
            type="button"
            onClick={() => setPlaying(false)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs text-white/60 hover:bg-white/5 hover:text-white ${focus}`}
          >
            <X className="size-4" /> Close player
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
        {playing && selected ? (
          selected.kind === "media" ? (
            <VidstackPlayer
              key={`${selected.id}-${attempt}`}
              src={selected.src}
              title={movie.title}
              poster={
                movie.backdrop_path
                  ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                  : undefined
              }
            />
          ) : (
            <EmbedPlayer
              key={`${selected.src}-${attempt}`}
              source={selected}
              title={movie.title}
            />
          )
        ) : (
          <div className="relative flex aspect-video max-h-[560px] min-h-56 items-center justify-center overflow-hidden bg-zinc-950 p-6">
            {movie.backdrop_path && (
              <img
                src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-25"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
            <div className="relative text-center">
              <button
                type="button"
                disabled={!selected}
                onClick={() => setPlaying(true)}
                className={`mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-red-600 shadow-xl transition-colors hover:bg-red-500 disabled:opacity-40 md:size-20 ${focus}`}
                aria-label={`Play ${movie.title} on ${selected?.name ?? "selected server"}`}
              >
                <Play className="ml-1 size-7 fill-white" />
              </button>
              <p className="text-sm font-medium">
                {selected
                  ? `Play with ${selected.name}`
                  : "No sources available"}
              </p>
              <p className="mt-2 text-xs text-white/60">
                Choose a server below to start watching.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4 border-t border-white/10 p-4 md:p-5">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Server className="size-4" /> Choose your server
          </div>
          <div
            role="group"
            aria-label="Streaming server"
            className="flex flex-wrap gap-2"
          >
            {sources?.map((source) => (
              <button
                key={source.id}
                type="button"
                onClick={() => selectSource(source.id)}
                aria-pressed={selected?.id === source.id}
                className={`min-h-11 cursor-pointer rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${focus} ${selected?.id === source.id ? "border-red-500/60 bg-red-500/15 text-red-300" : "border-white/10 bg-white/[0.03] text-white/65 hover:bg-white/10 hover:text-white"}`}
              >
                {source.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
            <p className="max-w-2xl text-xs leading-6 text-white/45">
              If a movie is unavailable or playback stops, select another
              server. Quality, subtitles and availability vary by server.
            </p>
            {playing && selected && (
              <div className="flex shrink-0 items-center gap-4 text-xs text-white/65">
                <button
                  type="button"
                  onClick={() => setAttempt((value) => value + 1)}
                  className={`inline-flex min-h-10 items-center gap-2 rounded hover:text-white ${focus}`}
                >
                  <RotateCcw className="size-3.5" /> Reload
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
