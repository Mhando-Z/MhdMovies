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
import { useResource } from "@/components/tvSeries/TvUI";
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
  const anime =
    resource.data?.trending?.find((item) => item.banner) ||
    resource.data?.trending?.[0];
  return (
    <section className="relative isolate overflow-hidden border-b border-white/5">
      {anime && (
        <div className="absolute inset-0 -z-10">
          <AnimeArtwork
            src={anime.banner || anime.cover}
            className="h-full w-full"
            eager
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-black/20" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-black/30" />
        </div>
      )}
      <div className="mx-auto max-w-[1446px] px-5 pb-14 pt-32 md:px-10 md:pb-20 md:pt-44">
        <div className="max-w-2xl">
          <p className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-400">
            <Sparkles className="size-4" />
            The animation collection
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            {anime?.title || "Extraordinary worlds. Unforgettable stories."}
          </h1>
          {anime && (
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/70">
              {anime.score && (
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  {anime.score.toFixed(1)}
                </span>
              )}
              <span>{anime.year}</span>
              <span>{label(anime.format)}</span>
              <span>{anime.country === "CN" ? "Donghua" : "Anime"}</span>
            </div>
          )}
          <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-7 text-white/65">
            {anime?.description ||
              "Discover Japanese anime and Chinese donghua, from the next big adventure to your new comfort watch."}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {anime && (
              <Link
                href={`/anime/${anime.id}`}
                className={`${button} border-red-600 bg-red-600 hover:bg-red-700`}
              >
                View details <ArrowRight className="size-4" />
              </Link>
            )}
            <a href="#anime-catalogue" className={button}>
              Explore the collection
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.2em] text-white/45">
          <span>Japanese anime</span>
          <span>Chinese donghua</span>
          <span>One collection. Endless worlds.</span>
        </div>
      </div>
    </section>
  );
}

export default function AnimeDirectory() {
  const params = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const home = useResource("/api/anime?view=home");
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
    <main className="min-h-screen bg-black font-roboto text-white">
      <Featured resource={home} />
      <div className="mx-auto max-w-[1446px] px-5 py-10 md:px-10 md:py-14">
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
                  "Trending now",
                  "/anime?sort=trending",
                ],
                [
                  "donghua",
                  "Stories from China",
                  "Popular donghua",
                  "/anime?country=CN&sort=popular",
                ],
                [
                  "airing",
                  "Follow the adventure",
                  "Currently airing",
                  "/anime?status=RELEASING&sort=popular",
                ],
              ].map(([key, eyebrow, title, href]) => (
                <section key={key} className="mb-14">
                  <SectionHeading eyebrow={eyebrow} title={title} href={href} />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
                    {home.data?.[key]?.map((anime) => (
                      <AnimeCard key={anime.id} anime={anime} />
                    ))}
                  </div>
                </section>
              ))
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
              className="text-3xl font-bold tracking-tight md:text-4xl"
            >
              {country === "CN" ? "Explore donghua" : "Explore anime"}
            </h2>
            <p className="mt-3 text-sm text-white/50">
              Big adventures, quiet moments, and everything in between.
            </p>
          </header>
          <div
            aria-label="Animation origin"
            className="mb-6 flex gap-2 overflow-x-auto pb-2"
          >
            {[
              ["", "All animation"],
              ["JP", "Japanese anime"],
              ["CN", "Donghua"],
            ].map(([value, title]) => (
              <button
                key={value}
                type="button"
                aria-pressed={country === value}
                onClick={() => change({ country: value })}
                className={`${button} shrink-0 ${country === value ? "border-red-600 bg-red-600 hover:bg-red-700" : "text-white/60"}`}
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
                  ["trending", "Trending"],
                  ["popular", "Most popular"],
                  ["score", "Top rated"],
                  ["newest", "Newest"],
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
                    <option value="">All {title.toLowerCase()}s</option>
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
        <p className="mt-12 text-xs leading-6 text-white/35">
          Catalog information from{" "}
          <a
            href="https://anilist.co"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            AniList
          </a>
          . Broadcast dates and episode availability may differ.
        </p>
      </div>
    </main>
  );
}
