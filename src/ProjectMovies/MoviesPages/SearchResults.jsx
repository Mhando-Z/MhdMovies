import React from "react";
import { Link, useLocation } from "react-router-dom";

function SearchResults() {
  const location = useLocation();
  const { searchResult } = location.state;
  console.log(location);

  return (
    <div className="container mx-auto">
      <div className="p-1 lg:mt-5 bg-gray-800 lg:p-3 grid grid-cols-3 lg:grid-cols-6 md:grid-cols-5 gap-y-10 gap-x-2 shadow-2xl justify-evenly">
        {searchResult.map((data) => {
          return (
            <div className="border border-b-2 border-b-slate-50" key={data.id}>
              <div className="flex duration-1000 shadow-xl hover:scale-105 items-center flex-col gap-2 justify-center mt-2">
                <Link
                  to={`/movie/${data.id}`}
                  className="text-slate-400 lg:text-2xl line-clamp-2 md:text-xl text-lg text-center font-medium "
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                    alt="posterimage"
                    className=" max-w-screen shadow-xl h-auto"
                  />
                  {data.title}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchResults;
