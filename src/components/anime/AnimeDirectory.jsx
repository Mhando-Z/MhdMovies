"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { useAnimeResource as useResource } from "./useAnimeResource";
import { formats, genres, label, statuses } from "@/lib/anime/model";
import {
  AnimeArtwork,
  AnimeCard,
  button,
  CardSkeletons,
  focus,
  grid,
  ResourceError,
  SectionHeading,
} from "./AnimeUI";
import { LibraryRows } from "./AnimeLibrary";
import AnimeHeroSection from "./AnimeHeroSection";

function SearchForm({ search, onSearch, pending }) {
  const [value, setValue] = useState(search);
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(value.trim());
      }}
      className="flex min-w-0 flex-1 gap-2"
    >
      <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 focus-within:border-red-500">
        <Search className="size-4 shrink-0 text-white/45" />
        <span className="sr-only">Search anime and donghua</span>
        <input
          type="search"
          minLength={2}
          maxLength={150}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search titles, worlds, and stories..."
          className="min-h-12 min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-white/35"
        />
      </label>
      <button
        className={`${button} bg-red-600 hover:bg-red-700`}
        disabled={pending}
      >
        Search
      </button>
    </form>
  );
}

function Featured({ resource }) {
  return (
    <AnimeHeroSection
      Trending={resource.data?.trending}
      loading={resource.loading}
    />
  );
}

export default function AnimeDirectory() {
  const params = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const query = params.toString();
  const previousQuery = useRef(query);
  useEffect(() => {
    if (query || previousQuery.current !== query)
      document
        .getElementById("anime-catalogue")
        ?.scrollIntoView({ behavior: "instant" });
    previousQuery.current = query;
  }, [query]);
  const catalogue = useResource(`/api/anime?${query}`);
  const page = Number(params.get("page") || 1);
  const country = params.get("country") || "";
  const filtered = [...params.keys()].some((key) =>
    [
      "search",
      "country",
      "genre",
      "year",
      "format",
      "status",
      "sort",
      "page",
    ].includes(key),
  );
  const home = useResource(filtered ? null : "/api/anime?view=home");
  function change(values) {
    const next = new URLSearchParams(params);
    next.delete("page");
    Object.entries(values).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key),
    );
    startTransition(() =>
      router.push(`/anime${next.size ? `?${next}` : ""}`, { scroll: false }),
    );
  }
  const selectClass = `min-h-11 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 text-sm text-white ${focus}`;
  return (
    <main className="min-h-screen font-roboto text-white">
      {!filtered && <Featured resource={home} />}
      <div
        className={`xl:mx-auto xl:container px-6 py-10 md:py-14 ${filtered || home.error ? "pt-28 md:pt-32" : ""}`}
      >
        {!filtered && (
          <>
            <LibraryRows />
            {home.error ? (
              <div className="mb-10">
                <ResourceError message={home.error} retry={home.retry} />
              </div>
            ) : home.loading ? (
              <div className="mb-12">
                <CardSkeletons />
              </div>
            ) : (
              [
                [
                  "trending",
                  "In the spotlight",
                  "This season",
                  "/anime?sort=trending",
                ],
                [
                  "popular",
                  "The stories everyone knows",
                  "All-time favourites",
                  "/anime?sort=popular",
                ],
                [
                  "airing",
                  "Follow the adventure",
                  "Currently airing",
                  "/anime?status=RELEASING&sort=popular",
                ],
                ["top", "Worth your time", "Top rated", "/anime?sort=score"],
                [
                  "upcoming",
                  "Something to look forward to",
                  "Coming soon",
                  "/anime?sort=upcoming",
                ],
              ].map(
                ([key, eyebrow, title, href]) =>
                  home.data?.[key]?.length > 0 && (
                    <section key={key} className="mb-14">
                      <SectionHeading
                        eyebrow={eyebrow}
                        title={title}
                        href={href}
                      />
                      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
                        {home.data?.[key]?.map((anime) => (
                          <AnimeCard key={anime.id} anime={anime} />
                        ))}
                      </div>
                    </section>
                  ),
              )
            )}
          </>
        )}
        <section
          id="anime-catalogue"
          aria-labelledby="anime-heading"
          className="scroll-mt-28"
        >
          <header className="mb-7">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
              Find your next favourite
            </p>
            <h2
              id="anime-heading"
              className="text-2xl font-bold tracking-tight md:text-3xl"
            >
              {country === "CN" ? "Explore donghua" : "Explore anime"}
            </h2>
            <p className="mt-3 text-sm text-white/50">
              Big adventures, quiet moments, and everything in between.
            </p>
          </header>
          <div
            aria-label="Discover anime collections"
            className="mb-6 flex gap-2 overflow-x-auto pb-2"
          >
            {[
              ["trending", "This season"],
              ["popular", "Most popular"],
              ["score", "Top rated"],
              ["airing", "Airing now"],
              ["upcoming", "Coming soon"],
              ["movies", "Anime movies"],
            ].map(([value, title]) => (
              <button
                key={value}
                type="button"
                aria-pressed={(params.get("sort") || "trending") === value}
                onClick={() => change({ sort: value, country: "", status: "" })}
                className={`${button} shrink-0 ${(params.get("sort") || "trending") === value ? "border-red-600 bg-red-600 hover:bg-red-700" : "text-white/60"}`}
              >
                {title}
              </button>
            ))}
          </div>
          <SearchForm
            key={params.get("search") || ""}
            search={params.get("search") || ""}
            onSearch={(search) => change({ search })}
            pending={pending}
          />
          <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ["genre", "Genre", genres.map((genre) => [genre, genre])],
              [
                "format",
                "Format",
                formats.map((format) => [format, label(format)]),
              ],
              [
                "status",
                "Status",
                statuses.map((status) => [status, label(status)]),
              ],
              [
                "sort",
                "Sort by",
                [
                  ["trending", "This season"],
                  ["popular", "Most popular"],
                  ["score", "Top rated"],
                  ["newest", "Newest"],
                  ["airing", "Airing now"],
                  ["upcoming", "Coming soon"],
                  ["movies", "Anime movies"],
                ],
              ],
            ].map(([key, title, options]) => (
              <label key={key} className="space-y-2 text-xs text-white/60">
                <span>{title}</span>
                <select
                  value={params.get(key) || (key === "sort" ? "trending" : "")}
                  onChange={(event) => change({ [key]: event.target.value })}
                  className={selectClass}
                >
                  {key !== "sort" && (
                    <option value="">Any {title.toLowerCase()}</option>
                  )}
                  {options.map(([value, text]) => (
                    <option key={value} value={value}>
                      {text}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <label className="space-y-2 text-xs text-white/60">
              <span>Release year</span>
              <input
                key={params.get("year") || "year"}
                type="number"
                min="1940"
                max="2100"
                defaultValue={params.get("year") || ""}
                placeholder="Any year"
                aria-label="Release year"
                className={selectClass}
                onBlur={(event) => {
                  if (
                    event.target.validity.valid &&
                    event.target.value !== (params.get("year") || "")
                  )
                    change({ year: event.target.value });
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.currentTarget.blur();
                }}
              />
            </label>
            <div className="flex items-end">
              <Link
                href="/anime"
                scroll={false}
                className={`${button} w-full text-white/60`}
              >
                Reset filters
              </Link>
            </div>
          </div>
          {(catalogue.data?.stale || home.data?.stale) && (
            <p
              role="status"
              className="mb-5 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-200"
            >
              Showing saved titles while the catalog reconnects.
            </p>
          )}
          {catalogue.data?.notice && (
            <p role="status" className="mb-5 text-xs text-white/55">
              {catalogue.data.notice}
            </p>
          )}
          <div
            aria-live="polite"
            className="mb-5 flex min-h-6 items-center justify-between text-xs text-white/45"
          >
            <span>
              {pending || catalogue.loading
                ? "Finding your next story..."
                : params.get("search")
                  ? `Results for “${params.get("search")}”`
                  : "Browse the collection"}
            </span>
            <span>Page {Number.isInteger(page) ? page : 1}</span>
          </div>
          {catalogue.loading ? (
            <CardSkeletons count={12} />
          ) : catalogue.error ? (
            <ResourceError message={catalogue.error} retry={catalogue.retry} />
          ) : catalogue.data?.results?.length ? (
            <div className={grid}>
              {catalogue.data.results.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/15 px-5 py-16 text-center">
              <Search className="mx-auto mb-4 size-8 text-white/30" />
              <h3 className="text-lg font-semibold">No stories found</h3>
              <p className="mt-2 text-sm text-white/50">
                Try another title or loosen your filters.
              </p>
              <Link href="/anime" className={`${button} mt-6`}>
                Clear filters
              </Link>
            </div>
          )}
          {catalogue.data && (
            <nav
              aria-label="Anime collection pages"
              className="mt-10 flex items-center justify-between border-t border-white/10 pt-6"
            >
              <button
                type="button"
                disabled={page <= 1 || pending}
                className={button}
                onClick={() => {
                  change({ page: String(page - 1) });
                  document
                    .getElementById("anime-catalogue")
                    ?.scrollIntoView({ behavior: "instant" });
                }}
              >
                <ChevronLeft className="size-4" />
                Previous
              </button>
              <span className="text-xs text-white/45">{page}</span>
              <button
                type="button"
                disabled={!catalogue.data.hasNextPage || page >= 500 || pending}
                className={button}
                onClick={() => {
                  change({ page: String(page + 1) });
                  document
                    .getElementById("anime-catalogue")
                    ?.scrollIntoView({ behavior: "instant" });
                }}
              >
                Next
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}
