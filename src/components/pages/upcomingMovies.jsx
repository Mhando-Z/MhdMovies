"use client";

import { useState } from "react";
import { CalendarClock, MinusCircle, PlusCircle } from "lucide-react";
import { useMovies } from "@/context/movieContext";
import MoviePoster from "@/components/moviePoster";
import {
  filterUpcomingMovies,
  UPCOMING_BATCH_SIZE,
} from "@/lib/upcomingMovies";

const INITIAL_COUNT = 14;

const GRID_CLASSES =
  "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 md:gap-x-5 md:gap-y-10 lg:grid-cols-5 xl:grid-cols-6";

export default function UpcomingMovies() {
  const {
    UpComingMovies: loadedUpcomingMovies,
    upcomingLoading: loading,
    upcomingError: error,
    hasMoreUpcoming,
    loadMoreUpcoming,
  } = useMovies();
  const UpComingMovies = filterUpcomingMovies(loadedUpcomingMovies);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const expanded = visibleCount > INITIAL_COUNT;
  const movies = UpComingMovies.slice(0, visibleCount);
  const canShowMore = UpComingMovies.length > visibleCount || hasMoreUpcoming;

  async function showMore() {
    if (UpComingMovies.length <= visibleCount) {
      const loaded = await loadMoreUpcoming();
      if (!loaded) return;
    }
    setVisibleCount((count) => count + UPCOMING_BATCH_SIZE);
  }

  return (
    <section
      aria-labelledby="upcoming-movies-heading"
      aria-busy={loading}
      className="w-full px-4 py-12 font-roboto text-white md:px-8 md:py-16 xl:container xl:mx-auto"
    >
      {/* Header */}
      <header className="mb-8 md:mb-10">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-600/10  md:size-12"
          >
            <CalendarClock className="size-6 text-red-500 md:size-12" />
          </span>

          <div className="min-w-0">
            <h2
              id="upcoming-movies-heading"
              className="text-2xl font-bold leading-tight tracking-tight md:text-4xl"
            >
              Upcoming Movies
            </h2>
            <p className="mt-1 text-sm text-white/60 md:text-base">
              Discover the movies coming soon.
            </p>
          </div>

          <div
            aria-hidden="true"
            className="ml-4 hidden h-px flex-1 bg-linear-to-r from-red-600/50 to-transparent md:block"
          />
        </div>
      </header>

      {/* Loading skeleton */}
      {loading && UpComingMovies.length === 0 ? (
        <div role="status">
          <span className="sr-only">Loading upcoming movies...</span>
          <div aria-hidden="true" className={GRID_CLASSES}>
            {Array.from({ length: INITIAL_COUNT }, (_, index) => (
              <div key={index} className="motion-safe:animate-pulse">
                <div className="aspect-2/3 rounded-xl bg-white/10 ring-1 ring-white/10" />
                <div className="mt-3 h-3 w-3/4 rounded bg-white/10" />
                <div className="mt-2 h-3 w-1/3 rounded bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      ) : UpComingMovies.length === 0 ? (
        /* Empty / error state */
        <div
          role={error ? "alert" : "status"}
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-16 text-center"
        >
          <Flame aria-hidden="true" className="size-8 text-white/40" />
          <p className="max-w-sm text-sm text-white/70 md:text-base">
            {error
              ? "Unable to load upcoming movies. Please try again later."
              : "No upcoming movies are available right now."}
          </p>
          {hasMoreUpcoming && (
            <button
              type="button"
              disabled={loading}
              onClick={loadMoreUpcoming}
              className="min-h-11 cursor-pointer rounded-full bg-red-600 px-6 py-2 text-sm font-semibold hover:bg-red-700 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {loading ? "Loading..." : error ? "Try Again" : "Show More"}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Movie grid */}
          <div className={GRID_CLASSES}>
            {movies
              ?.filter((movie) => movie.poster_path)
              ?.map((movie) => (
                <MoviePoster
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  image={movie.poster_path}
                  image2={movie.backdrop_path}
                  rating={movie.vote_average}
                  overview={movie.overview}
                />
              ))}
          </div>

          {/* Inline error */}
          {error && (
            <p
              role="alert"
              className="mt-8 rounded-lg border border-red-500/30 bg-red-600/10 px-4 py-3 text-center text-sm text-red-400"
            >
              Unable to load more upcoming movies. Please try again.
            </p>
          )}

          {/* Footer controls */}
          {(UpComingMovies.length > INITIAL_COUNT || hasMoreUpcoming) && (
            <div className="mt-12 flex flex-row justify-between items-center gap-5">
              <div className="flex flex-col gap-2">
                <p
                  className="text-xs text-white/50 md:text-sm"
                  aria-live="polite"
                >
                  Showing {movies.length} upcoming movies
                </p>
                <div
                  aria-hidden="true"
                  className="h-1 w-44 overflow-hidden rounded-full bg-white/10"
                >
                  <div
                    className="h-full rounded-full bg-red-600 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (movies.length / Math.max(UpComingMovies.length, 1)) *
                          100,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {canShowMore && (
                  <button
                    type="button"
                    aria-expanded={expanded}
                    disabled={loading}
                    onClick={showMore}
                    className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 hover:shadow-red-700/30 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 disabled:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <PlusCircle aria-hidden="true" className="size-4" />
                    {loading ? "Loading..." : "Show More"}
                  </button>
                )}
                {expanded && (
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setVisibleCount(INITIAL_COUNT)}
                    className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-white/10 px-6 py-2 text-sm font-semibold ring-1 ring-white/10 transition-all hover:bg-white/20 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <MinusCircle aria-hidden="true" className="size-4" />
                    Show Less
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
