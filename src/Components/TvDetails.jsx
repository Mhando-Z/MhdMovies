import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import ScrollToTopButton from "./pageScroll";
import TvSeries from "./TvSeries";
import LinearProgress from "@mui/material/LinearProgress";

function TvDetails({ data, Review, Similar, Page, HandlePage, id }) {
  const [count, setCount] = useState(14);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  //Page Count Logic
  const handleIncrese = () => {
    if (count !== 20) {
      setCount(count + 6);
    } else {
      HandlePage();
    }
  };

  return (
    <div>
      <div
        style={{
          backgroundImage: `url("${`https://image.tmdb.org/t/p/w500/${data.backdrop_path}`}")`,
        }}
        className="w-full h-[600px] bg-no-repeat bg-cover bg-center xl:bg-top relative"
      >
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-l via-transparent from-transparent to-slate-800"></div>
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-b from-transparent to-slate-800"></div>
        <div className="absolute bottom-0 lg:px-10 px-4">
          <h1 className="mb-3 text-4xl font-semibold text-slate-200 ">
            {data.name}
          </h1>
          <div className="flex flex-wrap md:flex-row gap-x-5 items-center">
            <h1 className="text-2xl text-slate-200 font-semibold">Genres:</h1>
            {data.genres?.map((data, index) => {
              return (
                <div key={index + data.id} className="">
                  <h1 className="text-xl text-yellow-500 font-semibold">
                    {data.name}
                  </h1>
                </div>
              );
            })}
          </div>
          <p className="text md:text-2xl text-md md:line-clamp-none line-clamp-5  text-justify tracking-tighter xl:max-w-none  lg:max-w-6xl text-slate-300 ">
            {data.overview}
          </p>
          <div className="items-center justify-center mb-2">
            <h2 className="text-slate-300 mb-2 text-xl">
              Ratings: {data.vote_average}
            </h2>
            <div className="w-[200px]">
              <LinearProgress
                sx={{
                  backgroundColor: "white",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "yellow",
                  },
                  height: "8px",
                }}
                variant="determinate"
                value={Math.trunc(data.vote_average) * 10}
              />
            </div>
          </div>
        </div>
        <div className="absolute top-10 lg:px-10 px-4 block">
          <div className="flex flex-row space-x-2">
            <h2 className="md:text-2xl text-lg text-slate-200">Status:</h2>
            <h2 className="md:text-2xl text-lg text-yellow-500">
              {data.status}
            </h2>
          </div>
        </div>
      </div>
      <div className="bg-slate-800 flex flex-row md:justify-normal justify-between gap-x-5 rounded-xl lg:px-10 px-4">
        <h1 className="text-xl text-slate-200">
          Budget: {data.budget?.toLocaleString()}
        </h1>
        <h1 className="text-xl text-slate-200">
          Revenue: {data.revenue?.toLocaleString()}
        </h1>
      </div>
      <div className="flex flex-col md:flex-row">
        {/* Date details */}
        <div className="px-4 lg:px-10">
          {/* date Release details */}
          <div className="flex flex-row space-x-2">
            <h2 className="md:text-2xl text-lg text-slate-200">
              Release Date:
            </h2>
            <h2 className="md:text-2xl text-lg text-slate-200">
              {data.first_air_date}
            </h2>
          </div>
          <div className="flex flex-row  space-x-2 ">
            <h2 className="md:text-2xl text-lg text-slate-200">End Date:</h2>
            <h2 className="md:text-2xl text-lg text-slate-200">
              {data.last_air_date}
            </h2>
          </div>
        </div>
        {/* Details on number of episodes and seasons */}
        <div className="px-4 lg:px-10 ">
          <div className="flex flex-row space-x-2">
            <h2 className="md:text-2xl text-lg text-slate-200">
              Number of Episodes:
            </h2>
            <h2 className="md:text-2xl text-lg text-slate-200">
              {data.number_of_episodes}
            </h2>
          </div>
          <div className="flex flex-row  space-x-2 ">
            <h2 className="md:text-2xl text-lg text-slate-200">
              Number Of Seasons:
            </h2>
            <h2 className="md:text-2xl text-lg text-slate-200">
              {data.number_of_seasons}
            </h2>
          </div>
        </div>
      </div>
      {/* Number of seasons print */}
      <div
        className={`flex flex-wrap ${
          data.seasons.length <= 1 ? "justify-start" : "justify-center"
        } md:justify-start gap-5 lg:px-10 px-4 mt-4 h-[400px] overflow-auto `}
      >
        {data.seasons?.map((data) => {
          return (
            <div key={data.id} className="">
              <div
                style={{
                  backgroundImage: `url("https://image.tmdb.org/t/p/w500/${data.poster_path}")`,
                }}
                className="bg-contain bg-center lg:size-44 size-32 rounded-lg "
              ></div>
              <div className="flex flex-col mt-1 lg:max-w-48 max-w-36 ">
                <h1 className="lg:text-xl text-lg text-slate-200 ">
                  {data.name}
                </h1>
                <h1 className="lg:text-xl text-lg text-slate-200 ">
                  No-Ep: {data.episode_count}
                </h1>
                <h1 className="lg:text-xl text-md text-slate-200 ">
                  Date: {data.air_date}
                </h1>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-y-5 sm:flex-row flex-col justify-between lg:max-w-lg items-center lg:px-10 px-4 mt-5">
        <button
          className="py-3 w-full sm:w-auto px-8 ring-1 ring-slate-200 lg:text-xl text-sm rounded-lg text-slate-200"
          onClick={handleClick}
        >
          WATCH TRAILERS
        </button>

        <Link
          to={`https://vidsrc.xyz/embed/tv?imdb=${id.imdb_id}`}
          className="py-3 w-full text-center sm:w-auto px-8 ring-1 ring-slate-200 lg:text-xl text-sm rounded-lg text-slate-200"
        >
          WATCH SERIES
        </Link>
      </div>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className="px-10 mt-5 bg-slate-900 rounded-2xl h-[600px] overflow-auto">
          <Outlet />
        </div>
      </Collapse>
      <div className="flex flex-col mt-4 ">
        <div className="px-4 lg:px-10 border-l-8 bg-slate-800 bg-opacity-75 mb-3 border-yellow-500 ">
          <h1 className="lg:text-3xl text-2xl mt-3 mb-5 max-w-xl block text-white font-semibold">
            Series you might like
          </h1>
        </div>
        <div className="flex flex-col xl:items-center">
          <div className="flex flex-col items-center">
            <div className="lg:px-10 p-2 items-center grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-x-3 gap-y-5">
              {Similar?.slice(0, count).map((data, index) => {
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
          </div>
          <div className="flex gap-x-5 items-end justify-end px-10 py-4">
            <h1 className="text-slate-200 lg:text-xl text-lg font-semibold ">
              Page {Page}
            </h1>
            <h1
              onClick={handleIncrese}
              className="text-slate-200 lg:text-xl text-lg font-semibold cursor-pointer"
            >
              More..
            </h1>
          </div>
        </div>
      </div>
      {Review.length === 0 ? (
        ""
      ) : (
        <div className="mt-5 h-[400px] overflow-auto bg-slate-900 rounded-2xl">
          <h1 className="text-3xl px-10 text-yellow-500 mb-5 mt-5 font-semibold ">
            Reviews
          </h1>
          {Review.map((data, index) => {
            return (
              <div key={index + data.author} className="px-10 flex flex-col">
                <h1 className="text-2xl text-slate-200 font-semibold">
                  {data.author}
                </h1>
                <p className="text-md md:text-xl text-justify mb-6 tracking-tighter text-slate-200">
                  {data.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
      <ScrollToTopButton />
    </div>
  );
}

export default TvDetails;
