import React, { useState, useEffect, useContext } from "react";
import MovieListContext from "../../Context/MovieListContext";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { setVisible } = useContext(MovieListContext);

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

  return (
    <div className="fixed bottom-4 right-4">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-red-600 bg-opacity-35 text-white p-3 rounded-full shadow-lg ring-2 ring-[#a46425] transition duration-300 ease-in-out"
        >
          <h1 className="transition-all duration-700 ease-in-out animate-bounce md:text-xl md:py-1 ">
            {" "}
            ↑
          </h1>
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
