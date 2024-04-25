import React, { useContext, useState } from "react";
import Movie from "../Components/Movie";
import MovieListContext from "../Context/MovieListContext";

function MovieList() {
  const { Movielists } = useContext(MovieListContext);
  const { HandlePage } = useContext(MovieListContext);
  const { Page1 } = useContext(MovieListContext);
  const [count, setCount] = useState(14);

  const handleIncrese = () => {
    if (count !== 20) {
      setCount(count + 6);
    } else {
      HandlePage();
    }
  };

  return (
    <div className=" flex flex-col">
      <div className="px-5 border-l-8 bg-slate-800 bg-opacity-75 mb-3 border-yellow-500 md:invisible visible ">
        <h1 className="text-3xl mt-3 md:hidden mb-5 max-w-xl block text-white font-semibold">
          Trending Movies..
        </h1>
      </div>
      <div className="md:px-10 p-2 items-center grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-x-3 gap-y-5">
        {Movielists?.slice(0, count).map((data, index) => {
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
      <div className="flex gap-x-5 items-end justify-end  py-4">
        <h1 className="text-slate-200 lg:text-xl text-lg font-semibold ">
          Page {Page1}
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

export default MovieList;
