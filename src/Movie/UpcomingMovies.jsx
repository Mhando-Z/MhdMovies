import React, { useContext, useState } from "react";
import MovieListContext from "../Context/MovieListContext";
import Movie from "../Components/Movie";

function UpcomingMovies() {
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
    <div className="flex flex-col justify-center ">
      {/* <div className="invisible px-10 py-5 mb-3 bg-opacity-75 border-l-8 border-yellow-500 bg-slate-800 md:visible ">
        <h1 className="block max-w-xl text-4xl font-semibold text-white">
          Upcoming Movies..
        </h1>
      </div> */}
      <div className="px-5 mb-3 bg-opacity-75 border-l-8 border-yellow-500 bg-slate-800 ">
        <h1 className="block max-w-xl mt-3 mb-5 text-2xl font-semibold text-white lg:text-3xl">
          Upcoming Movies..
        </h1>
      </div>
      <div className="grid items-center grid-cols-3 p-2 md:px-10 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-x-3 gap-y-5">
        {UpComingMovies?.slice(0, count).map((data, index) => {
          return (
            <Movie
              key={index + data.title}
              title={data.title}
              image={data.poster_path}
              image2={data.backdrop_path}
              id={data.id}
            />
          );
        })}
      </div>
      <div className="flex items-end justify-between py-4 mb-2 gap-x-5">
        <div>
          <h1 className="text-lg font-semibold text-slate-200 lg:text-xl ">
            Page {Page2}
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
          <h1
            onClick={handlePage}
            className="text-lg font-semibold cursor-pointer text-slate-200 lg:text-xl"
          >
            Prev
          </h1>
          <h1
            onClick={handlePages}
            className="text-lg font-semibold cursor-pointer text-slate-200 lg:text-xl"
          >
            Next
          </h1>
        </div>
      </div>
    </div>
  );
}

export default UpcomingMovies;
