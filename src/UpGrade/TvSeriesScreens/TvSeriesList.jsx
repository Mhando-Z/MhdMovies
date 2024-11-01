import React, { useContext, useState } from "react";
import TvSeriesContex from "../../Context/TvSeriesContext";
import { motion } from "framer-motion";
import TvSeriesPoster from "../Components/TvSeriesPoster";
import {
  ChevronLeft,
  ChevronRight,
  MinusCircle,
  PlusCircle,
  Star,
  TrendingUp,
  Tv,
} from "lucide-react";

function TvSeriesList() {
  const { Tvlist } = useContext(TvSeriesContex);
  const { Page1 } = useContext(TvSeriesContex);
  const { setPage1 } = useContext(TvSeriesContex);
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
      <div className="relative">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-red-900/10 to-transparent blur-2xl" />

        <div className="relative py-8">
          {/* Main content container */}
          <div className="flex items-center space-x-6">
            {/* Icon group */}
            <div className="relative hidden sm:block">
              <div className="relative p-3 shadow-lg bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <Tv className="w-6 h-6 text-white" />
                <div className="absolute p-1 bg-yellow-500 rounded-full -top-1 -right-1">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            {/* Header content */}
            <div className="flex-1">
              <div className="relative inline-block">
                <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                  <span className="relative inline-block">
                    {/* Gradient text */}
                    <span className="relative text-transparent bg-gradient-to-r from-white via-red-100 to-red-100 bg-clip-text">
                      Popular TvSeries
                    </span>
                    {/* Animated underline */}
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 via-red-500 to-transparent transform translate-y-2 opacity-70" />
                  </span>
                </h1>

                {/* Rating indicators */}
                <div className="flex items-center mt-3 space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-500"
                        fill={i < 4 ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">|</span>
                  <span className="flex items-center text-sm text-gray-400">
                    <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                    Popular Now
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="items-center hidden space-x-4 lg:flex">
              {/* Animated bars */}
              <div className="flex items-end space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-gradient-to-t from-red-500 to-red-500 animate-pulse"
                    style={{
                      height: `${(i + 2) * 8}px`,
                      animationDelay: `${i * 150}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Floating particles */}
          <div className="absolute top-0 right-0 hidden md:block">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  width: `${4 - i}px`,
                  height: `${4 - i}px`,
                  top: `${i * 12}px`,
                  right: `${i * 18}px`,
                  background: `rgba(${147 + i * 20}, ${51 + i * 20}, ${
                    236 + i * 20
                  }, 0.6)`,
                  animationDelay: `${i * 200}ms`,
                  animationDuration: "3s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 gap-y-8 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 ">
        {Tvlist?.slice(0, count).map((data, index) => {
          return (
            <div key={data.id}>
              <TvSeriesPoster
                name={data?.name}
                image={data?.poster_path}
                image2={data?.backdrop_path}
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

export default TvSeriesList;
