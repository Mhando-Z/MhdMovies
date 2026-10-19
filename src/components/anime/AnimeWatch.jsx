"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { releasedEpisodeCount, watchHref } from "@/lib/anime/model";
import { getAnimeSources, readPlayerEvent } from "@/lib/anime/sources";
import { AnimeArtwork, button, focus } from "./AnimeUI";
import AnimeEpisodes from "./AnimeEpisodes";
import { updateLibrary } from "./AnimeLibrary";

function Player({ anime, episode, audio, source, autoNext, nextEpisode }) {
  const frame = useRef(null);
  const lastSaved = useRef(0);
  const finished = useRef(false);
  const router = useRouter();
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setSlow(true), 15000);
    const onMessage = (event) => {
      const data = readPlayerEvent(source, event, frame.current?.contentWindow);
      if (!data || finished.current) return;
      if (data.type === "error") {
        setError(true);
        return;
      }
      if (data.type === "progress") {
        setSlow(false);
        setError(false);
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
        // Keep the next episode ready in Continue watching without claiming a seek.
        updateLibrary(anime, {
          episode: nextEpisode || episode,
          audio,
          time: 0,
          duration: 0,
          completed: !nextEpisode,
        });
        if (autoNext && nextEpisode)
          router.push(watchHref(anime.id, nextEpisode, audio), {
            scroll: false,
          });
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
    };
  }, [anime, audio, autoNext, episode, nextEpisode, router, source]);
  return (
    <>
      <iframe
        ref={frame}
        src={source.src}
        title={`${anime.title} · Episode ${episode} · ${source.name}`}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onError={() => setError(true)}
        className="aspect-video w-full border-0 bg-black"
      />
      {(slow || error) && (
        <p
          role="status"
          className="border-t border-white/10 px-5 py-4 text-xs leading-6 text-amber-200"
        >
          {error
            ? "The player reported a playback problem."
            : "If playback hasn't started, try another source below."}{" "}
          Availability varies by title, episode, and audio.
        </p>
      )}
    </>
  );
}

export default function AnimeWatch({ anime, episode, audio, playable }) {
  const sources = useMemo(
    () => getAnimeSources(anime, episode, audio),
    [anime, episode, audio],
  );
  const [sourceId, setSourceId] = useState("zoko");
  const [playing, setPlaying] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [autoNext, setAutoNext] = useState(false);
  const source = sources.find((item) => item.id === sourceId) || sources[0];
  const count = releasedEpisodeCount(anime);
  const nextEpisode =
    playable && count !== null && episode < count ? episode + 1 : null;
  const router = useRouter();
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mhd:anime-source");
      if (saved) setSourceId(saved);
    } catch {
      /* Storage is optional. */
    }
  }, []);
  useEffect(() => {
    if (playing && playable)
      updateLibrary(anime, { episode, audio, completed: false });
  }, [anime, episode, audio, playing, playable]);
  function chooseSource(id) {
    setSourceId(id);
    setAttempt(0);
    try {
      localStorage.setItem("mhd:anime-source", id);
    } catch {
      /* Storage is optional. */
    }
  }
  function start() {
    setPlaying(true);
    updateLibrary(anime, { episode, audio, completed: false });
  }
  return (
    <main className="min-h-screen bg-black px-5 pb-20 pt-28 font-roboto text-white md:px-10 md:pt-32">
      <div className="mx-auto max-w-[1446px]">
        <Link
          href={`/anime/${anime.id}`}
          className={`mb-6 inline-flex min-h-11 items-center gap-2 rounded text-xs text-white/60 hover:text-white ${focus}`}
        >
          <ArrowLeft className="size-4" />
          Title details
        </Link>
        <header className="mb-7">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
            Your animation room
          </p>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {anime.title}
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Episode {episode} <span className="mx-2 text-white/20">/</span>{" "}
            {audio === "dub" ? "Dubbed audio" : "Subtitled audio"}
          </p>
        </header>
        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            <section
              aria-label="Anime player"
              className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950"
            >
              {playing && playable && source ? (
                <Player
                  key={`${source.src}-${attempt}`}
                  anime={anime}
                  episode={episode}
                  audio={audio}
                  source={source}
                  autoNext={autoNext}
                  nextEpisode={nextEpisode}
                />
              ) : (
                <div className="relative isolate flex aspect-video min-h-56 items-center justify-center overflow-hidden p-6">
                  <div className="absolute inset-0 -z-10">
                    <AnimeArtwork
                      src={anime.banner || anime.cover}
                      className="h-full w-full"
                      eager
                    />
                    <div className="absolute inset-0 bg-black/75" />
                  </div>
                  <div className="max-w-md text-center">
                    {playable ? (
                      <>
                        <button
                          type="button"
                          onClick={start}
                          className={`${button} border-red-600 bg-red-600 px-6 hover:bg-red-700`}
                        >
                          <Play className="size-5 fill-current" />
                          Play episode {episode}
                        </button>
                        <p className="mt-4 text-xs leading-6 text-white/55">
                          {source?.name} ·{" "}
                          {audio === "sub" ? "Subtitled" : "Dubbed"}
                        </p>
                      </>
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
                <div className="flex items-center gap-2">
                  {["sub", "dub"].map((value) => (
                    <Link
                      key={value}
                      href={watchHref(anime.id, episode, value)}
                      aria-current={audio === value ? "page" : undefined}
                      className={`${button} text-xs ${audio === value ? "border-red-500/40 bg-red-500/15 text-red-300" : "text-white/50"}`}
                    >
                      {value === "sub" ? "Sub" : "Dub"}
                    </Link>
                  ))}
                </div>
                {playing && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setAttempt((n) => n + 1)}
                      aria-label="Reload player"
                      className={button}
                    >
                      <RotateCcw className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlaying(false)}
                      aria-label="Close player"
                      className={button}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </section>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.025] p-4">
              <p className="mb-3 text-xs text-white/50">Playback source</p>
              <div className="flex flex-wrap gap-2">
                {sources.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={source?.id === item.id}
                    onClick={() => chooseSource(item.id)}
                    className={`${button} text-xs ${source?.id === item.id ? "border-red-500/40 bg-red-500/10 text-red-300" : "text-white/60"}`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-6 text-white/40">
                Player not working? Try another source or audio option.
                Switching sources restarts the player.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {episode > 1 ? (
                  <Link
                    href={watchHref(anime.id, episode - 1, audio)}
                    className={button}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Link>
                ) : (
                  <button className={button} disabled>
                    <ChevronLeft className="size-4" />
                    Previous
                  </button>
                )}
                {nextEpisode ? (
                  <Link
                    href={watchHref(anime.id, nextEpisode, audio)}
                    className={button}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Link>
                ) : (
                  <button className={button} disabled>
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                )}
              </div>
              <label className="flex min-h-11 items-center gap-2 text-xs text-white/60">
                <input
                  type="checkbox"
                  checked={autoNext}
                  disabled={source?.id !== "nika" || !nextEpisode}
                  onChange={(event) => setAutoNext(event.target.checked)}
                  className="size-4 accent-red-600"
                />
                Auto-next
              </label>
            </div>
            <p className="mt-4 text-xs leading-6 text-white/35">
              Continue watching is saved on this device. Progress and auto-next
              are supported on NikaStream; automatic seeking is unavailable.
            </p>
          </div>
          <aside className="min-w-0 rounded-2xl border border-white/10 p-4 md:p-5">
            <AnimeEpisodes
              key={`${anime.id}-${episode}`}
              anime={anime}
              selected={episode}
              audio={audio}
              compact
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
