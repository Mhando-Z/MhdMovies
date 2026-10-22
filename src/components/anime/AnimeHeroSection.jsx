"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
} from "lucide-react";
import { label } from "@/lib/anime/model";
import { AnimeArtwork, button, focus } from "./AnimeUI";
import AnimeTitle from "./AnimeTitle";
import { WatchlistButton } from "./AnimeLibrary";
import { useAnimeResource } from "./useAnimeResource";

function FeaturedTitle({ anime }) {
  const { data: artwork } = useAnimeResource(`/api/anime/${anime.id}/logo`);
  const [failed, setFailed] = useState(null);
  const background = artwork?.backdrop || anime.banner || anime.cover;
  return (
    <>
      <div className="absolute inset-0 bg-zinc-950" aria-hidden="true">
        {background && failed !== background && (
          <img
            src={background}
            alt=""
            fetchPriority="high"
            decoding="async"
            onError={() => setFailed(background)}
            className={`size-full object-cover object-top ${!artwork?.backdrop && !anime.banner ? "opacity-45" : "opacity-80"}`}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/65 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-black/25" />
      </div>
      <div className="relative xl:mx-auto grid xl:container items-center gap-10 px-6 pb-10 pt-32 md:min-h-[620px] md:grid-cols-[1fr_240px] md:pb-14 md:pt-40 lg:grid-cols-[1fr_300px] lg:gap-24">
        <div className="min-w-0 max-w-2xl">
          <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-red-400">
            The season’s spotlight
          </p>
          <AnimeTitle
            anime={anime}
            artwork={artwork || null}
            className="min-h-20 text-balance md:min-h-28 md:text-6xl"
          />
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/75 md:text-sm">
            {anime.score && (
              <span className="flex items-center gap-1.5 font-semibold text-amber-300">
                <Star className="size-4 fill-current" />
                {anime.score.toFixed(1)}
                <span className="font-normal text-white/40">/ 10</span>
              </span>
            )}
            {anime.year && <span>{anime.year}</span>}
            {anime.format && <span>{label(anime.format)}</span>}
            {anime.status && (
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-[11px]">
                {label(anime.status)}
              </span>
            )}
          </div>
          <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-7 text-white/65">
            {anime.description ||
              "A new world, a different perspective. Discover the story and find your next favourite."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {anime.genres.slice(0, 3).map((genre) => (
              <span key={genre} className="text-xs text-white/45">
                {genre}
              </span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-start gap-3">
            <Link
              href={`/anime/${anime.id}`}
              prefetch={false}
              className={`${button} border-red-600 bg-red-600 hover:bg-red-700`}
            >
              Explore this anime
              <ArrowRight className="size-4" />
            </Link>
            <WatchlistButton anime={anime} />
          </div>
        </div>
        <Link
          href={`/anime/${anime.id}`}
          prefetch={false}
          aria-label={`${anime.title} details`}
          className={`hidden rotate-3 rounded-2xl shadow-2xl shadow-black/50 md:block ${focus}`}
        >
          <AnimeArtwork
            key={anime.cover}
            src={anime.cover}
            alt={`${anime.title} poster`}
            eager
            className="aspect-2/3 rounded-2xl border border-white/15"
          />
        </Link>
      </div>
    </>
  );
}

export default function AnimeHeroSection({ Trending = [], loading = false }) {
  const [selected, setSelected] = useState(0);
  const index = Math.min(selected, Math.max(0, Trending.length - 1));
  const anime = Trending[index];
  if (!anime)
    return loading ? (
      <section
        aria-label="Loading featured anime"
        role="status"
        className="min-h-[520px] bg-linear-to-br from-zinc-900 to-black px-6 pb-12 pt-40"
      >
        <div className="mx-auto max-w-7xl space-y-6 motion-safe:animate-pulse">
          <div className="h-3 w-36 rounded bg-white/10" />
          <div className="h-24 max-w-lg rounded bg-white/10" />
          <div className="h-12 max-w-xl rounded bg-white/5" />
          <span className="sr-only">Loading featured anime...</span>
        </div>
      </section>
    ) : null;
  return (
    <section
      aria-label="Featured anime"
      aria-roledescription="carousel"
      className="relative isolate overflow-hidden border-b border-white/10 bg-black"
    >
      <FeaturedTitle key={anime.id} anime={anime} />
      <div className="relative xl:mx-auto flex xl:container items-center gap-4 px-6 pb-8">
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="Previous featured anime"
            onClick={() =>
              setSelected((index + Trending.length - 1) % Trending.length)
            }
            className={`${button} size-11 p-0`}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next featured anime"
            onClick={() => setSelected((index + 1) % Trending.length)}
            className={`${button} size-11 p-0`}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div
          className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Choose featured anime"
        >
          {Trending.map((item, position) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={position === index}
              aria-label={`Feature ${item.title}`}
              onClick={() => setSelected(position)}
              className={`flex min-h-14 min-w-32 max-w-48 flex-1 shrink-0 items-center gap-3 rounded-lg border p-2 text-left transition-colors ${focus} ${position === index ? "border-red-500/70 bg-red-500/10" : "border-white/10 bg-black/30 hover:bg-white/10"}`}
            >
              <span
                className={`text-xs tabular-nums ${position === index ? "text-red-400" : "text-white/30"}`}
              >
                {String(position + 1).padStart(2, "0")}
              </span>
              <span className="line-clamp-2 text-[11px] leading-4 text-white/75">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
