import { motion } from "framer-motion";
import { useState, useRef } from "react";

export const Slider = ({ data }) => {
  const [scrollX, setScrollX] = useState(0); // Track scroll position
  const sliderRef = useRef(null); // Reference to the container

  const slideLeft = () => {
    const width = sliderRef.current.offsetWidth; // Get the visible width of the slider
    setScrollX((prev) => Math.min(prev + width, 0)); // Move slider left by visible width
  };

  const slideRight = () => {
    const width = sliderRef.current.offsetWidth;
    const maxScrollX = -(sliderRef.current.scrollWidth - width); // Calculate the max scrollable width
    setScrollX((prev) => Math.max(prev - width, maxScrollX)); // Move slider right by visible width
  };

  return (
    <div className="py-8 text-white bg-gray-900">
      <h2 className="mb-4 text-xl font-bold md:text-2xl">Trending</h2>
      <div className="relative w-full overflow-hidden">
        {/* Slider wrapper with a dynamic translation based on scrollX */}
        <div
          ref={sliderRef}
          className="flex gap-6 px-6 transition-transform duration-500"
          style={{ transform: `translateX(${scrollX}px)` }}
        >
          {data?.map((show, index) => (
            <motion.div
              key={show.id}
              className="w-56 min-w-[200px] cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${show?.poster_path}`}
                  alt={show?.title}
                  className="w-full h-auto rounded-lg"
                />
                <span className="absolute px-2 py-1 font-bold text-pink-500 bg-black rounded-lg bottom-2 left-2 bg-opacity-60">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold truncate">
                {show?.title}
              </h3>
            </motion.div>
          ))}
        </div>
        {/* Add Left/Right navigation buttons */}
        <div className="absolute transform -translate-y-1/2 top-1/2 left-4">
          <button
            onClick={slideLeft}
            className="p-2 text-white transition bg-gray-800 rounded-full hover:bg-pink-500"
          >
            &lt;
          </button>
        </div>
        <div className="absolute transform -translate-y-1/2 top-1/2 right-4">
          <button
            onClick={slideRight}
            className="p-2 text-white transition bg-gray-800 rounded-full hover:bg-pink-500"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};
