"use client";

import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { Artwork } from "@/components/pages/movieDetailsUI";
import { focus } from "./TvUI";

export default function TvSeriesPoster({ show }) {
  return (
    <Link
      href={`/series/${show.id}`}
      className={`group min-w-0 rounded-xl ${focus}`}
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10">
        <Artwork
          path={show.poster_path}
          alt={`${show.name} poster`}
          className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/75 px-2 py-1 text-xs font-medium text-white">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          {show.vote_average > 0 ? show.vote_average.toFixed(1) : "NR"}
        </span>
        <span className="absolute bottom-3 left-3 rounded border border-white/20 bg-black/40 px-2 py-1 text-[9px] font-semibold uppercase tracking-widest text-white/85">
          Series
        </span>
        <ArrowUpRight className="absolute bottom-3 right-3 size-5 text-white/70 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
      </div>
      <h3 className="mt-3 truncate text-sm font-semibold text-white transition-colors group-hover:text-red-400">
        {show.name}
      </h3>
      <p className="mt-1 text-xs text-white/45">
        {show.first_air_date?.slice(0, 4) || "Date TBA"}
      </p>
    </Link>
  );
}
