import React, { useContext, useState } from "react";
import MovieListContext from "../Context/MovieListContext";
import Movie from "../Components/Movie";

function UpcomingMovies() {
  const { UpComingMovies } = useContext(MovieListContext);
  const { HandlePage2 } = useContext(MovieListContext);
  const [count, setCount] = useState(14);
  const { Page2 } = useContext(MovieListContext);

  const handleIncrese = () => {
    if (count !== 20) {
      setCount(count + 6);
    } else {
      HandlePage2();
    }
  };
  return (
    <div className=" flex flex-col  justify-center">
      <div className="px-10 py-5 border-l-8 bg-slate-800 bg-opacity-75 mb-3 border-yellow-500 invisible md:visible ">
        <h1 className="text-4xl max-w-xl block text-white font-semibold">
          Upcoming Movies..
        </h1>
      </div>
      <div className="px-5 border-l-8 bg-slate-800 bg-opacity-75 mb-3 border-yellow-500 md:invisible visible ">
        <h1 className="text-3xl mt-3 md:hidden mb-5 max-w-xl block text-white font-semibold">
          Upcoming Movies..
        </h1>
      </div>
      <div className="md:px-10 p-2 items-center grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-x-3 gap-y-5">
        {UpComingMovies?.slice(0, count).map((data, index) => {
          return (
            <Movie
              key={index + data.title}
              title={data.title}
              image={data.poster_path}
              id={data.id}
            />
          );
        })}
      </div>
      <div className="flex gap-x-5 items-end justify-end px-10 py-4">
        <h1 className="text-slate-200 text-xl font-semibold ">Page {Page2}</h1>
        <h1
          onClick={handleIncrese}
          className="text-slate-200 text-xl font-semibold cursor-pointer"
        >
          More..
        </h1>
      </div>
    </div>
  );
}

export default UpcomingMovies;
