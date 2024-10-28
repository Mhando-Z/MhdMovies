import React, { useContext, useState } from "react";
import TvSeriesPoster from "../Components/TvSeriesPoster";
import TvSeriesContex from "../../Context/TvSeriesContext";
import { Flame, MinusCircle, PlusCircle } from "lucide-react";

function TodaySeies() {
  const { Todaylist } = useContext(TvSeriesContex);
  const [count, setCount] = useState(14);

  //simple logic
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
            Trending this Week
          </h1>

          {/* Decorative line */}
          <div className="flex-grow hidden ml-4 md:block">
            <div className="h-0.5 bg-gradient-to-r from-red-500 to-transparent opacity-30" />
          </div>
        </div>

        {/* Optional subtitle or description */}
        <p className="mt-2 text-sm text-gray-400 pl-11 md:text-base">
          Discover the most popular TvSeries right now
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 gap-y-8 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 ">
        {Todaylist?.slice(0, count).map((data, index) => {
          return (
            <div key={data.id}>
              <TvSeriesPoster
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
        </div>
      </div>
    </div>
  );
}

export default TodaySeies;
