import React, { useContext, useState } from "react";
import { MoviePoster } from "../Components/Collection";
import MovieListContext from "../../Context/MovieListContext";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  MinusCircle,
  PlusCircle,
} from "lucide-react";

function TrendingMovies() {
  const { Movielists } = useContext(MovieListContext);
  const { setPage1 } = useContext(MovieListContext);
  const { Page1 } = useContext(MovieListContext);
  const [count, setCount] = useState(14);

  const handleIncrese = () => {
    if (count !== 20) {
      setCount(count + 6);
    }
  };
  //handle Decrease
  const handleDecrease = () => {
    if (count === 20 && count >= 14) {
      setCount(count - 6);
    }
  };
  //Handle Pages Logic
  const handlePages = () => {
    if (Page1 >= 1) {
      setPage1(Page1 + 1);
    }
  };
  const handlePage = () => {
    if (Page1 >= 1) {
      setPage1(Page1 - 1);
    }
  };

  return (
    <div className="container flex flex-col mx-auto">
      <div className="relative mb-8">
        {/* Decorative background element */}
        <div className="absolute -skew-y-3 -inset-1 bg-gradient-to-r from-red-600 to-red-900 opacity-20 blur-xl" />

        {/* Main heading container */}
        <div className="relative flex items-center gap-3">
          {/* Icon */}
          <Flame className="w-8 h-8 text-red-500 animate-pulse" />

          {/* Heading text */}
          <h1 className="text-2xl font-bold tracking-tight text-transparent sm:text-3xl md:text-4xl bg-gradient-to-r from-white to-gray-300 bg-clip-text">
            Trending Movies
          </h1>

          {/* Decorative line */}
          <div className="flex-grow hidden ml-4 md:block">
            <div className="h-0.5 bg-gradient-to-r from-red-500 to-transparent opacity-30" />
          </div>
        </div>

        {/* Optional subtitle or description */}
        <p className="mt-2 text-sm text-gray-400 md:text-base">
          Discover the most popular movies right now
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 gap-y-8 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 ">
        {Movielists?.slice(0, count).map((data, index) => {
          return (
            <div key={data.id}>
              <MoviePoster
                image2={data?.backdrop_path}
                title={data?.title}
                image={data?.poster_path}
                id={data.id}
                rating={data?.vote_average}
              />
            </div>
          );
        })}
      </div>
      {/* action buttons */}
      <div className="w-full mt-10">
        <div className="flex items-center justify-end gap-3">
          {/* Less/More Button */}
          {count === 20 ? (
            <button
              onClick={handleDecrease}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-slate-700 text-slate-200"
            >
              <MinusCircle className="w-4 h-4" />
              <span>Show Less</span>
            </button>
          ) : (
            <button
              onClick={handleIncrese}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Show More</span>
            </button>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePages}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handlePage}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrendingMovies;
