import React, { useEffect, useState } from "react";
import movies from "../MData/MoviesData.json";
import { Link } from "react-router-dom";
import ScrollToTopButton from "./pageScroll";
import famy from "../MData/family.png";

function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950">
      <div className="">
        <h1 className="lg:text-6xl text-3xl mb-10 text-slate-200 duration-30000 font-bold animate-pulse text-center">
          Page is Loading.....
        </h1>
        <img
          src="../MData/rotate.png"
          alt="popo"
          className=" w-10 bg-white h-10 animate-spin"
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
      <div className="flex-col mt-2  container mx-auto bg-slate-800 rounded-2xl p-2  flex items-center justify-center mb-10">
        <img src={famy} alt="postermage" className="max-w-screen h-96" />
        <h1 className="text-slate-400 text-5xl font-bold">MhdMovies</h1>
      </div>
      <div className="mt-14 mb-14 flex items-center justify-center">
        <div className="flex md:flex-row flex-col items-center gap-5">
          <input
            type="text"
            className="border rounded-xl text-slate-300 outline-none border-slate-400 bg-slate-700 sm:px-24 p-16 py-4 text-center text-xl lg:text-2xl"
          />
          <button className="py-4 px-10 text-center font-medium text-2xl bg-slate-900 rounded-xl text-slate-400  ">
            Search
          </button>
        </div>
      </div>
      <div className="p-10 bg-gray-800 lg:p-3 grid grid-cols-3 lg:grid-cols-6 md:grid-cols-5 gap-y-10 gap-x-4 shadow-2xl justify-evenly">
        {BigData.map((data) => {
          return (
            <div className="border border-b-2 border-b-slate-50" key={data.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                alt="posterimage"
                className=" duration-1000 hover:scale-105 max-w-screen shadow-lg h-auto rounded-b-2xl"
              />
              <div className="flex items-center justify-center mt-2">
                <Link
                  to={`/movie/${data.id}`}
                  className="text-slate-400  duration-1000 hover:scale-105 lg:text-2xl line-clamp-2 text-xl text-center font-medium "
                >
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
