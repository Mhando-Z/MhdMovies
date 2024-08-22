import React, { useContext } from "react";
import TvSeriesContex from "../../Context/TvSeriesContext";
import TvSeriesPoster from "../Components/TvSeriesPoster";

function AiringToday() {
  const { ToDay } = useContext(TvSeriesContex);
  console.log(ToDay);

  return (
    <div className="">
      <div className="grid grid-flow-col gap-1 mt-2 overflow-x-auto overflow-y-hidden">
        {ToDay?.map((data) => {
          return (
            <div className="w-[15rem]" key={data.id}>
              <TvSeriesPoster
                name={data?.name}
                image={data?.poster_path}
                id={data.id}
                rating={data?.vote_average}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AiringToday;
