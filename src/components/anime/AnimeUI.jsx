"use client";

import Link from "next/link";
import { BookOpen, Star } from "lucide-react";
import { label } from "@/lib/anime/model";
export {
  button,
  focus,
  grid,
  ResourceError,
  CardSkeletons,
} from "@/components/tvSeries/TvUI";

export function AnimeArtwork({ src, alt = "", className = "", eager = false }) {
  return (
    <div className={`relative overflow-hidden bg-zinc-900 ${className}`}>
      <BookOpen
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-white/15"
      />
      {src && (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
          className="relative size-full object-cover"
        />
      )}
    </div>
  );
}

export function AnimeCard({ anime, subtitle, href }) {
  return (
    <Link
      href={href || `/anime/${anime.id}`}
      className="group min-w-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400"
    >
      <div className="relative overflow-hidden rounded-xl border border-white/10">
        <AnimeArtwork
          src={anime.cover}
          alt={`${anime.title} poster`}
          className="aspect-2/3 transition-transform duration-300 motion-safe:group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-black/95 to-transparent px-3 pb-3 pt-12 text-[10px] font-semibold">
          <span className="rounded bg-black/65 px-2 py-1">
            {anime.country === "CN" ? "DONGHUA" : label(anime.format)}
          </span>
          {anime.score && (
            <span className="flex items-center gap-1">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {anime.score.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      <h3 className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-white/90 group-hover:text-red-400">
        {anime.title}
      </h3>
      <p className="mt-1 text-xs leading-5 text-white/50">
        {subtitle ||
          `${anime.year || "TBA"} · ${label(anime.format)} · ${anime.episodes ? `${anime.episodes} eps` : "Episodes TBA"}`}
      </p>
    </Link>
  );
}

export function SectionHeading({ eyebrow, title, href }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 rounded py-3 text-xs text-white/60 hover:text-white focus-visible:outline-2 focus-visible:outline-red-400"
        >
          View all <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

export function AnimeLoading() {
  return (
    <main className="min-h-screen bg-black px-5 pb-20 pt-32 text-white md:px-10">
      <div
        className="mx-auto max-w-7xl motion-safe:animate-pulse"
        role="status"
      >
        <span className="sr-only">Loading anime...</span>
        <div className="mb-10 h-64 rounded-2xl bg-white/5" />
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="aspect-2/3 rounded-xl bg-white/10" />
          ))}
        </div>
      </div>
    </main>
  );
}
