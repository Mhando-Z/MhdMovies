"use client";

import { useSyncExternalStore } from "react";
import { validAnimeKey } from "@/lib/anime/model";

const key = "mhd:anime-library:v1";
const empty = [];
let previousRaw;
let previous = empty;
const listeners = new Set();
export const sameAnime = (a, b) => String(a.id) === String(b.id) || Boolean(a.malId && b.malId && a.malId === b.malId);

export function readLibrary() {
  try {
    const raw = localStorage.getItem(key) || "[]";
    if (raw === previousRaw) return previous;
    const data = JSON.parse(raw);
    previousRaw = raw;
    previous = Array.isArray(data) ? data.filter((item) => item && validAnimeKey(item.id) && typeof item.title === "string").slice(0, 100) : empty;
    return previous;
  } catch { return empty; }
}

export function updateLibrary(anime, changes) {
  try {
    const library = readLibrary();
    const old = library.find((item) => sameAnime(item, anime));
    const record = {
      ...old,
      ...(changes.episode && changes.episode !== old?.episode ? { time: 0, duration: 0 } : {}),
      id: anime.id, malId: anime.malId, anilistId: anime.anilistId,
      title: anime.title, cover: anime.cover, country: anime.country,
      format: anime.format, year: anime.year, episodes: anime.episodes, score: anime.score,
      ...changes, updatedAt: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify([record, ...library.filter((item) => !sameAnime(item, anime))].slice(0, 100)));
    window.dispatchEvent(new Event("mhd:anime-library"));
    return true;
  } catch { return false; }
}

function notify() { for (const listener of listeners) listener(); }
function subscribe(listener) {
  if (!listeners.size) {
    window.addEventListener("storage", notify);
    window.addEventListener("mhd:anime-library", notify);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      window.removeEventListener("storage", notify);
      window.removeEventListener("mhd:anime-library", notify);
    }
  };
}
export function useAnimeLibrary() {
  return useSyncExternalStore(subscribe, readLibrary, () => empty);
}
