import React, { useContext, useState } from "react";
import TvSeriesContex from "../Context/TvSeriesContext";
import TvSeries from "../Components/TvSeries";

function TodaySeies() {
  const { Todaylist } = useContext(TvSeriesContex);
  const { Page2 } = useContext(TvSeriesContex);
  const { HandlePage2 } = useContext(TvSeriesContex);
  const [count, setCount] = useState(14);

  //simple logic
  const handleIncrese = () => {
    if (count !== 20) {
      setCount(count + 6);
    } else {
      HandlePage2();
    }
  };

  return (
    <div className=" flex flex-col  justify-center">
      {/* <div className="px-10 py-5 border-l-8 bg-slate-800 bg-opacity-75 mb-3 border-yellow-500 invisible md:visible ">
        <h1 className="text-4xl max-w-xl block text-white font-semibold">
          Today's Series..
        </h1>
      </div> */}
      <div className="px-5 border-l-8 bg-slate-800 bg-opacity-75 mb-3 border-yellow-500">
        <h1 className="lg:text-3xl text-2xl mt-3 mb-5 max-w-xl block text-white font-semibold">
          Today's Series..
        </h1>
      </div>
      <div className="md:px-10 p-2 items-center grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-x-3 gap-y-5">
        {Todaylist?.slice(0, count).map((data, index) => {
          return (
            <TvSeries
              key={index + data.name}
              title={data.name}
              image={data.poster_path}
              id={data.id}
            />
          );
        })}
      </div>
      <div className="flex gap-x-5 items-end justify-end py-4">
        <h1 className="text-slate-200 lg:text-xl text-lg font-semibold ">
          Page {Page2}
        </h1>
        <h1
          onClick={handleIncrese}
          className="text-slate-200 lg:text-xl text-lg font-semibold cursor-pointer"
        >
          More..
        </h1>
      </div>
    </div>
  );
}

export default TodaySeies;