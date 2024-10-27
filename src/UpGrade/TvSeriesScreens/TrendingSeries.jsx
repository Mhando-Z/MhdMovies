import React, { useContext, useState } from "react";
import TvSeriesContex from "../../Context/TvSeriesContext";
import TvSeriesPoster from "../Components/TvSeriesPoster";
import { MinusCircle, PlusCircle, TrendingUp, Tv } from "lucide-react";

function TrendingSeries() {
  const { Todaylist } = useContext(TvSeriesContex);

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
  return (
    <div className="container flex flex-col mx-auto">
      <div className="relative py-6">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-red-500/5 to-transparent blur-xl" />

        <div className="relative">
          {/* Main container */}
          <div className="flex items-center gap-4">
            {/* Icon group with animation */}
            <div className="relative hidden sm:block">
              <Tv className="w-8 h-8 text-red-500" />
              <TrendingUp className="absolute w-4 h-4 text-red-400 -top-2 -right-2 animate-bounce" />
            </div>

            {/* Heading content */}
            <div className="flex flex-col">
              <div className="relative">
                {/* Main heading with gradient */}
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  <span className="relative">
                    {/* Gradient underline */}
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 via-red-400 to-transparent transform translate-y-2" />
                    {/* Text with gradient */}
                    <span className="relative text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text">
                      Trending Series
                    </span>
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="mt-4 text-sm text-gray-400">
                  Most watched shows right now
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="items-center flex-grow hidden gap-2 md:flex">
              <div className="flex-grow h-[1px] bg-gradient-to-r from-red-500/50 to-transparent" />
              {/* Trending indicators */}
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-red-500/50 animate-pulse"
                    style={{
                      height: `${(i + 1) * 8}px`,
                      animationDelay: `${i * 200}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute top-0 right-0 hidden md:block">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-red-400/60 animate-ping"
              style={{
                top: `${i * 10}px`,
                right: `${i * 15}px`,
                animationDelay: `${i * 300}ms`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 gap-y-8 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 ">
        {Todaylist?.slice(0, count).map((data, index) => {
          return (
            <div key={data.id}>
              <TvSeriesPoster
                name={data?.name}
                image2={data?.backdrop_path}
                image={data?.poster_path}
                id={data.id}
                rating={data?.vote_average}
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-end justify-end w-full mt-10">
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
      </div>
    </div>
  );
}

export default TrendingSeries;
