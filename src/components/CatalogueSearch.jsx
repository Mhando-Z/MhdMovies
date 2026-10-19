"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Film,
  Search,
  Tv,
} from "lucide-react";
import { Artwork, Modal } from "./pages/movieDetailsUI";
import { button, focus, ResourceError, useResource } from "./tvSeries/TvUI";

export default function CatalogueSearch({ onClose }) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  useEffect(() => {
    const timeout = setTimeout(() => setQuery(input.trim()), 300);
    return () => clearTimeout(timeout);
  }, [input]);
  const ready = query.length >= 2 && input.trim() === query;
  const { data, loading, error, retry } = useResource(
    ready
      ? `/api/search?${new URLSearchParams({ query, type, page: String(page) })}`
      : null,
  );
  return (
    <Modal title="Search movies and TV series" onClose={onClose} wide>
      <div className="p-5 md:p-8">
        <header>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
            Find your next story
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Search movies & series
          </h2>
        </header>
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            setQuery(input.trim());
            setPage(1);
          }}
          className="mt-6"
        >
          <label className="flex min-h-14 items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-4 focus-within:border-red-500">
            <Search
              aria-hidden="true"
              className="size-5 shrink-0 text-white/45"
            />
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
              className="min-w-0 flex-1 bg-transparent py-4 text-base text-white outline-none placeholder:text-white/35"
            />
          </label>
        </form>
        <div aria-label="Search category" className="my-5 flex gap-2">
          {[
            ["all", "All titles", Search],
            ["movie", "Movies", Film],
            ["tv", "TV Series", Tv],
          ].map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              aria-pressed={type === value}
              onClick={() => {
                setType(value);
                setPage(1);
              }}
              className={`flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs font-medium sm:px-4 ${focus} ${type === value ? "bg-red-600 text-white" : "border border-white/10 text-white/50 hover:bg-white/5"}`}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </button>
          ))}
        </div>
        {!ready ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center text-white/40">
            <Search aria-hidden="true" className="size-8" />
            <p className="text-sm">
              {input.trim().length >= 2
                ? "Preparing your search..."
                : "Enter at least two characters to discover a title."}
            </p>
          </div>
        ) : loading ? (
          <p role="status" className="py-16 text-center text-sm text-white/50">
            Searching the collection...
          </p>
        ) : error ? (
          <ResourceError message={error} retry={retry} />
        ) : (
          <>
            <p role="status" className="mb-4 text-xs text-white/40">
              {data?.results?.length
                ? `Results for “${query}” · Page ${page}`
                : `No titles found for “${query}”. Try another title or category.`}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {data?.results?.map((item) => {
                const television = item.media_type === "tv";
                const title = item.title || item.name;
                return (
                  <Link
                    key={`${item.media_type}-${item.id}`}
                    href={`/${television ? "series" : "movies"}/${item.id}`}
                    onClick={onClose}
                    className={`group flex min-w-0 items-center gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-3 transition-colors hover:border-white/25 hover:bg-white/5 ${focus}`}
                  >
                    <Artwork
                      path={item.poster_path}
                      alt=""
                      className="aspect-2/3 w-14 shrink-0 rounded-md object-cover sm:w-16"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-[10px] uppercase tracking-widest text-red-400">
                        {television ? "TV Series" : "Movie"}
                      </p>
                      <h3 className="line-clamp-2 text-sm font-semibold text-white/90">
                        {title}
                      </h3>
                      <p className="mt-1 text-xs text-white/40">
                        {(item.release_date || item.first_air_date)?.slice(
                          0,
                          4,
                        ) || "Date TBA"}
                        {item.vote_average > 0
                          ? ` · ${item.vote_average.toFixed(1)} / 10`
                          : ""}
                      </p>
                    </div>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-white/30 group-hover:text-red-400"
                    />
                  </Link>
                );
              })}
            </div>
            {data && data.total_pages > 1 && (
              <nav
                aria-label="Search results pages"
                className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5"
              >
                <button
                  type="button"
                  className={button}
                  disabled={page <= 1}
                  onClick={() => setPage((value) => value - 1)}
                >
                  <ChevronLeft className="size-4" /> Previous
                </button>
                <span className="text-xs text-white/40">
                  {page} / {data.total_pages}
                </span>
                <button
                  type="button"
                  className={button}
                  disabled={page >= data.total_pages}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next <ChevronRight className="size-4" />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
