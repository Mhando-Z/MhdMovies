import React, { useContext, useState } from "react";
import TvSeriesContex from "../../Context/TvSeriesContext";
import { motion } from "framer-motion";
import TvSeriesPoster from "../Components/TvSeriesPoster";
import {
  ChevronLeft,
  ChevronRight,
  MinusCircle,
  PlusCircle,
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
      <h1 className="mt-3 text-2xl font-bold text-gray-100 sm:text-3xl md:text-4xl mb-7 font-roboto">
        Popular TvSeries
      </h1>
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
