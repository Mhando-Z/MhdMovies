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
      <div className="container p-10 bg-gray-800 lg:p-3 mt-10 mx-auto grid sm:grid-cols-2 grid-cols-2 lg:grid-cols-6 md:grid-cols-5 gap-y-10 gap-x-5 shadow-2xl justify-center">
        {BigData.map((data) => {
          return (
            <div className="border border-b-2 border-b-slate-50" key={data.id}>
              <img
                src={data.posterUrl}
                alt="posterimage"
                className=" duration-1000 hover:scale-105 max-w-screen shadow-lg h-auto rounded-b-2xl"
              />
              <div className="flex items-center justify-center mt-2">
                <Link
                  to={`/movies/${data.id}`}
                  className="text-slate-400  duration-1000 hover:scale-105 lg:text-2xl line-clamp-2 text-xl text-center font-medium "
                >
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
