"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Play, Star } from "lucide-react";
import { useAnimeResource as useResource } from "./useAnimeResource";
import AnimeTitle from "./AnimeTitle";
import { genres, label, releasedEpisodeCount, watchHref } from "@/lib/anime/model";
import {
  AnimeArtwork,
  AnimeCard,
  button,
  focus,
  grid,
  SectionHeading,
} from "./AnimeUI";
import AnimeEpisodes from "./AnimeEpisodes";
import { WatchlistButton } from "./AnimeLibrary";

function Airing({ next }) {
  const [local, setLocal] = useState(false);
  if (!next) return null;
  const date = new Date(next.airingAt * 1000);
  return (
    <aside className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-red-400">
        <CalendarDays className="size-4" />
        Next broadcast
      </p>
      <p className="font-semibold">Episode {next.episode}</p>
      <p className="mt-2 text-sm text-white/60">
        {new Intl.DateTimeFormat("en", {
          dateStyle: "medium",
          timeStyle: "short",
          ...(local ? {} : { timeZone: "UTC" }),
        }).format(date)}
      </p>
      <button
        type="button"
        onClick={() => setLocal((value) => !value)}
        className={`mt-1 min-h-11 text-xs text-white/45 underline underline-offset-4 ${focus}`}
      >
        {local ? "Your local time · Show UTC" : "UTC · Show local time"}
      </button>
    </aside>
  );
}

function ChineseDetails({ anime }) {
  const { data } = useResource(
    anime.country !== "JP" ? `/api/anime/${anime.id}/chinese` : null,
  );
  if (!data?.details) return null;
  return (
    <aside className="mt-6 rounded-xl border border-white/10 p-5">
      <p className="mb-2 text-xs text-red-400">Chinese title</p>
      <h3 lang="zh" className="text-lg">
        {data.details.title}
      </h3>
      <p
        lang="zh"
        className="mt-3 whitespace-pre-line text-sm leading-7 text-white/55"
      >
        {data.details.summary}
      </p>
      <a
        href={data.details.url}
        target="_blank"
        rel="noreferrer"
        className={`mt-3 inline-flex min-h-11 items-center text-xs text-white/45 underline ${focus}`}
      >
        Details from Bangumi
      </a>
    </aside>
  );
}

export default function AnimeDetails({ anime }) {
  const [trailer, setTrailer] = useState(false);
  const count = releasedEpisodeCount(anime);
  return (
    <main className="min-h-screen bg-black font-roboto text-white">
      {anime.stale && <p role="status" className="bg-amber-400/10 px-6 pb-3 pt-24 text-center text-sm text-amber-200">Showing saved details while the catalog reconnects.</p>}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <AnimeArtwork
            src={anime.banner || anime.cover}
            className="h-full w-full object-cover object-top"
            eager
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-black/20" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/15 to-black/30" />
        </div>
        <div className="xl:mx-auto xl:container px-6 pb-12 pt-28 md:pt-36">
          <div className="flex items-start gap-6 md:gap-10">
            <AnimeArtwork
              src={anime.cover}
              alt={`${anime.title} poster`}
              className="hidden aspect-2/3 w-44 shrink-0 rounded-xl border border-white/15 shadow-2xl sm:block lg:w-56"
              eager
            />
            <div className="max-w-3xl">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
                {anime.country === "CN"
                  ? "Chinese donghua"
                  : anime.country === "JP"
                    ? "Japanese anime"
                    : "Animation"}
              </p>
              <AnimeTitle key={anime.id} anime={anime} />
              {anime.nativeTitle && anime.nativeTitle !== anime.title && (
                <p className="mt-3 text-base text-white/40">
                  {anime.nativeTitle}
                </p>
              )}
              <div className="my-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
                {anime.score && (
                  <span className="flex items-center gap-1.5">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    {anime.score.toFixed(1)}
                    <span className="text-white/35">/ 10</span>
                  </span>
                )}
                <span>{anime.year || "Year TBA"}</span>
                <span>{label(anime.format)}</span>
                <span>{label(anime.status)}</span>
                {anime.duration && <span>{anime.duration} min / ep</span>}
              </div>
              <div className="mb-6 flex flex-wrap gap-2">
                {anime.genres.map((genre) => genres.includes(genre) ? (
                  <Link
                    key={genre}
                    href={`/anime?genre=${encodeURIComponent(genre)}`}
                    className={`rounded-full border border-white/15 px-3 py-2 text-xs text-white/65 hover:bg-white/10 ${focus}`}
                  >
                    {genre}
                  </Link>
                ) : <span key={genre} className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/65">{genre}</span>)}
              </div>
              <p className="line-clamp-3 text-sm leading-7 text-white/65">
                {anime.description || "A synopsis has not been added yet."}
              </p>
              <div className="mt-7 flex flex-wrap items-start gap-3">
                {count !== 0 && (
                  <Link
                    href={count === null ? "#episodes" : watchHref(anime.id)}
                    className={`${button} border-red-600 bg-red-600 hover:bg-red-700`}
                  >
                    <Play className="size-4 fill-current" />
                    {count === null ? "Browse episodes" : "Watch episode 1"}
                  </Link>
                )}
                <WatchlistButton anime={anime} />
                {anime.trailer && (
                  <button
                    type="button"
                    className={button}
                    onClick={() => setTrailer((value) => !value)}
                  >
                    {trailer ? "Close trailer" : "Watch trailer"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="xl:mx-auto xl:container px-6 py-10 md:py-14">
        {trailer && anime.trailer && (
          <section className="mb-12">
            <SectionHeading title="Official trailer" />
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${anime.trailer}`}
              title={`${anime.title} trailer`}
              allow="fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              className="aspect-video w-full rounded-xl border border-white/10"
            />
          </section>
        )}
        <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_300px]">
          <section>
            <SectionHeading title="The story" />
            <p className="whitespace-pre-line text-sm leading-8 text-white/65">
              {anime.description || "A synopsis has not been added yet."}
            </p>
            {anime.aliases.length > 0 && (
              <p className="mt-5 text-xs leading-6 text-white/40">
                <span className="text-white/60">Also known as: </span>
                {anime.aliases.join(" · ")}
              </p>
            )}
          </section>
          <div>
            <Airing next={anime.nextAiring} />
            <dl className="mt-5 space-y-4 rounded-xl border border-white/10 p-5 text-sm">
              {[
                ["Format", label(anime.format)],
                ["Episodes", anime.episodes || "TBA"],
                ["Studio", anime.studios.join(", ") || "TBA"],
                ...(anime.rank ? [["MAL ranking", `#${anime.rank}`]] : []),
                ...(anime.broadcast?.day_of_the_week ? [["Regular broadcast", `${label(anime.broadcast.day_of_the_week)}${anime.broadcast.start_time ? ` at ${anime.broadcast.start_time} JST` : ""}`]] : []),
              ].map(([key, value]) => (
                <div key={key}>
                  <dt className="mb-1 text-xs text-white/40">{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <ChineseDetails anime={anime} />
          </div>
        </div>
        {/* Anime Episodes listing Section */}
        <AnimeEpisodes anime={anime} />
        {anime.related.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              eyebrow="Keep exploring"
              title="Seasons, sequels & specials"
            />
            <p className="mb-6 text-sm text-white/45">
              Each entry has its own episode numbering.
            </p>
            <div className={grid}>
              {anime.related.map((item) => (
                <AnimeCard
                  key={`${item.id}-${item.relation}`}
                  anime={item}
                  subtitle={`${item.relation} · ${item.year || "TBA"}`}
                />
              ))}
            </div>
          </section>
        )}
        {anime.recommendations?.length > 0 && (
          <section className="mt-16">
            <SectionHeading eyebrow="Find your next story" title="Fans also recommend" />
            <div className={grid}>{anime.recommendations.map((item) => <AnimeCard key={item.id} anime={item} />)}</div>
          </section>
        )}
        {anime.malId && <a href={`https://myanimelist.net/anime/${anime.malId}`} target="_blank" rel="noreferrer" className="mt-10 block text-xs text-white/45 underline underline-offset-4">Anime information from MyAnimeList</a>}
        <Link href="/anime" className={`${button} mt-12`}>
          Explore more anime
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </main>
  );
}
