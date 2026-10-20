"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Search,
  X,
} from "lucide-react";
import { ActorError, Portrait, useActorResource } from "./ActorUI";

function ActorCard({ person, index }) {
  const knownFor = (person.known_for ?? [])
    .map((item) => item.title || item.name)
    .filter(Boolean);
  return (
    <Link
      href={`/actors/${person.id}`}
      className="actor-card actor-reveal"
      style={{ "--delay": `${Math.min(index, 9) * 35}ms` }}
    >
      <div className="actor-card-art">
        <Portrait
          path={person.profile_path}
          name={person.name}
          className="h-full w-full object-cover object-top"
        />
        <span className="actor-card-arrow">
          <ArrowUpRight className="size-5" aria-hidden="true" />
        </span>
        <span className="actor-card-label">View profile</span>
      </div>
      <div className="pt-4">
        <h3 className="text-base font-semibold tracking-tight sm:text-lg">
          {person.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-white/50">
          {knownFor.join(" · ") || "Explore their filmography"}
        </p>
      </div>
    </Link>
  );
}

export default function ActorsDirectory() {
  const [mode, setMode] = useState("popular");
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [featured, setFeatured] = useState([]);
  const params = new URLSearchParams({
    mode,
    page: String(page),
    ...(query ? { query } : {}),
  });
  const { data, loading, error, retry } = useActorResource(
    `/api/actors?${params}`,
  );

  useEffect(() => {
    if (data && !query && page === 1 && !featured.length) {
      setFeatured(
        data.results.filter((person) => person.profile_path).slice(0, 6),
      );
    }
  }, [data, query, page, featured.length]);

  function changePage(next) {
    setPage(next);
    document
      .getElementById("actors-list")
      ?.scrollIntoView({ block: "start", behavior: "instant" });
  }

  function clearSearch() {
    setInput("");
    setQuery("");
    setPage(1);
  }

  return (
    <main className="actors-page">
      <section className="actors-hero" aria-labelledby="actors-title">
        <div className="xl:mx-auto xl:container px-8 relative z-10">
          <div className="actors-hero-copy actor-reveal">
            <p className="actor-eyebrow">
              <span /> The people behind the stories
            </p>
            <h1 id="actors-title">
              Great stories.
              <br />
              Unforgettable <em>faces.</em>
            </h1>
            <p className="mt-6 max-w-md text-base leading-8 text-white/60">
              From familiar favorites to your next discovery. Meet the actors
              who bring a world of stories to life.
            </p>
            <a href="#actors-list" className="actor-button mt-8">
              Explore actors <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            <p className="mt-8 flex items-center gap-2 text-xs tracking-wide text-white/40">
              <Globe2 className="size-4" aria-hidden="true" /> Talent from
              around the world
            </p>
          </div>
        </div>
        <div className="actors-portrait-wall" aria-hidden="true">
          {Array.from({ length: 3 }, (_, column) => (
            <div className="actors-portrait-column" key={column}>
              {[column * 2, column * 2 + 1].map((index) => (
                <div className="actors-wall-portrait" key={index}>
                  <Portrait
                    path={featured[index]?.profile_path}
                    className="h-full w-full object-cover object-top"
                    eager
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="actors-hero-shade" aria-hidden="true" />
      </section>

      <section
        id="actors-list"
        className="xl:mx-auto xl:container px-8 scroll-mt-24 pb-16 pt-10 sm:pt-16"
        aria-labelledby="actors-list-title"
      >
        <div className="actors-directory-heading">
          <div>
            <p className="actor-eyebrow mb-3">The talent directory</p>
            <h2
              id="actors-list-title"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {query ? "Find a familiar face." : "In the spotlight."}
            </h2>
          </div>
          <form
            role="search"
            className="actor-search"
            onSubmit={(event) => {
              event.preventDefault();
              setQuery(input.trim());
              setPage(1);
            }}
          >
            <Search
              className="size-4 shrink-0 text-white/40"
              aria-hidden="true"
            />
            <label htmlFor="actor-search" className="sr-only">
              Search actors by name
            </label>
            <input
              id="actor-search"
              type="search"
              placeholder="Search actors by name..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={200}
            />
            <button
              type="submit"
              className="actor-search-submit"
              aria-label="Search actors"
            >
              <ArrowUpRight className="size-5" aria-hidden="true" />
            </button>
          </form>
        </div>

        <div className="actors-directory-toolbar">
          {query ? (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-white/60">
                Results for <strong className="text-white">“{query}”</strong>
              </span>
              <button
                className="actor-clear"
                onClick={clearSearch}
                type="button"
              >
                <X className="size-3.5" aria-hidden="true" /> Clear search
              </button>
            </div>
          ) : (
            <div
              className="actor-tabs"
              role="group"
              aria-label="Discover actors"
            >
              {[
                ["popular", "Popular now"],
                ["trending", "Trending this week"],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={mode === value}
                  onClick={() => {
                    setMode(value);
                    setPage(1);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-white/40">Curated by popularity on TMDB</p>
        </div>

        <div aria-busy={loading}>
          {loading ? (
            <div
              className="actors-grid"
              role="status"
              aria-label="Loading actors"
            >
              {Array.from({ length: 12 }, (_, index) => (
                <div key={index} className="motion-safe:animate-pulse">
                  <div className="aspect-[3/4] rounded-xl bg-white/[0.06]" />
                  <div className="mt-4 h-4 w-3/4 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-white/5" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ActorError message={error} onRetry={retry} />
          ) : data?.results.length ? (
            <div className="actors-grid" key={`${query}-${mode}-${page}`}>
              {data.results.map((person, index) => (
                <ActorCard key={person.id} person={person} index={index} />
              ))}
            </div>
          ) : (
            <div className="actor-empty" role="status">
              <Search
                className="mx-auto mb-4 size-7 text-white/40"
                aria-hidden="true"
              />
              <h3 className="text-xl font-semibold">
                {data?.total_pages > 1
                  ? "No actors on this page."
                  : "No matching actors."}
              </h3>
              <p className="mt-3 text-sm text-white/50">
                {data?.total_pages > 1
                  ? "Try another page, or search for an actor by name."
                  : "Try another name or explore the actors in the spotlight."}
              </p>
              {query && (
                <button
                  type="button"
                  className="actor-button mt-6"
                  onClick={clearSearch}
                >
                  Explore actors
                </button>
              )}
            </div>
          )}
        </div>

        {!loading && !error && data && data.total_pages > 0 && (
          <nav className="actors-pagination" aria-label="Actor directory pages">
            <button
              type="button"
              className="actor-button actor-button-secondary"
              disabled={page <= 1}
              onClick={() => changePage(page - 1)}
            >
              <ChevronLeft className="size-4" aria-hidden="true" /> Previous
            </button>
            <p
              className="text-xs tabular-nums text-white/50"
              aria-live="polite"
            >
              Page <span className="text-white">{page}</span> of{" "}
              {data.total_pages}
            </p>
            <button
              type="button"
              className="actor-button actor-button-secondary"
              disabled={page >= data.total_pages}
              onClick={() => changePage(page + 1)}
            >
              Next <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}
