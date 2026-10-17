"use client";

import { useState } from "react";
import Link from "next/link";
import { Film, Play, Star } from "lucide-react";

function PosterImage({ path, title, className }) {
  const [failed, setFailed] = useState(false);

  if (!path || failed) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900 text-white/40 ${className}`}>
        <Film aria-hidden="true" className="size-10" />
        <span className="sr-only">Image unavailable for {title}</span>
      </div>
    );
  }

  return (
    <img
      src={`https://image.tmdb.org/t/p/w500${path.startsWith("/") ? path : `/${path}`}`}
      alt={title}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export default function MoviePoster({ title = "Untitled movie", rating, image, image2, id, preview = false }) {
  const hasRating = typeof rating === "number" && Number.isFinite(rating) && rating > 0;

  return (
    <Link
      href={`/movies/${id}`}
      aria-label={`View details for ${title}`}
      className="group block min-w-0 rounded-lg text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-900">
        <PosterImage
          key={image}
          path={image}
          title={title}
          className={`h-full w-full object-cover transition duration-500 motion-reduce:transition-none motion-safe:group-hover:scale-105 group-hover:opacity-30 group-focus-visible:opacity-30 ${preview ? "opacity-30" : ""}`}
        />
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 backdrop-blur-sm">
          <Star aria-hidden="true" className="size-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold" aria-label={hasRating ? `Rated ${rating.toFixed(1)} out of 10` : "Not rated"}>
            {hasRating ? rating.toFixed(1) : "NR"}
          </span>
        </div>
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-t from-black/80 via-black/20 to-transparent p-3 text-center transition-opacity duration-300 motion-reduce:transition-none group-hover:opacity-100 group-focus-visible:opacity-100 ${preview ? "opacity-100" : "opacity-0"}`}>
          {image2 && (
            <PosterImage key={image2} path={image2} title="" className="hidden size-20 rounded-full object-cover ring-2 ring-white/70 sm:block" />
          )}
          <span className="line-clamp-2 text-sm font-semibold">{title}</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold">
            <Play aria-hidden="true" className="size-4" />
            View Details
          </span>
        </div>
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-medium text-white/90 group-hover:text-white">{title}</h3>
    </Link>
  );
}
