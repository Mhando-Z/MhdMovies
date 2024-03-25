import React, { useEffect, useState } from "react";
import movies from "../MData/MoviesData.json";
import { Link } from "react-router-dom";
import ScrollToTopButton from "./pageScroll";
import famy from "../MData/family.png";
import SearchIcon from "@mui/icons-material/Search";
import LoopIcon from "@mui/icons-material/Loop";

function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950">
      <div className="flex flex-col items-center justify-center">
        <h1 className="lg:text-4xl text-2xl mb-10 text-slate-200 duration-30000 font-bold animate-pulse text-center">
          Page is Loading.....
        </h1>
        <LoopIcon
          className="animate-spin "
          sx={{
            fontSize: { sm: "1.5rem", lg: "2.5rem" },
            color: "white",
          }}
        />
      </div>
    </div>
  );
}

function HomePage() {
  const [BigData, setData] = useState([]);

  //Json data consumption Logic
  useEffect(() => {
    async function getMovies() {
      const { data } = movies;
      setData(
        data.map((data) => {
          return data;
        })
      );
    }
    getMovies();
  }, []);

  //
  if (BigData.length === 0) {
    return <Loading />;
  }

  return (
    <div className="shadow-2xl">
      <div className="flex-col mt-2 container mx-auto bg-slate-800 rounded-2xl p-2  flex items-center justify-center ">
        <img src={famy} alt="postermage" className="max-w-screen h-96" />
        <h1 className="text-slate-400 text-5xl font-bold">MhdMovies</h1>
      </div>
      <div className="mt-7 mb-7 lg:mb-12 lg:mt-12 flex items-center justify-center">
        <div className="flex md:flex-row flex-col items-center gap-5">
          <input
            type="text"
            className="border rounded-xl text-slate-300 outline-none border-slate-400 bg-slate-700 sm:px-24  py-2 text-center text-xl lg:text-2xl"
          />
          <button className="lg:py-2 lg:px-10 py-2  px-6 text-center font-medium lg:text-2xl text-xl bg-slate-900 rounded-xl text-slate-400  ">
            <SearchIcon fontSize="large" />
            Search
          </button>
        </div>
      </div>
      <div className="p-2 bg-gray-800 lg:p-3 grid grid-cols-3 lg:grid-cols-6 md:grid-cols-5 gap-y-10 gap-x-2 shadow-2xl justify-evenly">
        {BigData.map((data) => {
          return (
            <div className="border border-b-2 border-b-slate-50" key={data.id}>
              <div className="flex duration-1000 hover:scale-105 items-center flex-col gap-2 justify-center mt-2">
                <Link
                  to={`/movie/${data.id}`}
                  className="text-slate-400 lg:text-2xl line-clamp-2 md:text-xl text-lg text-center font-medium "
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                    alt="posterimage"
                    className=" max-w-screen shadow-lg h-auto"
                  />
                  {data.title}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default HomePage;
