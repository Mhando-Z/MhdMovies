"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiSolidMoviePlay } from "react-icons/bi";
import { BsCalendarEvent } from "react-icons/bs";
import { Clapperboard, Tv, Star } from "lucide-react";
import Link from "next/link";

import AnimeSlider from "../Swipper/AniSwiper";
import Rating from "../rating";

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

const titleFonts = [
  {
    genres: ["Horror"],
    font: horrorFont,
    className: "tracking-wide",
  },
  {
    genres: ["Sci-Fi", "Science Fiction"],
    font: sciFiFont,
    className: "uppercase tracking-[0.12em]",
  },
  {
    genres: ["Fantasy"],
    font: fantasyFont,
    className: "uppercase tracking-[0.08em]",
  },
  {
    genres: ["Romance"],
    font: romanceFont,
    className: "tracking-normal",
  },
  {
    genres: ["Action", "Thriller"],
    font: actionFont,
    className: "uppercase tracking-[0.04em]",
  },
];

const fallbackTitleStyle = {
  font: actionFont,
  className: "uppercase tracking-[0.04em]",
};

const MAX_GENRES = 4;
const EMPTY_ANIME = [];

const AnimeHeroSection = ({ Trending = EMPTY_ANIME }) => {
  const { isMobile } = useMovies();

  const [value, setValue] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  const hasSelectedInitialAnime = useRef(false);

  // Keep the selected index valid if the API data changes.
  useEffect(() => {
    if (Trending.length === 0) {
      setValue(0);
      setImageUrl("");
      setImageError(false);
      hasSelectedInitialAnime.current = false;
      return;
    }

    setValue((previous) => Math.min(previous, Trending.length - 1));
  }, [Trending]);

  // Select a random starting anime when the list first arrives.
  useEffect(() => {
    if (Trending.length === 0 || hasSelectedInitialAnime.current) {
      return;
    }

    hasSelectedInitialAnime.current = true;

    setValue(Math.floor(Math.random() * Trending.length));
  }, [Trending.length]);

  const currentSeries = Trending[value];

  // Select the appropriate image from the new API response.
  const backgroundImage = useMemo(() => {
    if (!currentSeries) return "";

    return isMobile === true
      ? currentSeries.cover
      : currentSeries.banner || currentSeries.cover;
  }, [currentSeries, isMobile]);

  // Preload the selected image before displaying it.
  useEffect(() => {
    if (!backgroundImage) {
      setImageUrl("");
      setImageError(true);
      return;
    }

    let cancelled = false;

    setImageError(false);

    const img = new Image();

    img.onload = () => {
      if (!cancelled) {
        setImageUrl(backgroundImage);
        setImageError(false);
      }
    };

    img.onerror = () => {
      if (cancelled) return;

      // Fall back to the cover if the banner fails.
      if (backgroundImage !== currentSeries?.cover && currentSeries?.cover) {
        const fallbackImage = new Image();

        fallbackImage.onload = () => {
          if (!cancelled) {
            setImageUrl(currentSeries.cover);
            setImageError(false);
          }
        };

        fallbackImage.onerror = () => {
          if (!cancelled) {
            setImageUrl("");
            setImageError(true);
          }
        };

        fallbackImage.src = currentSeries.cover;
        return;
      }

      setImageUrl("");
      setImageError(true);
    };

    img.src = backgroundImage;

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [backgroundImage, currentSeries]);

  // Match title typography using genre names rather than TMDB genre IDs.
  const titleStyle = useMemo(() => {
    const genres = currentSeries?.genres ?? [];

    return (
      titleFonts.find(({ genres: matchingGenres }) =>
        genres.some((genre) =>
          matchingGenres.some(
            (matchingGenre) =>
              genre.toLowerCase() === matchingGenre.toLowerCase(),
          ),
        ),
      ) ?? fallbackTitleStyle
    );
  }, [currentSeries]);

  const genres = useMemo(
    () => (currentSeries?.genres ?? []).slice(0, MAX_GENRES),
    [currentSeries],
  );

  const year = currentSeries?.year;

  // The API score can be null. Normalize scores above 10 if needed.
  const score =
    typeof currentSeries?.score === "number" &&
    Number.isFinite(currentSeries.score)
      ? currentSeries.score > 10
        ? currentSeries.score / 10
        : currentSeries.score
      : null;

  const hasRating = score !== null;

  if (Trending.length === 0) {
    return null;
  }

  return (
    <section
      className="relative w-full overflow-hidden font-roboto"
      aria-label="Featured trending anime"
    >
      <div className="relative h-[600px] sm:h-[700px] md:h-screen md:max-h-[970px] md:min-h-[450px]">
        {/* Background image */}
        <div className="absolute inset-0 bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={imageUrl || currentSeries?.id || "empty"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {!imageError && imageUrl && (
                <img
                  src={imageUrl}
                  alt={currentSeries?.title ?? "Featured anime"}
                  className="h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Image overlays */}
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40" />
        </div>

        {/* Hero content */}
        <div className="absolute inset-0 px-4 xl:container md:px-0 xl:mx-auto lg:px-8">
          <div className="flex h-full flex-col">
            <div className="invisible flex h-[70%] max-w-2xl flex-1 flex-col justify-center gap-4 md:visible md:h-full md:gap-5 md:pl-8 lg:pl-0">
              <AnimatePresence mode="wait">
                {currentSeries && (
                  <motion.div
                    key={currentSeries.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    className="flex flex-col gap-4 md:gap-5"
                  >
                    {/* Trending label */}
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-5 w-1 rounded-full bg-red-600"
                      />

                      <span className="text-sm font-medium tracking-wide text-white/80">
                        Trending Anime
                      </span>
                    </div>

                    {/* Anime title */}
                    <div className="space-y-2">
                      <h1
                        className={`${titleStyle.font.className} ${titleStyle.className} text-4xl font-extrabold leading-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl`}
                      >
                        {currentSeries.title}
                      </h1>

                      {currentSeries.nativeTitle &&
                        currentSeries.nativeTitle !== currentSeries.title && (
                          <p className="text-sm text-white/65 sm:text-base">
                            {currentSeries.nativeTitle}
                          </p>
                        )}
                    </div>

                    {/* Anime metadata */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90 sm:text-base">
                      {hasRating && (
                        <div className="flex items-center gap-2">
                          <Star
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            aria-hidden="true"
                          />

                          <span className="font-semibold">
                            {score.toFixed(1)}
                          </span>

                          <Rating value={score} />
                        </div>
                      )}

                      {year && (
                        <div className="flex items-center gap-2">
                          <BsCalendarEvent className="h-4 w-4" />
                          <span>{year}</span>
                        </div>
                      )}

                      {currentSeries.format && (
                        <div className="flex items-center gap-2">
                          <Clapperboard className="h-4 w-4" />
                          <span>{currentSeries.format}</span>
                        </div>
                      )}

                      {typeof currentSeries.episodes === "number" && (
                        <div className="flex items-center gap-2">
                          <Tv className="h-4 w-4" />
                          <span>{currentSeries.episodes} Episodes</span>
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
                            className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm sm:text-sm"
                          >
                            {genre}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Description */}
                    {currentSeries.description && (
                      <p className="line-clamp-3 max-w-xl text-base leading-relaxed text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] md:line-clamp-4 md:text-lg xl:line-clamp-5">
                        {currentSeries.description}
                      </p>
                    )}

                    {/* Watch button */}
                    <div className="pt-1">
                      <Link
                        href={`/anime/${currentSeries.id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-base font-semibold text-white shadow-lg shadow-black/40 transition-all duration-200 hover:scale-105 hover:bg-red-700 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:px-6 md:py-3 md:text-lg"
                      >
                        <BiSolidMoviePlay className="h-5 w-5" />
                        Watch Now
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Keep the existing AnimeSlider */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex h-[30%] items-center justify-end md:absolute md:bottom-8 md:right-8 md:w-full md:max-w-md"
            >
              <div className="mx-auto w-full max-w-100 md:mx-0">
                <AnimeSlider
                  data={Trending}
                  value={value}
                  setValue={setValue}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimeHeroSection;
