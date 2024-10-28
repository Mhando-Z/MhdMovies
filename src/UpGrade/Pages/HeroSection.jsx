import React, { useContext, useState, useEffect, useRef } from "react";
import MovieListContext from "../../Context/MovieListContext";
import { Rating } from "../Components/Collection";
import Slider from "../Components/Swipper/Swipe";
import { motion, AnimatePresence } from "framer-motion";
import { BiSolidMoviePlay } from "react-icons/bi";
import { BsCalendarEvent } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const { Trending } = useContext(MovieListContext);
  const [value, setValue] = useState(Math.floor(Math.random() * 20) + 1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef(null);

  // Preload image and set up image url
  useEffect(() => {
    if (!Trending[value]?.backdrop_path) return;

    setIsLoaded(false);
    setImageError(false);

    const newImageUrl = `https://image.tmdb.org/t/p/w1280/${Trending[value].backdrop_path}`;

    // Create new image object to preload
    const img = new Image();
    img.src = newImageUrl;

    img.onload = () => {
      setImageUrl(newImageUrl);
      setIsLoaded(true);
    };

    img.onerror = () => {
      setImageError(true);
      setIsLoaded(true);
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
          <motion.div
            key={imageUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black"
          >
            {!imageError && imageUrl && (
              <img
                ref={imageRef}
                src={imageUrl}
                alt={currentMovie?.title}
                className="object-cover w-full h-full"
                loading="eager"
              />
            )}
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content Container */}
        <div className="container absolute inset-0 px-4 mx-auto lg:px-8">
          <div className="flex flex-col h-full">
            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center max-w-2xl gap-4 md:gap-6 h-[70%] md:h-full">
              {/* Movie Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{
                  opacity: isLoaded ? 1 : 0,
                  y: isLoaded ? 0 : 30,
                  scale: isLoaded ? 1 : 0.95,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.42, 0, 0.58, 1],
                }}
                className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl lg:text-7xl"
              >
                {currentMovie?.title}
              </motion.h1>

              {/* Movie Meta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90"
              >
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
              </motion.div>

              {/* Movie Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-base md:text-lg text-white/80 line-clamp-3 md:line-clamp-5"
              >
                {currentMovie?.overview}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Link to={`/MovieDetails/${currentMovie?.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 text-base font-medium text-white transition-colors bg-red-600 rounded-lg md:px-6 md:py-3 md:text-lg hover:bg-red-700"
                  >
                    <BiSolidMoviePlay className="w-5 h-5" />
                    Watch Now
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Slider Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 1 }}
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
