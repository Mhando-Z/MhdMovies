"use client";

import { useState } from "react";
import { Flame, MinusCircle, PlusCircle } from "lucide-react";
import MoviePoster from "@/components/moviePoster";
import { useMovies } from "@/context/movieContext";

const INITIAL_COUNT = 14;

export default function TrendingMovies() {
  const { Trending, loading, error } = useMovies();
  const [expanded, setExpanded] = useState(false);
  const movies = expanded ? Trending : Trending.slice(0, INITIAL_COUNT);

  return (
    <section
      aria-labelledby="trending-movies-heading"
      aria-busy={loading}
      className="w-full px-4 py-10 font-roboto text-white md:px-8 md:py-14 xl:container xl:mx-auto"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Flame aria-hidden="true" className="size-7 text-red-500 md:size-8" />
          <h2 id="trending-movies-heading" className="text-2xl font-bold tracking-tight md:text-4xl">
            Trending Movies
          </h2>
          <div aria-hidden="true" className="ml-4 hidden h-px flex-1 bg-linear-to-r from-red-600/50 to-transparent md:block" />
        </div>
        <p className="mt-2 text-sm text-white/60 md:text-base">
          Discover the movies trending today.
        </p>
      </div>

      {loading && Trending.length === 0 ? (
        <div role="status">
          <span className="sr-only">Loading trending movies...</span>
          <div aria-hidden="true" className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: INITIAL_COUNT }, (_, index) => (
              <div key={index} className="aspect-[2/3] rounded-lg bg-white/10 motion-safe:animate-pulse" />
            ))}
          </div>
        </div>
      ) : Trending.length === 0 ? (
        <p role={error ? "alert" : "status"} className="rounded-lg border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          {error ? "Unable to load trending movies. Please try again later." : "No trending movies are available right now."}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.map((movie) => (
              <MoviePoster
                key={movie.id}
                id={movie.id}
                title={movie.title}
                image={movie.poster_path}
                image2={movie.backdrop_path}
                rating={movie.vote_average}
              />
            ))}
          </div>
          {Trending.length > INITIAL_COUNT && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpanded((value) => !value)}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {expanded ? <MinusCircle aria-hidden="true" className="size-4" /> : <PlusCircle aria-hidden="true" className="size-4" />}
                {expanded ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
