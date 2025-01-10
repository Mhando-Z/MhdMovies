import React, { useState, useEffect, useContext } from "react";
import MovieListContext from "../../Context/MovieListContext";
import { motion } from "framer-motion";
// icons import
import { FaArrowUpLong } from "react-icons/fa6";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { setVisible } = useContext(MovieListContext);
  const [progress, setProgress] = useState(0);

  // Show button when page is scrolled up to a certain distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
      setVisible("bg-black bg-opacity-80 z-59");
    } else {
      setIsVisible(false);
      setVisible("");
    }
  };

  // Scroll the page to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY; // Pixels scrolled from the top
      const windowHeight = window.innerHeight; // Height of the viewport
      const documentHeight = document.documentElement.scrollHeight; // Total height of the document

      const totalScrollableHeight = documentHeight - windowHeight;
      const scrolledPercentage = (scrollTop / totalScrollableHeight) * 100;

      setProgress(Math.min(Math.max(scrolledPercentage, 0), 100)); // Clamp value between 0 and 100
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4">
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="bg-red-600 relative bg-opacity-35 text-white p-2 rounded-full shadow-lg ring-2 ring-[#a46425] transition duration-300 ease-in-out"
        >
          <motion.h1
            initial={{ height: "100%" }}
            animate={{ height: `${progress.toFixed(2)}%` }}
            className="transition-all duration-700 ease-in-out md:text-xl md:py-1 "
          >
            {" "}
            ↑
          </motion.h1>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${progress.toFixed(2)}%` }}
            transition={{ duration: 1 }}
            className="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-red-600 bg-opacity-50 rounded-full"
          >
            <FaArrowUpLong className="" />
          </motion.div>
        </motion.button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
