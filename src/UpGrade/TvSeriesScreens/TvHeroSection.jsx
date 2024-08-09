import React, { useContext, useState } from "react";
import { Rating } from "../Components/Collection";
import Slider from "../Components/Swipper/Swipe";
import { motion } from "framer-motion";
import { BiSolidMoviePlay } from "react-icons/bi";
import TvSeriesContex from "../../Context/TvSeriesContext";
import { Link } from "react-router-dom";

function TvHeroSection() {
  const { Todaylist } = useContext(TvSeriesContex);
  const [value, setValue] = useState(Math.floor(Math.random() * 20) + 1);

  return (
    <div>
      <div className="flex relative overflow-hidden w-screen flex-col font-roboto xl:h-[970px] lg:h-[800px] md:h-[880px] h-[450px] ">
        <img
          src={`https://image.tmdb.org/t/p/w500/${Todaylist[value]?.backdrop_path}`}
          alt={Todaylist[value]?.name}
          className="object-cover w-screen h-full"
        />
        <div className="absolute top-0 bottom-0 left-0 right-0 via-transparent bg-gradient-to-r from-black to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-0 right-0 via-transparent bg-gradient-to-t from-black to-transparent"></div>
        <div className="container absolute flex-col hidden w-full mx-auto md:flex md:left-2 xl:left-60 top-96">
          {/* Movie name */}
          <h1 className="flex flex-col max-w-xl text-5xl font-bold text-gray-100 font-roboto xl:text-7xl">
            {Todaylist[value]?.name}
          </h1>
          {/* Rating */}
          <div className="flex flex-row items-center mt-2 mb-2 gap-x-3">
            <div>
              <h3 className="text-base text-gray-100 xl:text-lg">
                {Todaylist[value]?.vote_average}
              </h3>
            </div>
            <Rating value={Todaylist[value]?.vote_average} />
          </div>
          <div className="grid grid-cols-4 gap-5"></div>
          {/* movie description */}
          <p className="max-w-sm text-base tracking-tighter text-gray-100 md:max-w-lg sm:max-w-md line-clamp-5 font-roboto xl:text-lg">
            {Todaylist[value]?.overview}
          </p>
          <div>
            {/* button for more information about movie */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", ease: "easeOut" }}
              className="flex flex-row items-center px-3 py-2 mt-3 font-medium text-center text-gray-100 bg-red-600 gap-x-2 hover:ring-green-700 hover:ring-1 "
            >
              <Link
                className="flex flex-row items-center w-full "
                to={`/TvSeriesDetails/${Todaylist[value]?.id}`}
              >
                <BiSolidMoviePlay />
                Watch
              </Link>
            </motion.button>
          </div>
        </div>
        <div className="absolute md:flex hidden md:bottom-0 xl:w-[500px] md:w-[400px] xl:right-56 md:right-5">
          <Slider data={Todaylist} value={value} setValue={setValue} />
        </div>
      </div>
      {/* mobile view */}
      <div className="container flex flex-col w-full px-1 mx-auto md:hidden ">
        {/* TvSeries name */}
        <h1 className="flex flex-col max-w-xl text-4xl font-bold text-gray-100 md:text-5xl font-roboto xl:text-7xl">
          {Todaylist[value]?.name}
        </h1>
        {/* Rating */}
        <div className="flex flex-row items-center mt-2 mb-2 gap-x-3">
          <div>
            <h3 className="text-base text-gray-100 xl:text-lg">
              {Todaylist[value]?.vote_average}
            </h3>
          </div>
          <Rating value={Todaylist[value]?.vote_average} />
        </div>
        {/* Series description */}
        <p className="max-w-sm text-base tracking-tighter text-gray-100 line-clamp-4 font-roboto">
          {Todaylist[value]?.overview}
        </p>
        <div>
          {/* button for more information about movie */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", ease: "easeOut" }}
            className="flex flex-row items-center px-3 py-2 mt-3 font-medium text-center text-gray-100 bg-red-600 gap-x-2 hover:ring-green-700 hover:ring-1 "
          >
            <Link
              className="flex flex-row items-center w-full "
              to={`/TvSeriesDetails/${Todaylist[value]?.id}`}
            >
              <BiSolidMoviePlay />
              Watch
            </Link>
          </motion.button>
        </div>
      </div>
      <div className="w-[400px] md:hidden container mx-auto  flex items-center justify-end">
        <Slider data={Todaylist} value={value} setValue={setValue} />
      </div>
    </div>
  );
}

export default TvHeroSection;
