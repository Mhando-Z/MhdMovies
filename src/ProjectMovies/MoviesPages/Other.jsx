import React, { useEffect, useState } from "react";
import movie from "../MData/Mdata.json";
import { Link } from "react-router-dom";

function Other() {
  const [BigData, setData] = useState([]);

  //Json data consumption Logic
  useEffect(() => {
    async function getMovies() {
      const { movies } = movie;
      setData(
        movies.map((data) => {
          return data;
        })
      );
    }
    getMovies();
  }, []);

  return (
    <div>
      <div className="p-2 bg-gray-800 lg:p-3 grid grid-cols-3 lg:grid-cols-6 md:grid-cols-5 gap-y-10 gap-x-2 shadow-2xl justify-evenly">
        {BigData.map((data) => {
          return (
            <div className="border border-b-2 border-b-slate-50" key={data.id}>
              <div className="flex items-center justify-center duration-1000 hover:scale-105  mt-2">
                <Link
                  to={`/movies/${data.id}`}
                  className="text-slate-400 lg:text-2xl line-clamp-2 md:text-xl text-lg text-center font-medium "
                >
                  <img
                    src={data.posterUrl}
                    alt="posterimage"
                    className=" max-w-screen shadow-lg h-aut"
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

export default Other;
