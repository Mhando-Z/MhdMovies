"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const MovieDetailsContext = createContext(null);
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const emptyMovie = {
  details: null, review: [], similar: [], image: [],
  logos: [], video: [], cast: [], crew: [],
};

async function fetchTmdb(endpoint, params, signal) {
  const token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
  if (!token) throw new Error("The TMDB access token is not configured.");

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.search = new URLSearchParams(params).toString();
  const response = await fetch(url, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]),
    headers: { accept: "application/json", Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const error = new Error(
      response.status === 404
        ? "Movie not found."
        : "Unable to load movie information. Please try again.",
    );
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export function MovieDetailsProvider({ id, children }) {
  const [movie, setMovie] = useState(emptyMovie);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partialError, setPartialError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [castId, setCastId] = useState(null);
  const [castDetails, setCastDetails] = useState(null);
  const [castLoading, setCastLoading] = useState(false);
  const [castError, setCastError] = useState(null);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  const handleCast = useCallback((personId) => {
    setCastDetails(null);
    setCastError(null);
    setCastLoading(Boolean(personId));
    setCastId(personId);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setMovie(emptyMovie);
    setLoading(true);
    setError(null);
    setPartialError(null);
    handleCast(null);

    if (!/^[1-9]\d*$/.test(String(id))) {
      setError("Movie not found.");
      setLoading(false);
      return () => controller.abort();
    }

    async function loadMovie() {
      // Optional sections fail independently; a missing gallery or review
      // never prevents an otherwise valid movie from opening.
      const results = await Promise.allSettled([
        fetchTmdb(`/movie/${id}`, {
          language: "en-US", append_to_response: "release_dates",
        }, signal),
        fetchTmdb(`/movie/${id}/reviews`, { language: "en-US" }, signal),
        fetchTmdb(`/movie/${id}/similar`, { language: "en-US", page: "1" }, signal),
        fetchTmdb(`/movie/${id}/images`, { include_image_language: "en,null" }, signal),
        fetchTmdb(`/movie/${id}/videos`, { language: "en-US" }, signal),
        fetchTmdb(`/movie/${id}/credits`, { language: "en-US" }, signal),
      ]);

      if (signal.aborted) return;
      const [details, reviews, similar, images, videos, credits] = results;
      if (details.status === "rejected") {
        setError(details.reason.message);
      } else {
        const data = (result) => result.status === "fulfilled" ? result.value : {};
        setMovie({
          details: details.value,
          review: data(reviews).results ?? [],
          similar: data(similar).results ?? [],
          image: data(images).backdrops ?? [],
          logos: data(images).logos ?? [],
          video: data(videos).results ?? [],
          cast: data(credits).cast ?? [],
          crew: data(credits).crew ?? [],
        });
        if (results.slice(1).some((result) => result.status === "rejected")) {
          setPartialError("Some extra movie information could not be loaded.");
        }
      }
      setLoading(false);
    }

    loadMovie();
    return () => controller.abort();
  }, [id, attempt, handleCast]);

  useEffect(() => {
    if (!castId) return;
    const controller = new AbortController();

    async function loadCast() {
      try {
        const person = await fetchTmdb(`/person/${castId}`, {
          language: "en-US",
          append_to_response: "movie_credits,tv_credits,images",
        }, controller.signal);
        if (!controller.signal.aborted) setCastDetails(person);
      } catch {
        if (!controller.signal.aborted) {
          setCastError("This profile could not be loaded. Please try opening it again.");
        }
      } finally {
        if (!controller.signal.aborted) setCastLoading(false);
      }
    }

    loadCast();
    return () => controller.abort();
  }, [castId]);

  return (
    <MovieDetailsContext.Provider value={{
      Details: movie.details,
      Review: movie.review,
      Similar: movie.similar,
      Image: movie.image,
      Logos: movie.logos,
      Video: movie.video,
      Cast: movie.cast,
      Crew: movie.crew,
      Similars: movie.similar.filter((item) => item.poster_path),
      Casts: movie.cast.filter((person) => person.profile_path),
      Loading: loading,
      Error: error,
      PartialError: partialError,
      CastId: castId,
      CastDetails: castDetails,
      CastMovies: castDetails?.movie_credits ?? null,
      CastTvSeries: castDetails?.tv_credits ?? null,
      CastImage: castDetails?.images ?? null,
      CastLoading: castLoading,
      CastError: castError,
      handleCast,
      retry,
    }}>
      {children}
    </MovieDetailsContext.Provider>
  );
}

export function useMovieDetails() {
  const context = useContext(MovieDetailsContext);
  if (!context) {
    throw new Error("useMovieDetails must be used inside MovieDetailsProvider");
  }
  return context;
}
