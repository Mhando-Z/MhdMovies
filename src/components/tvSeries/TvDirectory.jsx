"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  Play,
  Star,
  Tv,
} from "lucide-react";
import { useTvSeries } from "@/context/tvseriesContext";
import { Artwork } from "@/components/pages/movieDetailsUI";
import TvSeriesPoster from "./TvSeriesPoster";
import { button, focus, grid, ResourceError, CardSkeletons } from "./TvUI";
import TvHeroSection from "./TvHeroSection";

const categories = [
  ["trending", "Trending this week"],
  ["popular", "Popular"],
  ["top_rated", "Top rated"],
  ["on_the_air", "Airing this week"],
];

function TvHero({ resource }) {
  const [index, setIndex] = useState(0);
  const lineup = (resource.data?.results || [])
    .filter((item) => item.backdrop_path)
    .slice(0, 6);
  const show = lineup[index % (lineup.length || 1)];
  if (!show)
    return (
      <section className="flex min-h-[60svh] items-center px-5 pt-28 text-white md:px-10 xl:container xl:mx-auto">
        <div className="max-w-xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-red-400">
            The series collection
          </p>
          <h1 className="text-5xl font-bold tracking-tight">
            Your next obsession.
          </h1>
          <p className="mt-5 leading-7 text-white/55">
            Discover remarkable stories, one episode at a time.
          </p>
          {resource.error && (
            <div className="mt-6">
              <ResourceError message={resource.error} retry={resource.retry} />
            </div>
          )}
        </div>
      </section>
    );
  const genreNames =
    show.genre_ids
      ?.map((id) => resource.genres?.find((genre) => genre.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3) || [];
  return (
    <section
      aria-label="Featured TV series"
      className="relative isolate min-h-[640px] overflow-hidden text-white md:min-h-[740px]"
    >
      <div className="absolute inset-0 -z-10">
        <Artwork
          key={show.id}
          path={show.backdrop_path}
          eager
          size="original"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/60 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-black/30" />
      </div>
      <div className="px-5 pb-12 pt-36 md:px-10 md:pt-44 xl:container xl:mx-auto">
        <div className="max-w-2xl">
          <p className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
            <span className="h-5 w-1 rounded bg-red-600" /> Trending this week
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {show.name}
          </h1>
          <div className="my-6 flex flex-wrap items-center gap-5 text-sm text-white/75">
            <span className="flex items-center gap-2">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {show.vote_average > 0 ? show.vote_average.toFixed(1) : "NR"}
            </span>
            <span>{show.first_air_date?.slice(0, 4)}</span>
            <span className="rounded border border-white/25 px-2 py-0.5 text-[10px] uppercase tracking-widest">
              TV Series
            </span>
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {genreNames.map((name) => (
              <span
                key={name}
                className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70"
              >
                {name}
              </span>
            ))}
          </div>
          <p className="line-clamp-3 max-w-xl text-sm leading-7 text-white/70 md:text-base">
            {show.overview}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/series/${show.id}`}
              className={`${button} border-red-600 bg-red-600 hover:bg-red-700`}
            >
              <Play className="size-4 fill-current" /> Explore series
            </Link>
            <a href="#series-catalogue" className={button}>
              Browse collection <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-end justify-between gap-6">
          <div className="flex gap-2" aria-label="Featured series selector">
            {lineup.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Feature ${item.name}`}
                aria-pressed={show.id === item.id}
                className={`min-h-11 rounded px-2 ${focus}`}
              >
                <span
                  className={`block h-1 rounded-full transition-all ${show.id === item.id ? "w-10 bg-red-500" : "w-5 bg-white/30"}`}
                />
              </button>
            ))}
          </div>
          <p className="flex items-center gap-2 text-xs text-white/40">
            <Tv className="size-4" /> Great stories. More episodes.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function TvDirectory() {
  const {
    category,
    genre,
    page,
    setPage,
    changeCategory,
    changeGenre,
    featured,
    genres,
    catalogue,
  } = useTvSeries();
  function goToPage(value) {
    setPage(value);
    document
      .getElementById("series-catalogue")
      ?.scrollIntoView({ behavior: "instant" });
  }

  return (
    <main className="min-h-screen bg-black font-roboto text-white">
      {/* TvHero section */}
      <TvHeroSection Trending={featured?.data?.results} />

      <section
        id="series-catalogue"
        aria-labelledby="series-heading"
        className="scroll-mt-24 px-5 py-12 md:px-10 md:py-16 xl:container xl:mx-auto"
      >
        <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
              Find your next favourite
            </p>
            <h2
              id="series-heading"
              className="flex items-center gap-3 text-3xl font-bold tracking-tight md:text-4xl"
            >
              <Flame className="size-8 text-red-500" /> TV Series
            </h2>
            <p className="mt-3 text-sm text-white/50">
              New worlds. Familiar faces. Stories worth staying for.
            </p>
          </div>
          <label className="flex items-center gap-3 text-xs text-white/60">
            Genre
            <select
              value={genre}
              onChange={(event) => changeGenre(event.target.value)}
              className={`min-h-11 max-w-52 rounded-lg border border-white/15 bg-zinc-950 px-3 text-sm text-white focus:outline-0`}
            >
              <option value="">All genres</option>
              {genres.data?.genres?.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </header>
        <div
          aria-label="Browse TV categories"
          className="mb-8 flex gap-2 overflow-x-auto pb-2"
        >
          {categories.map(([value, label]) => (
            <button
              type="button"
              key={value}
              onClick={() => changeCategory(value)}
              aria-pressed={!genre && category === value}
              className={`min-h-11 cursor-pointer shrink-0 rounded-lg px-4 text-sm transition-colors ${focus} ${!genre && category === value ? "bg-red-600 text-white" : "border border-white/10 text-white/55 hover:bg-white/5 hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {catalogue.loading ? (
          <CardSkeletons count={12} />
        ) : catalogue.error ? (
          <ResourceError message={catalogue.error} retry={catalogue.retry} />
        ) : catalogue.data?.results?.length ? (
          <div className={grid}>
            {catalogue.data.results.map((show) => (
              <TvSeriesPoster key={show.id} show={show} />
            ))}
          </div>
        ) : (
          <p
            role="status"
            className="rounded-xl border border-dashed border-white/15 p-12 text-center text-white/50"
          >
            No series found. Try another genre.
          </p>
        )}
        {catalogue.data && catalogue.data.total_pages > 1 && (
          <nav
            aria-label="Series collection pages"
            className="mt-10 flex items-center justify-between gap-3 border-t border-white/10 pt-6"
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
              className={button}
            >
              <ChevronLeft className="size-4" /> Previous
            </button>
            <span className="text-xs text-white/45">
              {page} / {catalogue.data.total_pages}
            </span>
            <button
              type="button"
              disabled={page >= catalogue.data.total_pages}
              onClick={() => goToPage(page + 1)}
              className={button}
            >
              Next <ChevronRight className="size-4" />
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}
