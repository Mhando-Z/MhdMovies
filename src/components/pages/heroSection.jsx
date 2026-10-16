"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiSolidMoviePlay } from "react-icons/bi";
import { BsCalendarEvent } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";
import { useMovies } from "@/context/movieContext";
import Rating from "../rating";
import Link from "next/link";
import Slider from "../Swipper/swiper";

const HeroSection = () => {
  const { Trending, getTrending, isMobile } = useMovies();
  const [value, setValue] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef(null);
  const hasSelectedInitialMovie = useRef(false);

  useEffect(() => {
    if (Trending.length === 0 || hasSelectedInitialMovie.current) return;

    hasSelectedInitialMovie.current = true;
    setValue(Math.floor(Math.random() * Trending.length));
  }, [Trending.length]);

  useEffect(() => {
    getTrending();
  }, []);

  // Preload image and set up image url
  useEffect(() => {
    if (!Trending[value]?.backdrop_path) return;

    setImageError(false);

    const newImageUrl =
      isMobile !== true
        ? `https://image.tmdb.org/t/p/w1280/${Trending[value].backdrop_path}`
        : `https://image.tmdb.org/t/p/original/${Trending[value].poster_path}`;

    // Create new image object to preload
    const img = new Image();
    img.src = newImageUrl;

    img.onload = () => {
      setImageUrl(newImageUrl);
    };

    img.onerror = () => {
      setImageError(true);
    };

    // Clean up
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [value, Trending]);

  // Handle component unmounting
  useEffect(() => {
    return () => {
      if (imageRef.current) {
        imageRef.current.src = "";
      }
    };
  }, []);

  const currentMovie = Trending[value];

  return (
    <div className="relative w-full overflow-hidden font-roboto">
      {/* Hero Container */}
      <div className="relative h-[600px] sm:h-[700px] md:h-screen md:max-h-[970px] md:min-h-[450px]">
        {/* Background Image */}
        <AnimatePresence mode="wait">
          <div key={imageUrl} className="absolute inset-0 bg-black">
            {!imageError && imageUrl && (
              <img
                ref={imageRef}
                src={imageUrl}
                alt={currentMovie?.title}
                className="object-cover w-full h-full"
                loading="eager"
              />
            )}
            {/* linear Overlays */}
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
          </div>
        </AnimatePresence>

        {/* Content Container */}
        <div className="absolute inset-0 px-4 md:container md:px-0 md:mx-auto lg:px-8">
          <div className="flex flex-col h-full">
            {/* Main Content */}
            <div className="flex-1 invisible md:visible flex flex-col justify-center max-w-2xl gap-4 md:gap-6 h-[70%] md:h-full">
              {/* Movie Title */}
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl lg:text-7xl">
                {currentMovie?.title}
              </h1>

              {/* Movie Meta */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <AiFillStar className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">
                    {currentMovie?.vote_average?.toFixed(1)}
                  </span>
                  <Rating value={currentMovie?.vote_average} />
                </div>
                <div className="flex items-center gap-2">
                  <BsCalendarEvent className="w-4 h-4" />
                  <span>{currentMovie?.release_date?.split("-")[0]}</span>
                </div>
              </div>

              {/* Movie Description */}
              <p className="text-base md:text-lg text-white/80 line-clamp-3 md:line-clamp-5">
                {currentMovie?.overview}
              </p>

              {/* CTA Button */}
              <div>
                <Link href={`/MovieDetails/${currentMovie?.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 text-base font-medium text-white transition-colors bg-red-600 rounded-lg md:px-6 md:py-3 md:text-lg hover:bg-red-700"
                  >
                    <BiSolidMoviePlay className="w-5 h-5" />
                    Watch Now
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Slider Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="h-[30%] md:absolute md:bottom-8 md:right-8 md:w-full md:max-w-md flex items-center justify-end"
            >
              <div className="w-full max-w-[400px] mx-auto md:mx-0">
                <Slider data={Trending} value={value} setValue={setValue} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
