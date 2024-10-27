import React, { useContext, useState } from "react";
import MovieListContext from "../../Context/MovieListContext";
import MoviePoster from "../Components/MoviePoster";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  MinusCircle,
  PlusCircle,
  Star,
} from "lucide-react";

function UpComingMovies() {
  const { UpComingMovies } = useContext(MovieListContext);
  const { setPage2 } = useContext(MovieListContext);
  const [count, setCount] = useState(14);
  const { Page2 } = useContext(MovieListContext);

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
    if (Page2 >= 1) {
      setPage2(Page2 + 1);
    }
  };
  const handlePage = () => {
    if (Page2 >= 1) {
      setPage2(Page2 - 1);
    }
  };
  return (
    <div className="container flex flex-col mx-auto">
      <div className="relative py-4">
        {/* Floating decorative elements */}
        <div className="absolute top-0 right-0 hidden md:block">
          <Star className="w-4 h-4 text-red-400 opacity-75 animate-ping" />
        </div>

        {/* Main heading container */}
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-950/20 via-red-900/20 to-rose-900/20 -skew-y-1" />

          {/* Content wrapper */}
          <div className="relative flex items-center gap-4 px-4 py-2">
            {/* Icon */}
            <CalendarClock className="hidden w-8 h-8 text-red-500 animate-pulse sm:block" />

            {/* Heading text with gradient */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                <span className="text-transparent bg-gradient-to-r from-red-200 via-white to-rose-200 bg-clip-text">
                  Upcoming Movies
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-1 text-sm font-normal text-gray-400">
                Get ready for these upcoming releases
              </p>
            </div>

            {/* Decorative line */}
            <div className="flex-grow hidden md:block">
              <div className="h-[2px] bg-gradient-to-r from-red-500/50 via-rose-500/30 to-transparent" />
            </div>
          </div>
        </div>

        {/* Bottom decorative bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

        {/* Optional: Additional decorative elements */}
        <div className="absolute -top-1 left-0 w-20 h-[1px] bg-gradient-to-r from-red-500/50 to-transparent transform -rotate-45" />
        <div className="absolute -bottom-1 right-0 w-20 h-[1px] bg-gradient-to-l from-red-500/50 to-transparent transform -rotate-45" />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 gap-y-8 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 ">
        {UpComingMovies?.slice(0, count).map((data, index) => {
          return (
            <div key={data.id}>
              <MoviePoster
                title={data?.title}
                image2={data?.backdrop_path}
                image={data?.poster_path}
                id={data.id}
                rating={data?.vote_average}
              />
            </div>
          );
        })}
      </div>
      <div className="w-full mt-10">
        <div className="flex items-center justify-end gap-3">
          {/* Less/More Button */}
          {count === 20 ? (
            <button
              onClick={handleDecrease}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-slate-700 text-slate-200"
            >
              <MinusCircle className="w-4 h-4" />
              <span>Show Less</span>
            </button>
          ) : (
            <button
              onClick={handleIncrese}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Show More</span>
            </button>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePages}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handlePage}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
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

export default UpComingMovies;
