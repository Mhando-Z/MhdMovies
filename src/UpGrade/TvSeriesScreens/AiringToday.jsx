// export default AiringToday;
import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import TvSeriesContex from "../../Context/TvSeriesContext";
import { Dots } from "react-activity";
import { Rating } from "../Components/Collection";
import { BsCalendarEvent } from "react-icons/bs";
import { Link } from "react-router-dom";

const AiringToday = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ToDay } = useContext(TvSeriesContex);

  const slideWidth = 250; // Adjust this to the width of each slide

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % ToDay.length);
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [ToDay.length]);

  if (!ToDay || ToDay?.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Dots color="white" size={32} speed={1} animating={true} />
      </div>
    );
  }

  return (
    <div className="container relative flex py-6 mx-auto overflow-hidden">
      <motion.div
        className="flex gap-4"
        animate={{ x: -activeIndex * slideWidth }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {ToDay?.map((day, index) => (
          <motion.div
            key={index + day.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`relative rounded-xl p-8 h-[400px] flex flex-col justify-between overflow-hidden ${
              index === activeIndex
                ? "min-w-[250px] md:min-w-[600px]"
                : "min-w-[250px]"
            } transition-all duration-300`}
          >
            <Link to={`/TvSeriesDetails/${day?.id}`}>
              {/* poster image overlay  */}
              <div className="absolute top-0 bottom-0 left-0 right-0">
                <img
                  src={`https://image.tmdb.org/t/p/original/${
                    index === activeIndex
                      ? day?.backdrop_path
                      : day?.poster_path
                  }`}
                  alt={day?.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent via-50% to-transparent" />
              </div>

              {/* Content Container */}
              <div className="absolute bottom-0 left-0 right-0 z-10 px-5">
                {/* Series Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`text-2xl font-bold text-white ${
                    index === activeIndex ? "" : "hidden"
                  }`}
                >
                  {day?.name}
                  <span className="flex items-center gap-2">
                    <span className="font-medium">
                      {day?.vote_average?.toFixed(1)}
                    </span>
                    <Rating value={day?.vote_average} />
                    <BsCalendarEvent className="w-4 h-4" />
                    <span>{day?.first_air_date?.split("-")[0]}</span>
                  </span>
                </motion.h2>

                {/* Series Overview */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`${
                    index === activeIndex
                      ? "text-white/80 line-clamp-2 md:line-clamp-none"
                      : "hidden"
                  }`}
                >
                  {day?.overview}
                </motion.p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AiringToday;
