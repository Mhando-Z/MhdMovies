import React, { useContext, useState } from "react";
import TvSeriesContex from "../Context/TvSeriesContext";
import TvSeries from "../Components/TvSeries";

function TrendinG() {
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
    <div className=" flex flex-col">
      <div className="px-5 border-l-8 bg-slate-800 bg-opacity-75 mb-3 border-yellow-500 ">
        <h1 className="lg:text-3xl text-2xl mt-3 mb-5 max-w-xl block text-white font-semibold">
          Treding Series..
        </h1>
      </div>
      <div className="md:px-10 p-2 items-center grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-x-3 gap-y-5">
        {Todaylist?.slice(0, count).map((data, index) => {
          return (
            <TvSeries
              key={index + data.name}
              title={data.name}
              image={data.poster_path}
              image2={data.backdrop_path}
              id={data.id}
            />
          );
        })}
      </div>
      <div className="flex gap-x-5 items-end justify-between mb-2 py-4">
        <div>
          <h1 className="text-slate-200 lg:text-xl text-lg font-semibold ">
            Page 1
          </h1>
        </div>
        <div className="flex flex-row items-center space-x-5">
          <h1
            onClick={handleDecrease}
            className={`text-slate-200 lg:text-xl  text-lg font-semibold cursor-pointer ${
              count === 20 ? "flex" : "hidden"
            }`}
          >
            Less..
          </h1>
          <h1
            onClick={handleIncrese}
            className={`text-slate-200 lg:text-xl text-lg font-semibold cursor-pointer ${
              count === 20 ? "hidden" : "flex"
            }`}
          >
            More..
          </h1>
        </div>
      </div>
    </div>
  );
}

export default TrendinG;
