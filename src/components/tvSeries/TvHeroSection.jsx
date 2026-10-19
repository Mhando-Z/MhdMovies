"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiSolidMoviePlay } from "react-icons/bi";
import { BsCalendarEvent } from "react-icons/bs";
import Link from "next/link";

import Slider from "../Swipper/swiper";
import Rating from "../rating";
import MovieTitle, { preloadSeriesLogo } from "../pages/movieTitle";

import {
  Creepster,
  Cinzel,
  Lobster_Two,
  Bricolage_Grotesque,
  Oswald,
} from "next/font/google";
import { useMovies } from "@/context/movieContext";

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
    genreId: 10765, // Sci-Fi & Fantasy
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
    genreId: 10759, // Action & Adventure
    font: actionFont,
    className: "uppercase tracking-[0.04em]",
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

const GENRE_NAMES = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
  10749: "Romance",
  27: "Horror",
  53: "Thriller",
};

const MAX_GENRES = 4;
const EMPTY_TRENDING = [];

const TvHeroSection = ({ Trending = EMPTY_TRENDING }) => {
  const { isMobile } = useMovies();
  const [value, setValue] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const hasSelectedInitialMovie = useRef(false);
  const [seriesLogos, setSeriesLogos] = useState({});
  const logosReady =
    Trending.length > 0 &&
    Trending.every((movie) => Object.hasOwn(seriesLogos, movie.id));

  useEffect(() => {
    let cancelled = false;
    // Load the whole lineup before starting the slider. A missing or failed
    // logo resolves to the text fallback without blocking the other movies.
    Promise.all(
      Trending.map(async (series) => [
        series.id,
        await preloadSeriesLogo(series.id).catch(() => null),
      ]),
    ).then((entries) => {
      if (!cancelled) setSeriesLogos(Object.fromEntries(entries));
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

  const currentSeries = Trending[value];

  const titleStyle = useMemo(
    () =>
      titleFonts.find(({ genreId }) =>
        currentSeries?.genre_ids?.includes(genreId),
      ) ?? fallbackTitleStyle,
    [currentSeries],
  );

  const genres = useMemo(
    () =>
      (currentSeries?.genre_ids ?? [])
        .map((id) => GENRE_NAMES[id])
        .filter(Boolean)
        .slice(0, MAX_GENRES),
    [currentSeries],
  );

  const year = currentSeries?.first_air_date?.split("-")[0];
  const hasRating = typeof currentSeries?.vote_average === "number";

  return (
    <section
      className="relative w-full overflow-hidden font-roboto"
      aria-label="Featured trending TV series"
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
                  alt={currentSeries?.name ?? ""}
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
                {currentSeries && logosReady && (
                  <motion.div
                    key={currentSeries.id}
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
                      movie={currentSeries}
                      titleStyle={titleStyle}
                      logo={seriesLogos[currentSeries.id]}
                    />

                    {/* Movie Meta */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/90">
                      {hasRating && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {currentSeries.vote_average.toFixed(1)}
                          </span>
                          <Rating value={currentSeries.vote_average} />
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
                    {currentSeries.overview && (
                      <p className="max-w-xl text-base leading-relaxed md:text-lg text-white/80 line-clamp-3 md:line-clamp-4 xl:line-clamp-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                        {currentSeries.overview}
                      </p>
                    )}

                    {/* CTA Button */}
                    <div className="pt-1">
                      <Link
                        href={`/series/${currentSeries.id}`}
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
                {logosReady ? (
                  <Slider data={Trending} value={value} setValue={setValue} />
                ) : (
                  <p role="status" className="text-sm text-white/70">
                    Preparing featured Series..
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TvHeroSection;
