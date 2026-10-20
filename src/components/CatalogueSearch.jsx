"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Film,
  Loader2,
  Search,
  SearchX,
  Star,
  Tv,
  X,
} from "lucide-react";
import { Artwork, Modal } from "./pages/movieDetailsUI";
import { button, focus, ResourceError, useResource } from "./tvSeries/TvUI";

const CATEGORIES = [
  { value: "all", label: "All titles", Icon: Search },
  { value: "movie", label: "Movies", Icon: Film },
  { value: "tv", label: "TV Series", Icon: Tv },
];

function ResultSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-3"
    >
      <div className="aspect-2/3 w-14 shrink-0 animate-pulse rounded-md bg-white/10 sm:w-16" />
      <div className="flex-1 space-y-2.5">
        <div className="h-4 w-16 animate-pulse rounded-full bg-white/10" />
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
}

function StateMessage({ icon: Icon, title, children }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <Icon aria-hidden="true" className="size-6 text-white/40" />
      </span>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-white/80">{title}</p>
        <p className="mx-auto max-w-xs text-xs leading-relaxed text-white/40">
          {children}
        </p>
      </div>
    </div>
  );
}

export default function CatalogueSearch({ onClose }) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => setQuery(input.trim()), 300);
    return () => clearTimeout(timeout);
  }, [input]);

  const trimmed = input.trim();
  const ready = query.length >= 2 && trimmed === query;
  const { data, loading, error, retry } = useResource(
    ready
      ? `/api/search?${new URLSearchParams({ query, type, page: String(page) })}`
      : null,
  );

  const results = data?.results ?? [];
  const searching = trimmed.length >= 2 && (!ready || loading);

  return (
    <Modal title="Search movies and TV series" onClose={onClose} wide>
      <div className="p-5 md:p-8">
        {/* Header */}
        <header className="flex items-center gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-600/10">
            <Clapperboard aria-hidden="true" className="size-5 text-red-400" />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight">
              Search movies & series
            </h2>
            <p className="mt-1 text-sm text-white/40">
              Find your next story across the whole collection.
            </p>
          </div>
        </header>

        {/* Search field */}
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            setQuery(input.trim());
            setPage(1);
          }}
          className="mt-6"
        >
          <label className="flex min-h-14 items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 transition-colors focus-within:border-red-500 focus-within:bg-white/[0.07] focus-within:ring-4 focus-within:ring-red-500/15">
            {searching ? (
              <Loader2
                aria-hidden="true"
                className="size-5 shrink-0 animate-spin text-red-400"
              />
            ) : (
              <Search
                aria-hidden="true"
                className="size-5 shrink-0 text-white/45"
              />
            )}
            <span className="sr-only">Movie or TV series title</span>
            <input
              autoFocus
              type="search"
              value={input}
              maxLength={200}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  onClose();
                }
              }}
              onChange={(event) => {
                setInput(event.target.value);
                setPage(1);
              }}
              placeholder="Search for a movie or TV series..."
              className="min-w-0 flex-1 bg-transparent py-4 text-base text-white outline-none placeholder:text-white/35 [&::-webkit-search-cancel-button]:hidden"
            />
            {input ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setInput("");
                  setQuery("");
                  setPage(1);
                }}
                className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white ${focus}`}
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            ) : (
              <kbd className="hidden shrink-0 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-medium text-white/40 sm:block">
                Esc
              </kbd>
            )}
          </label>
        </form>

        {/* Category filter */}
        <div
          role="group"
          aria-label="Search category"
          className="my-5 inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-1"
        >
          {CATEGORIES.map(({ value, label, Icon }) => {
            const active = type === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setType(value);
                  setPage(1);
                }}
                className={`flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-medium transition-colors sm:px-4 ${focus} ${
                  active
                    ? "bg-red-600 text-white shadow-lg shadow-red-950/40"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        {!ready && !searching ? (
          <StateMessage icon={Search} title="Start typing to search">
            Enter at least two characters to discover a movie or TV series.
          </StateMessage>
        ) : !ready || loading ? (
          <div role="status" aria-label="Searching the collection">
            <p className="mb-4 text-xs text-white/40">
              Searching the collection...
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <ResultSkeleton key={index} />
              ))}
            </div>
          </div>
        ) : error ? (
          <ResourceError message={error} retry={retry} />
        ) : results.length === 0 ? (
          <StateMessage icon={SearchX} title={`No titles found for “${query}”`}>
            Check the spelling, try a shorter title, or switch to another
            category.
          </StateMessage>
        ) : (
          <>
            <div
              role="status"
              className="mb-4 flex items-center justify-between gap-3 text-xs text-white/40"
            >
              <p className="min-w-0 truncate">
                Results for{" "}
                <span className="font-medium text-white/70">“{query}”</span>
              </p>
              {data?.total_results > 0 && (
                <p className="shrink-0">
                  {data.total_results.toLocaleString()} found
                </p>
              )}
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {results.map((item) => {
                const television = item.media_type === "tv";
                const title = item.title || item.name;
                const year = (item.release_date || item.first_air_date)?.slice(
                  0,
                  4,
                );
                const TypeIcon = television ? Tv : Film;
                return (
                  <li key={`${item.media_type}-${item.id}`} className="min-w-0">
                    <Link
                      href={`/${television ? "series" : "movies"}/${item.id}`}
                      onClick={onClose}
                      className={`group flex h-full min-w-0 items-center gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-3 transition-all hover:border-red-500/40 hover:bg-white/[0.06] ${focus}`}
                    >
                      <Artwork
                        path={item.poster_path}
                        alt=""
                        className="aspect-2/3 w-14 shrink-0 rounded-md object-cover ring-1 ring-white/10 sm:w-16"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-red-500/25 bg-red-600/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
                          <TypeIcon aria-hidden="true" className="size-3" />
                          {television ? "TV Series" : "Movie"}
                        </span>
                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white/90 group-hover:text-white">
                          {title}
                        </h3>
                        <div className="mt-2 flex items-center gap-3 text-xs text-white/40">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays
                              aria-hidden="true"
                              className="size-3.5"
                            />
                            {year || "Date TBA"}
                          </span>
                          {item.vote_average > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Star
                                aria-hidden="true"
                                className="size-3.5 fill-red-400 text-red-400"
                              />
                              <span className="text-white/60">
                                {item.vote_average.toFixed(1)}
                              </span>
                              <span className="sr-only">out of 10</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/30 transition-colors group-hover:border-red-500/40 group-hover:bg-red-600/10 group-hover:text-red-400">
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {data && data.total_pages > 1 && (
              <nav
                aria-label="Search results pages"
                className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5"
              >
                <button
                  type="button"
                  className={`${button} disabled:cursor-not-allowed disabled:opacity-40`}
                  disabled={page <= 1}
                  onClick={() => setPage((value) => value - 1)}
                >
                  <ChevronLeft aria-hidden="true" className="size-4" /> Previous
                </button>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
                  Page <span className="text-white/80">{page}</span> of{" "}
                  {data.total_pages}
                </span>
                <button
                  type="button"
                  className={`${button} disabled:cursor-not-allowed disabled:opacity-40`}
                  disabled={page >= data.total_pages}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next <ChevronRight aria-hidden="true" className="size-4" />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
