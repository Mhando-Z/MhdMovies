"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useResource } from "@/components/tvSeries/TvUI";
import { releasedEpisodeCount, watchHref } from "@/lib/anime/model";
import { button, focus } from "./AnimeUI";

export default function AnimeEpisodes({
  anime,
  selected,
  audio = "sub",
  compact = false,
}) {
  const [page, setPage] = useState(
    selected ? Math.floor((selected - 1) / 100) + 1 : 1,
  );
  const resource = useResource(`/api/anime/${anime.id}/episodes?page=${page}`);
  const released = releasedEpisodeCount(anime);
  const knownCount = anime.episodes || released;
  const [jump, setJump] = useState("");
  const metadata = new Map(
    (resource.data?.results || []).map((episode) => [episode.number, episode]),
  );
  const count = knownCount
    ? Math.max(0, Math.min(100, knownCount - (page - 1) * 100))
    : 0;
  const numbers = count
    ? Array.from({ length: count }, (_, i) => (page - 1) * 100 + i + 1)
    : [...metadata.keys()];
  const totalPages = knownCount ? Math.ceil(knownCount / 100) : null;
  return (
    <section id="episodes" aria-label="Episodes" className="scroll-mt-28">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">
          Episodes{" "}
          <span className="ml-1 text-sm font-normal text-white/40">
            {anime.episodes ||
              (anime.status === "NOT_YET_RELEASED" ? "Coming soon" : "Ongoing")}
          </span>
        </h2>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const n = Number(jump);
            if (Number.isInteger(n) && n > 0 && n <= (knownCount || 100000))
              setPage(Math.floor((n - 1) / 100) + 1);
          }}
        >
          <label>
            <span className="sr-only">Find episode number</span>
            <input
              type="number"
              min="1"
              max={knownCount || 100000}
              value={jump}
              onChange={(event) => setJump(event.target.value)}
              placeholder="Episode #"
              className={`min-h-11 w-28 rounded-lg border border-white/15 bg-zinc-950 px-3 text-xs ${focus}`}
            />
          </label>
          <button type="submit" className={button}>
            Find
          </button>
        </form>
      </div>
      {resource.loading && (
        <p role="status" className="mb-4 text-xs text-white/50">
          Loading episode titles...
        </p>
      )}
      {resource.error && (
        <p role="status" className="mb-4 text-xs leading-6 text-white/50">
          Episode details are temporarily unavailable.{" "}
          {released !== null && released > 0
            ? "You can still select a broadcast episode below."
            : "Please retry to check episode dates."}{" "}
          <button
            type="button"
            onClick={resource.retry}
            className={`min-h-11 px-2 text-red-400 underline ${focus}`}
          >
            Retry
          </button>
        </p>
      )}
      {resource.data?.unavailable && released === null && (
        <p className="mb-4 text-sm leading-6 text-white/50">
          Episode dates have not been confirmed for this title.
        </p>
      )}
      <div
        className={
          compact
            ? "grid max-h-[520px] gap-2 overflow-y-auto pr-1"
            : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {numbers.map((number) => {
          const episode = metadata.get(number);
          const aired = episode?.aired
            ? new Date(episode.aired).getTime()
            : null;
          const available =
            anime.status !== "NOT_YET_RELEASED" &&
            anime.status !== "CANCELLED" &&
            (released !== null
              ? number <= released
              : aired !== null && aired <= Date.now());
          const content = (
            <>
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${selected === number ? "bg-red-600 text-white" : "bg-white/5 text-white/50"}`}
              >
                {selected === number ? (
                  <Play className="size-4 fill-current" />
                ) : (
                  String(number).padStart(2, "0")
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm">
                  {episode?.title || `Episode ${number}`}
                </span>
                <span className="mt-1 block text-[10px] text-white/40">
                  {selected === number
                    ? "Selected episode"
                    : !available
                      ? "Date unconfirmed or upcoming"
                      : episode?.recap
                        ? "Recap"
                        : episode?.filler
                          ? "Filler"
                          : "Broadcast episode"}
                </span>
              </span>
            </>
          );
          const classes = `flex min-w-0 items-center gap-3 rounded-xl border p-3 ${focus} ${selected === number ? "border-red-500/40 bg-red-500/10" : "border-white/10 bg-white/[0.025]"}`;
          return available ? (
            <Link
              key={number}
              href={watchHref(anime.id, number, audio)}
              aria-current={selected === number ? "page" : undefined}
              className={`${classes} hover:border-white/30`}
            >
              {content}
            </Link>
          ) : (
            <div
              key={number}
              aria-disabled="true"
              className={`${classes} opacity-50`}
            >
              {content}
            </div>
          );
        })}
      </div>
      {!numbers.length && !resource.loading && !resource.error && (
        <p className="rounded-xl border border-dashed border-white/15 p-7 text-sm text-white/50">
          {anime.status === "NOT_YET_RELEASED"
            ? "Episodes will appear after broadcast dates are confirmed."
            : "No episode information is available for this range."}
        </p>
      )}
      <nav
        aria-label="Episode ranges"
        className="mt-5 flex items-center justify-between gap-2"
      >
        <button
          type="button"
          className={button}
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          <ChevronLeft className="size-4" />
          <span className="sr-only">Previous episode range</span>
        </button>
        <span className="text-xs text-white/45">
          {(page - 1) * 100 + 1}–{(page - 1) * 100 + (numbers.length || 100)}
        </span>
        <button
          type="button"
          className={button}
          disabled={
            totalPages ? page >= totalPages : !resource.data?.hasNextPage
          }
          onClick={() => setPage((p) => p + 1)}
        >
          <ChevronRight className="size-4" />
          <span className="sr-only">Next episode range</span>
        </button>
      </nav>
      <p className="mt-4 text-[10px] leading-5 text-white/35">
        Episode titles from{" "}
        <a
          href="https://jikan.moe"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Jikan / MyAnimeList
        </a>
        . Broadcast does not guarantee stream availability.
      </p>
    </section>
  );
}
