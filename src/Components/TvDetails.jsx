import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import TvSeries from "./TvSeries";
import { Fade } from "@mui/material";
import Rating from "./Rating";

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
        className="w-full h-[700px] bg-no-repeat bg-cover bg-center xl:bg-top relative"
      >
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-l via-transparent from-transparent to-slate-800"></div>
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-slate-800"></div>

        <div className="absolute bottom-0 px-4 lg:px-10">
          <h1 className="mb-3 text-4xl font-extrabold lg:text-6xl md:text-5xl text-slate-200">
            {data.name}
          </h1>
          <div className="flex flex-wrap items-center md:flex-row gap-x-5">
            <h1 className="font-semibold lg:text-2xl md:text-xl text-slate-200">
              Genres:
            </h1>
            {data.genres?.map((data, index) => {
              return (
                <div key={index + data.id} className="">
                  <h1 className="font-semibold text-yellow-500 lg:text-2xl md:text-xl">
                    {data.name}
                  </h1>
                </div>
              );
            })}
          </div>
          <div className="h-[100px] overflow-scroll overflow-x-hidden">
            <p className="max-w-6xl tracking-tighter md:text-xl lg:text-2xl md:line-clamp-none line-clamp-5 text-slate-300 ">
              {data.overview}
            </p>
          </div>
          <div className="items-center justify-center mb-2">
            <h2 className="mb-2 text-slate-300 lg:text-2xl md:text-xl">
              Ratings: {data.vote_average}
            </h2>
            <div className="w-[200px]">
              <Rating value={data.vote_average} />
              {/* <LinearProgress
                sx={{
                  backgroundColor: "white",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "yellow",
                  },
                  height: "3px",
                }}
                variant="determinate"
                value={Math.trunc(data.vote_average) * 10}
              /> */}
            </div>
          </div>
        </div>
        <div className="absolute block px-4 top-1 lg:px-10">
          <div className="flex flex-row space-x-2">
            <h2 className="lg:text-2xl md:text-xl text-slate-200">Status:</h2>
            <h2 className="text-yellow-500 lg:text-2xl md:text-xl">
              {data.status}
            </h2>
          </div>
          <Fade timeout={1000} in={true}>
            <img
              src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
              alt="picha"
              className="mt-2 hidden md:flex xl:h-[260px] lg:h-[250px] md:h-[220px] w-[170px] lg:w-[190px] bg-white bg-no-repeat bg-cover bg-center"
            />
            {/* <div
              style={{
                backgroundImage: `url("${`https://image.tmdb.org/t/p/w500/${data.poster_path}`}")`,
              }}
              className="mt-2 hidden rounded-xl md:flex xl:h-[250px] lg:h-[220px] md:h-[200px] w-[170px] lg:w-[190px] bg-white bg-no-repeat bg-cover bg-center"
            ></div> */}
          </Fade>
        </div>
      </div>
      <div className="flex flex-row justify-between px-4 bg-slate-800 md:justify-normal gap-x-5 rounded-xl lg:px-10">
        <h1 className="lg:text-2xl md:text-xl text-slate-200">
          Budget: {data.budget?.toLocaleString()}
        </h1>
        <h1 className="lg:text-2xl md:text-xl text-slate-200">
          Revenue: {data.revenue?.toLocaleString()}
        </h1>
      </div>
      <div className="flex flex-col md:flex-row">
        {/* Date details */}
        <div className="px-4 lg:px-10">
          {/* date Release details */}
          <div className="flex flex-row space-x-2">
            <h2 className="lg:text-2xl md:text-xl text-slate-200">
              Release Date:
            </h2>
            <h2 className="lg:text-2xl md:text-xl text-slate-200">
              {data.first_air_date}
            </h2>
          </div>
          <div className="flex flex-row space-x-2 ">
            <h2 className="lg:text-2xl md:text-xl text-slate-200">End Date:</h2>
            <h2 className="lg:text-2xl md:text-xl text-slate-200">
              {data.last_air_date}
            </h2>
          </div>
        </div>
        {/* Details on number of episodes and seasons */}
        <div className="px-4 lg:px-10 ">
          <div className="flex flex-row space-x-2">
            <h2 className="text-lg lg:text-2xl text-slate-200">
              Number of Episodes:
            </h2>
            <h2 className="lg:text-2xl md:text-xl text-slate-200">
              {data.number_of_episodes}
            </h2>
          </div>
          <div className="flex flex-row space-x-2 ">
            <h2 className="lg:text-2xl md:text-xl text-slate-200">
              Number Of Seasons:
            </h2>
            <h2 className="lg:text-2xl md:text-xl text-slate-200">
              {data.number_of_seasons}
            </h2>
          </div>
        </div>
      </div>
      {/* Number of seasons print */}
      <div
        className={`flex flex-wrap ${
          data.seasons?.length <= 1 ? "justify-start" : "justify-center"
        } md:justify-start gap-5 lg:px-10 px-4 mt-4 h-[270px] overflow-auto `}
      >
        {data.seasons?.map((data, index) => {
          return (
            <div key={data.id + index} className="">
              <div
                style={{
                  backgroundImage: `url("https://image.tmdb.org/t/p/w500/${data.poster_path}")`,
                }}
                className="bg-center bg-contain rounded-lg lg:size-44 size-32 "
              ></div>
              <div className="flex flex-col mt-1 lg:max-w-48 max-w-36 ">
                <h1 className="text-lg lg:text-xl text-slate-200 ">
                  {data.name}
                </h1>
                <h1 className="text-lg lg:text-xl text-slate-200 ">
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
      <div className="flex flex-col items-center justify-between px-4 mt-5 gap-y-5 sm:flex-row lg:max-w-lg lg:px-10">
        <button
          className="w-full px-8 py-3 text-sm rounded-lg sm:w-auto ring-1 ring-slate-200 lg:text-xl text-slate-200"
          onClick={handleClick}
        >
          WATCH TRAILERS
        </button>
        <Link
          to={`https://vidsrc.xyz/embed/tv?imdb=${id.imdb_id}`}
          className="w-full px-8 py-3 text-sm text-center rounded-lg sm:w-auto ring-1 ring-slate-200 lg:text-xl text-slate-200"
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
        <div className="px-4 mb-3 bg-opacity-75 border-l-8 border-yellow-500 lg:px-10 bg-slate-800 ">
          <h1 className="block max-w-xl mt-3 mb-5 text-2xl font-semibold text-white lg:text-3xl">
            Series you might like
          </h1>
        </div>
        <div className="flex flex-col xl:items-center">
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-3 p-2 lg:px-10 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-x-3 gap-y-5">
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
          <div className="flex items-end justify-end px-10 py-4 gap-x-5">
            <h1 className="text-lg font-semibold text-slate-200 lg:text-xl ">
              Page {Page}
            </h1>
            <h1
              onClick={handleIncrese}
              className="text-lg font-semibold cursor-pointer text-slate-200 lg:text-xl"
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
          <div className="sticky top-0 flex border-b-2 bg-slate-900 border-slate-700">
            <h1 className="px-10 mt-5 mb-5 text-2xl font-semibold text-yellow-500 md:text-3xl ">
              Reviews
            </h1>
          </div>
          {Review.map((data, index) => {
            return (
              <div key={index + data.author} className="flex flex-col px-10">
                <h1 className="text-xl font-semibold md:text-2xl text-slate-200">
                  {data.author}
                </h1>
                <p className="mb-6 tracking-tighter text-justify  md:text-xl text-slate-200">
                  {data.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TvDetails;
