import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidMoviePlay } from "react-icons/bi";

const MoviePoster = ({ name, rating, image, image2, id, preview = false }) => {
  const [isHovered, setIsHovered] = useState(preview);
  const navigate = useNavigate();

  // handle navigation logic
  const handleNavigation = () => {
    navigate(`/TvSeriesDetails/${id}`);
  };

  return (
    <motion.div
      className="max-w-sm mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(preview)}
    >
      <motion.div
        className="relative overflow-hidden bg-gray-900 rounded group"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <div className="aspect-[2/3] overflow-hidden bg-gray-800">
          <img
            src={`https://image.tmdb.org/t/p/w500/${image}`}
            alt={name}
            className={`w-full h-full object-cover transition-all duration-500 
              ${isHovered ? "scale-110 opacity-30" : "scale-100 opacity-100"}`}
          />
        </div>

        <div className="absolute px-2 py-1 rounded-md top-2 right-2 bg-black/60 backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-white">
              {Number(rating).toFixed(1)}
            </span>
          </div>
        </div>

        {/* Overlay Content */}
        <motion.div
          className={`absolute inset-0 transition-all duration-300 flex flex-col items-center justify-center p-4 
          ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0, y: 30 }}
            animate={
              isHovered
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0, y: 30 }
            }
            transition={{
              duration: 0.6,
              delay: 0.1,
              type: "spring",
              damping: 15,
            }}
            src={`https://image.tmdb.org/t/p/w500/${image2}`}
            alt={name}
            className="object-cover w-20 h-20 mt-5 rounded-full ring-2 ring-white md:w-28 md:h-28"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.15 }}
            className="px-1 mt-4 text-sm font-bold text-center text-white font-Raleway xl:text-lg md:text-lg line-clamp-2 md:line-clamp-2"
          >
            {name}
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.08 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            onClick={handleNavigation}
            className="flex px-3 py-1 mt-3 font-medium text-center text-black bg-gray-100 md:px-5 md:py-2 hover:ring-green-700 rounded-3xl hover:bg-slate-50 hover:ring-1"
          >
            <Link
              className="flex flex-row items-center w-full gap-1 text-xs"
              to={`/TvSeriesDetails/${id}`}
            >
              <BiSolidMoviePlay />
              Watch
            </Link>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Mobile Title */}
      <div className="p-2 text-white md:hidden">
        <h3 className="text-xs font-medium line-clamp-1">{name}</h3>
      </div>
    </motion.div>
  );
};

export default MoviePoster;
