"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiSolidMoviePlay } from "react-icons/bi";
import { BsCalendarEvent } from "react-icons/bs";
import { useMovies } from "@/context/movieContext";
import Rating from "../rating";
import Link from "next/link";
import Slider from "../Swipper/swiper";
import MovieTitle, { preloadMovieLogo } from "./movieTitle";
import {
  Creepster,
  Cinzel,
  Lobster_Two,
  Bricolage_Grotesque,
  Oswald,
} from "next/font/google";

const horrorFont = Creepster({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const sciFiFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});
const fantasyFont = Cinzel({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});
const romanceFont = Lobster_Two({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});
const actionFont = Oswald({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

/**
 * Title treatments, Netflix-style: each genre gets its own typeface plus
 * casing / tracking tuned to that face. First matching genre wins for movies
 * with multiple genres (order matters). `fallback` is used when nothing matches.
 */
const titleFonts = [
  { genreId: 27, font: horrorFont, className: "tracking-wide" },
  {
    genreId: 878,
    font: sciFiFont,
    className: "uppercase tracking-[0.12em]",
  },
  {
    genreId: 14,
    font: fantasyFont,
    className: "uppercase tracking-[0.08em]",
  },
  { genreId: 10749, font: romanceFont, className: "tracking-normal" },
  {
    genreId: 28,
    font: actionFont,
    className: "uppercase tracking-[0.04em]",
  },
  {
    genreId: 12,
    font: fantasyFont,
    className: "uppercase tracking-[0.08em]",
  },
  {
    genreId: 53,
    font: actionFont,
    className: "uppercase tracking-[0.04em]",
  },
];

const fallbackTitleStyle = {
  font: actionFont,
  className: "uppercase tracking-[0.04em]",
};

// TMDB movie genre ids -> display names.
const GENRE_NAMES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const MAX_GENRES = 4;

/**
 * Placeholder shown while the slider's data loads.
 * `progress` is 0-100. Pass undefined for an indeterminate bar
 * (e.g. while the movie list itself is still being fetched).
 */
const SliderSkeleton = ({ progress }) => {
  const determinate = typeof progress === "number";

  return (
    <div className="flex flex-col w-full gap-3">
      {/* Ghost cards that mimic the slider's shape */}
      <div className="flex gap-3 overflow-hidden">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="relative w-20 sm:w-28 shrink-0 aspect-[2/3] overflow-hidden rounded-xl bg-white/10"
            style={{ opacity: 1 - i * 0.2 }}
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
            <div className="absolute space-y-1.5 inset-x-2 bottom-2">
              <div className="w-3/4 h-2 rounded bg-white/20" />
              <div className="w-1/2 h-2 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 overflow-hidden rounded-full bg-white/10">
        {determinate ? (
          <motion.div
            className="h-full rounded-full bg-red-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        ) : (
          <motion.div
            className="w-1/3 h-full rounded-full bg-red-600"
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </div>
  );
};

const HeroSection = () => {
  const { Trending, isMobile } = useMovies();
  const [value, setValue] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const hasSelectedInitialMovie = useRef(false);
  const [movieLogos, setMovieLogos] = useState({});
  const [loadedCount, setLoadedCount] = useState(0);

  const logosReady =
    Trending.length > 0 &&
    Trending.every((movie) => Object.hasOwn(movieLogos, movie.id));

  // undefined = indeterminate (movie list not fetched yet)
  const loadProgress =
    Trending.length > 0
      ? Math.round((loadedCount / Trending.length) * 100)
      : undefined;

  useEffect(() => {
    let cancelled = false;
    setLoadedCount(0);

    // Load the whole lineup before starting the slider. A missing or failed
    // logo resolves to the text fallback without blocking the other movies.
    // Each movie bumps the counter as it finishes so the skeleton can show
    // real progress.
    Promise.all(
      Trending.map(async (movie) => {
        const logo = await preloadMovieLogo(movie.id).catch(() => null);
        if (!cancelled) setLoadedCount((n) => n + 1);
        return [movie.id, logo];
      }),
    ).then((entries) => {
      if (!cancelled) setMovieLogos(Object.fromEntries(entries));
    });

    return () => {
      cancelled = true;
    };
  }, [Trending]);

  // Pick a random starting movie once the list arrives.
  useEffect(() => {
    if (Trending.length === 0 || hasSelectedInitialMovie.current) return;

    hasSelectedInitialMovie.current = true;
    setValue(Math.floor(Math.random() * Trending.length));
  }, [Trending.length]);

  // Preload the image for the selected movie before swapping it in.
  useEffect(() => {
    const movie = Trending[value];
    // Choose the path first so the guard matches what we actually load
    // (mobile uses the poster, desktop uses the backdrop).
    const path = isMobile === true ? movie?.poster_path : movie?.backdrop_path;

    if (!path) {
      setImageUrl("");
      setImageError(true);
      return;
    }

    setImageError(false);

    // TMDB paths already start with "/", so no extra slash is added.
    const newImageUrl =
      isMobile !== true
        ? `https://image.tmdb.org/t/p/w1280${path}`
        : `https://image.tmdb.org/t/p/original${path}`;

    // Ignore results from a previous selection if the user moves on quickly.
    let cancelled = false;
    const img = new Image();

    img.onload = () => {
      if (!cancelled) setImageUrl(newImageUrl);
    };
    img.onerror = () => {
      if (!cancelled) setImageError(true);
    };
    img.src = newImageUrl;

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [value, Trending, isMobile]);

  const currentMovie = Trending[value];

  const titleStyle = useMemo(
    () =>
      titleFonts.find(({ genreId }) =>
        currentMovie?.genre_ids?.includes(genreId),
      ) ?? fallbackTitleStyle,
    [currentMovie],
  );

  const genres = useMemo(
    () =>
      (currentMovie?.genre_ids ?? [])
        .map((id) => GENRE_NAMES[id])
        .filter(Boolean)
        .slice(0, MAX_GENRES),
    [currentMovie],
  );

  const year = currentMovie?.release_date?.split("-")[0];
  const hasRating = typeof currentMovie?.vote_average === "number";

  return (
    <section
      className="relative w-full overflow-hidden font-roboto"
      aria-label="Featured trending movie"
    >
      {/* Hero Container */}
      <div className="relative h-[600px] sm:h-[700px] md:h-screen md:max-h-[970px] md:min-h-[450px]">
        {/* Background Image */}
        <div className="absolute inset-0 bg-black">
          <AnimatePresence>
            <motion.div
              key={imageUrl || "empty"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {!imageError && imageUrl && (
                <img
                  src={imageUrl}
                  alt={currentMovie?.title ?? ""}
                  className="object-cover w-full h-full"
                  loading="eager"
                  decoding="async"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Linear overlays for text legibility */}
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40" />
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 px-4 xl:container md:px-0 xl:mx-auto lg:px-8">
          <div className="flex flex-col h-full">
            {/* Main Content */}
            <div className="flex-1 invisible md:visible flex flex-col justify-center max-w-2xl gap-4 md:gap-5 h-[70%] md:h-full md:pl-8 lg:pl-0">
              <AnimatePresence mode="wait">
                {currentMovie && logosReady && (
                  <motion.div
                    key={currentMovie.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col gap-4 md:gap-5"
                  >
                    {/* Trending tag */}
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="w-1 h-5 bg-red-600 rounded-full"
                      />
                      <span className="text-sm font-medium tracking-wide text-white/80">
                        Trending now
                      </span>
                    </div>

                    {/* Movie Title */}
                    <MovieTitle
                      movie={currentMovie}
                      titleStyle={titleStyle}
                      logo={movieLogos[currentMovie.id]}
                    />

                    {/* Movie Meta */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/90">
                      {hasRating && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {currentMovie.vote_average.toFixed(1)}
                          </span>
                          <Rating value={currentMovie.vote_average} />
                        </div>
                      )}
                      {year && (
                        <div className="flex items-center gap-2">
                          <BsCalendarEvent className="w-4 h-4" />
                          <span>{year}</span>
                        </div>
                      )}
                    </div>

                    {/* Genres */}
                    {genres.length > 0 && (
                      <ul
                        aria-label="Genres"
                        className="flex flex-wrap items-center gap-2"
                      >
                        {genres.map((genre) => (
                          <li
                            key={genre}
                            className="px-3 py-1 text-xs font-medium border rounded-full text-white/90 border-white/20 bg-white/10 backdrop-blur-sm sm:text-sm"
                          >
                            {genre}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Movie Description */}
                    {currentMovie.overview && (
                      <p className="max-w-xl text-base leading-relaxed md:text-lg text-white/80 line-clamp-3 md:line-clamp-4 xl:line-clamp-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                        {currentMovie.overview}
                      </p>
                    )}

                    {/* CTA Button */}
                    <div className="pt-1">
                      <Link
                        href={`/movies/${currentMovie.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-base font-semibold text-white transition-all duration-200 bg-red-600 rounded-lg shadow-lg shadow-black/40 md:px-6 md:py-3 md:text-lg hover:bg-red-700 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        <BiSolidMoviePlay className="w-5 h-5" />
                        Watch Now
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Slider Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="h-[30%] md:absolute md:bottom-8 md:right-8 md:w-full md:max-w-md flex items-center justify-end"
            >
              <div className="w-full max-w-100 mx-auto md:mx-0">
                <AnimatePresence mode="wait">
                  {logosReady ? (
                    <motion.div
                      key="slider"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <Slider
                        data={Trending}
                        value={value}
                        setValue={setValue}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="skeleton"
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      role="status"
                      aria-busy="true"
                    >
                      <SliderSkeleton progress={loadProgress} />
                      <span className="sr-only">Loading featured movies</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
