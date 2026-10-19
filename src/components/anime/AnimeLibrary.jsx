"use client";

import { useEffect, useState } from "react";
import { Bookmark, Check } from "lucide-react";
import { validAnimeId, watchHref } from "@/lib/anime/model";
import { AnimeCard, button, grid, SectionHeading } from "./AnimeUI";

const key = "mhd:anime-library:v1";
export function readLibrary() {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data)
      ? data
          .filter(
            (item) => validAnimeId(item.id) && typeof item.title === "string",
          )
          .slice(0, 100)
      : [];
  } catch {
    return [];
  }
}

export function updateLibrary(anime, changes) {
  try {
    const library = readLibrary();
    const old = library.find((item) => item.id === anime.id);
    const record = {
      ...old,
      ...(changes.episode && changes.episode !== old?.episode
        ? { time: 0, duration: 0 }
        : {}),
      id: anime.id,
      title: anime.title,
      cover: anime.cover,
      country: anime.country,
      format: anime.format,
      year: anime.year,
      episodes: anime.episodes,
      score: anime.score,
      ...changes,
      updatedAt: Date.now(),
    };
    localStorage.setItem(
      key,
      JSON.stringify(
        [record, ...library.filter((item) => item.id !== anime.id)].slice(
          0,
          100,
        ),
      ),
    );
    window.dispatchEvent(new Event("mhd:anime-library"));
    return true;
  } catch {
    return false;
  }
}

export function useAnimeLibrary() {
  const [library, setLibrary] = useState([]);
  useEffect(() => {
    const update = () => setLibrary(readLibrary());
    update();
    window.addEventListener("storage", update);
    window.addEventListener("mhd:anime-library", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("mhd:anime-library", update);
    };
  }, []);
  return library;
}

export function WatchlistButton({ anime }) {
  const library = useAnimeLibrary();
  const saved = library.some((item) => item.id === anime.id && item.saved);
  const [error, setError] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-pressed={saved}
        className={button}
        onClick={() => setError(!updateLibrary(anime, { saved: !saved }))}
      >
        {saved ? <Check className="size-4" /> : <Bookmark className="size-4" />}
        {saved ? "In your watchlist" : "Add to watchlist"}
      </button>
      {error && (
        <p role="status" className="mt-2 text-xs text-amber-300">
          Browser storage is unavailable.
        </p>
      )}
    </div>
  );
}

export function LibraryRows() {
  const library = useAnimeLibrary();
  const continuing = library
    .filter((item) => item.episode && !item.completed)
    .slice(0, 6);
  const saved = library.filter((item) => item.saved).slice(0, 12);
  return (
    <>
      {continuing.length > 0 && (
        <section className="mb-14">
          <SectionHeading
            eyebrow="Pick up where you left off"
            title="Continue watching"
          />
          <div className={grid}>
            {continuing.map((anime) => (
              <div key={anime.id}>
                <AnimeCard
                  anime={anime}
                  subtitle={`Episode ${anime.episode}${anime.time ? ` · ${Math.floor(anime.time / 60)} min watched` : ""}`}
                  href={watchHref(
                    anime.id,
                    anime.episode,
                    anime.audio || "sub",
                  )}
                />
                {anime.duration > 0 && (
                  <progress
                    aria-label={`${anime.title} watch progress`}
                    value={anime.time || 0}
                    max={anime.duration}
                    className="mt-2 h-1 w-full overflow-hidden rounded bg-white/10 [&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-value]:bg-red-500 [&::-moz-progress-bar]:bg-red-500"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {saved.length > 0 && (
        <section className="mb-14">
          <SectionHeading
            eyebrow="Saved on this device"
            title="Your watchlist"
          />
          <div className={grid}>
            {saved.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
