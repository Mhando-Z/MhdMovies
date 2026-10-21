"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Lock,
  Play,
  RotateCw,
  Search,
  X,
} from "lucide-react";
import { useResource } from "@/components/tvSeries/TvUI";
import { releasedEpisodeCount, watchHref } from "@/lib/anime/model";
import { button, focus } from "./AnimeUI";

const PAGE_SIZE = 100;
const FILTERS = [
  { id: "all", label: "All" },
  { id: "aired", label: "Aired" },
  { id: "upcoming", label: "Upcoming" },
];

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function EpisodeSkeleton({ list }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3 ${list ? "" : "min-h-[76px]"}`}
    >
      <div className="size-11 shrink-0 animate-pulse rounded-lg bg-white/5" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="h-2.5 w-1/3 animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
}

export default function AnimeEpisodes({
  anime,
  selected,
  audio = "sub",
  compact = false,
}) {
  const reduceMotion = useReducedMotion();
  const [page, setPage] = useState(
    selected ? Math.floor((selected - 1) / PAGE_SIZE) + 1 : 1,
  );
  const resource = useResource(`/api/anime/${anime.id}/episodes?page=${page}`);
  const released = releasedEpisodeCount(anime);
  const knownCount = anime.episodes || released;
  const [jump, setJump] = useState("");
  const [jumpError, setJumpError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState(compact ? "list" : "grid");
  const [target, setTarget] = useState(compact ? selected : null);

  const metadata = useMemo(
    () =>
      new Map(
        (resource.data?.results || []).map((episode) => [
          episode.number,
          episode,
        ]),
      ),
    [resource.data],
  );

  const count = knownCount
    ? Math.max(0, Math.min(PAGE_SIZE, knownCount - (page - 1) * PAGE_SIZE))
    : 0;
  const numbers = count
    ? Array.from({ length: count }, (_, i) => (page - 1) * PAGE_SIZE + i + 1)
    : [...metadata.keys()];
  const totalPages = knownCount ? Math.ceil(knownCount / PAGE_SIZE) : null;

  const isAvailable = (number) => {
    const aired = metadata.get(number)?.aired
      ? new Date(metadata.get(number).aired).getTime()
      : null;
    return (
      anime.status !== "NOT_YET_RELEASED" &&
      anime.status !== "CANCELLED" &&
      (released !== null
        ? number <= released
        : aired !== null && aired <= Date.now())
    );
  };

  const visible = numbers.filter((number) => {
    const available = isAvailable(number);
    if (filter === "aired" && !available) return false;
    if (filter === "upcoming" && available) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const title = (metadata.get(number)?.title || "").toLowerCase();
    return String(number).includes(q) || title.includes(q);
  });

  const airedCount =
    released !== null ? released : numbers.filter(isAvailable).length;
  const progress =
    knownCount && released !== null
      ? Math.min(100, Math.round((released / knownCount) * 100))
      : null;
  const rangeStart = (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = (page - 1) * PAGE_SIZE + (numbers.length || PAGE_SIZE);
  const list = view === "list";

  // Scroll a jumped-to / selected episode into view once it is rendered.
  useEffect(() => {
    if (!target || resource.loading) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(`episode-${anime.id}-${target}`)?.scrollIntoView({
        block: "center",
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [target, page, resource.loading, anime.id, reduceMotion]);

  const submitJump = (event) => {
    event.preventDefault();
    const n = Number(jump);
    const max = knownCount || 100000;
    if (!jump.trim() || !Number.isInteger(n) || n < 1 || n > max) {
      setJumpError(
        `Enter an episode number between 1 and ${knownCount || "the latest episode"}.`,
      );
      return;
    }
    setJumpError("");
    setQuery("");
    setFilter("all");
    setPage(Math.floor((n - 1) / PAGE_SIZE) + 1);
    setTarget(n);
  };

  const changePage = (next) => {
    setPage(next);
    setTarget(null);
  };

  const gridClass = list
    ? `grid gap-2 ${compact ? "max-h-[520px] overflow-y-auto pr-1" : ""}`
    : "grid h-100 gap-1.5 sm:grid-cols-2 overflow-y-auto xl:grid-cols-4  lg:grid-cols-3";

  const showRangeChips = totalPages && totalPages > 1 && totalPages <= 8;

  return (
    <section id="episodes" aria-label="Episodes" className="scroll-mt-28">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold">
            Episodes{" "}
            <span className="ml-1 text-sm font-normal text-white/40">
              {anime.episodes ||
                (anime.status === "NOT_YET_RELEASED"
                  ? "Coming soon"
                  : "Ongoing")}
            </span>
          </h2>
          {progress !== null && (
            <div className="mt-2 flex items-center gap-3">
              <div
                role="progressbar"
                aria-label="Episodes aired"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="h-1 w-40 overflow-hidden rounded-full bg-white/10"
              >
                <motion.div
                  className="h-full rounded-full bg-red-600"
                  initial={reduceMotion ? false : { width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs text-white/45">
                {airedCount} of {knownCount} aired
              </span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {jumpError && (
          <motion.p
            id="jump-error"
            role="alert"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 flex items-center justify-end gap-1.5 overflow-hidden text-xs text-red-400"
          >
            <AlertCircle className="size-3.5 shrink-0" />
            {jumpError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-[180px] flex-1">
          <span className="sr-only">Search episodes on this page</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or number"
            className={`min-h-11 w-full rounded-lg border border-white/15 bg-zinc-950 pl-9 pr-9 text-xs placeholder:text-white/30 [&::-webkit-search-cancel-button]:appearance-none ${focus}`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className={`absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-white/45 hover:text-white ${focus}`}
            >
              <X className="size-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </label>

        <div
          role="group"
          aria-label="Filter episodes"
          className="flex rounded-lg border border-white/10 bg-white/[0.03] p-1"
        >
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`relative min-h-9 rounded-md px-3 text-xs transition-colors ${focus} ${
                filter === item.id
                  ? "text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {filter === item.id && (
                <motion.span
                  layoutId={`episode-filter-${anime.id}`}
                  className="absolute inset-0 rounded-md bg-white/10"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 500, damping: 40 }
                  }
                />
              )}
              <span className="relative">{item.label}</span>
            </button>
          ))}
        </div>

        {!compact && (
          <div
            role="group"
            aria-label="Layout"
            className="flex rounded-lg border border-white/10 bg-white/[0.03] p-1"
          >
            {[
              { id: "grid", label: "Grid view", Icon: LayoutGrid },
              { id: "list", label: "List view", Icon: List },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={view === id}
                onClick={() => setView(id)}
                className={`flex size-9 items-center justify-center rounded-md transition-colors ${focus} ${
                  view === id
                    ? "bg-white/10 text-white"
                    : "text-white/45 hover:text-white/80"
                }`}
              >
                <Icon className="size-4" />
                <span className="sr-only">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Range chips */}
      {showRangeChips && (
        <div
          role="group"
          aria-label="Episode ranges"
          className="mb-4 flex gap-2 overflow-x-auto pb-1"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const start = (p - 1) * PAGE_SIZE + 1;
            const end = Math.min(p * PAGE_SIZE, knownCount);
            return (
              <button
                key={p}
                type="button"
                aria-pressed={page === p}
                onClick={() => changePage(p)}
                className={`min-h-9 shrink-0 rounded-full border px-3.5 text-xs transition-colors ${focus} ${
                  page === p
                    ? "border-red-500/40 bg-red-500/10 text-white"
                    : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
                }`}
              >
                {start}–{end}
              </button>
            );
          })}
        </div>
      )}

      {/* Status messages */}
      {resource.loading && (
        <p role="status" className="mb-4 text-xs text-white/50">
          Loading episode titles...
        </p>
      )}

      {resource.data?.unavailable && released === null && (
        <p className="mb-4 flex items-center gap-2 text-sm leading-6 text-white/50">
          <CalendarClock className="size-4 shrink-0" />
          Episode dates have not been confirmed for this title.
        </p>
      )}

      {/* Episode list */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={`${page}-${view}`}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={gridClass}
        >
          {resource.loading && !numbers.length
            ? Array.from({ length: compact ? 6 : 9 }, (_, i) => (
                <li key={i}>
                  <EpisodeSkeleton list={list} />
                </li>
              ))
            : visible.map((number) => {
                const episode = metadata.get(number);
                const available = isAvailable(number);
                const isSelected = selected === number;
                const isTarget = target === number && !isSelected;
                const date = formatDate(episode?.aired);
                const tag = episode?.recap
                  ? "Recap"
                  : episode?.filler
                    ? "Filler"
                    : null;

                const content = (
                  <>
                    <span
                      className={`relative flex size-11 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                        isSelected
                          ? "bg-red-600 text-white"
                          : available
                            ? "bg-white/5 text-white/50 group-hover:bg-red-600 group-hover:text-white"
                            : "bg-white/5 text-white/30"
                      }`}
                    >
                      {isSelected ? (
                        <Play className="size-4 fill-current" />
                      ) : available ? (
                        <>
                          <span className="transition-opacity group-hover:opacity-0">
                            {String(number).padStart(2, "0")}
                          </span>
                          <Play className="absolute size-4 fill-current opacity-0 transition-opacity group-hover:opacity-100" />
                        </>
                      ) : (
                        <Lock className="size-4" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">
                        {episode?.title || `Episode ${number}`}
                      </span>
                      <span className="mt-1 flex items-center gap-2 text-[11px] text-white/40">
                        {isSelected ? (
                          <span className="text-red-400">Now selected</span>
                        ) : !available ? (
                          <span className="flex items-center gap-1">
                            <CalendarClock className="size-3" />
                            {date || "Date unconfirmed or upcoming"}
                          </span>
                        ) : (
                          <span>{date || "Broadcast episode"}</span>
                        )}
                        {tag && available && (
                          <span className="rounded border border-white/15 px-1.5 py-px text-[10px] text-white/55">
                            {tag}
                          </span>
                        )}
                      </span>
                    </span>
                  </>
                );

                const classes = `group flex min-w-0 items-center gap-3 rounded-xl border p-3 transition-colors ${focus} ${
                  isSelected
                    ? "border-red-500/40 bg-red-500/10"
                    : isTarget
                      ? "border-red-500/30 bg-white/[0.04]"
                      : "border-white/10 bg-white/[0.025]"
                }`;

                return (
                  <li
                    key={number}
                    id={`episode-${anime.id}-${number}`}
                    className="min-w-0 scroll-mt-28"
                  >
                    {available ? (
                      <Link
                        href={watchHref(anime.id, number, audio)}
                        aria-current={isSelected ? "page" : undefined}
                        className={`${classes} hover:border-white/30 hover:bg-white/[0.05]`}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div
                        aria-disabled="true"
                        className={`${classes} opacity-50`}
                      >
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
        </motion.ul>
      </AnimatePresence>

      {/* Empty states */}
      {!resource.loading &&
        !resource.error &&
        (!numbers.length || (numbers.length > 0 && !visible.length)) && (
          <div className="mt-2 flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-white/50">
            {numbers.length ? (
              <>
                <Search className="size-5 text-white/30" />
                <p>No episodes match your search or filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                  className={`min-h-11 rounded-lg border border-white/15 px-4 text-xs text-white/80 hover:border-white/30 ${focus}`}
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <CalendarClock className="size-5 text-white/30" />
                <p>
                  {anime.status === "NOT_YET_RELEASED"
                    ? "Episodes will appear after broadcast dates are confirmed."
                    : "No episode information is available for this range."}
                </p>
              </>
            )}
          </div>
        )}

      {/* Pagination */}
      <nav
        aria-label="Episode pagination"
        className="mt-5 flex items-center justify-between gap-2"
      >
        <button
          type="button"
          className={button}
          disabled={page === 1}
          onClick={() => changePage(page - 1)}
        >
          <ChevronLeft className="size-4" />
          <span className="sr-only">Previous episode range</span>
        </button>
        <span className="text-xs text-white/45" aria-live="polite">
          Episodes {rangeStart}–{rangeEnd}
          {totalPages ? ` · Page ${page} of ${totalPages}` : ""}
        </span>
        <button
          type="button"
          className={button}
          disabled={
            totalPages ? page >= totalPages : !resource.data?.hasNextPage
          }
          onClick={() => changePage(page + 1)}
        >
          <ChevronRight className="size-4" />
          <span className="sr-only">Next episode range</span>
        </button>
      </nav>
    </section>
  );
}
