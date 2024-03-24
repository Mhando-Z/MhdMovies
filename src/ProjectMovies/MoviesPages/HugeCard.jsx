import movies from "../MData/MoviesData.json";
import { Link, useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import ReactPlayer from "react-player";
import ScrollToTopButton from "./pageScroll";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
import Other from "./Other";

function HugeCard() {
  const [open, setOpen] = useState(false);
  const { data } = movies;
  const { id } = useParams();
  const datas = data.find((mov) => mov.id === parseInt(id));

  const handleClick = () => {
    setOpen(!open);
  };

  //Genres Logic
  const genres = datas.genres.map((dt) => {
    return dt;
  });
  //Cast Logic
  const cast = datas.cast.map((data) => {
    return data.name;
  });
  //Directors Logic
  const directors = datas.directors.map((data) => {
    return data.name;
  });
  //Writters Logic
  const writers = datas.writers.map((data) => {
    return data.name;
  });
  //Similar movies logic
  const similar = datas.similar.map((data) => {
    return data.title;
  });

  // Duration Logic
  const hours = Math.trunc(datas.runtime / 60);
  const min = datas.runtime % 60;
  //Profit Loss Logic
  //VIdeo player Apsect Ratio
  let width = "420px";
  let height = "250px";

  return (
    <div className="container mx-auto shadow-2xl rounded-xl">
      <div className="mb-10 mt-5 ">
        <Link
          to="/"
          className="text-white hover:scale-110  duration-[2000ms] lg:text-2xl text-xl bg-gray-700 py-2 px-6"
        >
          Back
        </Link>
      </div>
      <div className="flex space-x-12 flex-col lg:space-x-14 lg:p-10 p-5 lg:flex-row bg-slate-800 rounded-xl shadow-xl ">
        <div className="flex flex-col gap-2 ">
          <img
            src={`https://image.tmdb.org/t/p/w500${datas.poster_path}`}
            alt="posterimage"
            className="max-w-screen h-auto rounded-xl shadow-md  duration-1000 hover:scale-105 "
          />
          <div className="flex flex-col items-center justify-center mt-4 gap-3">
            <h1 className="text-4xl text-slate-300 ">{datas.title}</h1>
            <h2 className="text-slate-300 text-xl max-w-md">
              Tagline: {datas.tagline}
            </h2>
            <p className="text-xl max-w-md text-justify text-slate-500">
              {datas.overview}
            </p>
          </div>
          <div className="flex items-center justify-center flex-row lg:gap-2 gap-1">
            <h2 className="text-slate-300 text-xl">Genres:</h2>
            {genres.map((data, index) => {
              return (
                <h2 className="text-slate-300 text-xl" key={index}>
                  {`${data} `}
                </h2>
              );
            })}
          </div>
        </div>
        <div className="lg:flex lg:flex-col lg:justify-start lg:items-start grid grid-cols-2 items-center justify-center lg:p-2 p-24 gap-10 gap-x-20">
          <div className="items-center justify-center">
            <h2 className="text-slate-300 mb-2 text-xl">
              Ratings: {datas.vote_average}
            </h2>
            <Rating
              name="disabled"
              defaultValue={datas.vote_average}
              precision={0.5}
              max={10}
              sx={{ p: 0, m: 0 }}
              readOnly
            />
          </div>
          <div className="flex lg:flex-row flex-col gap-2">
            <h2 className="text-slate-300 text-xl"> Duration:</h2>
            <h2 className="text-yellow-400 text-xl">
              {hours}h:{min}m
            </h2>
          </div>
          <div className="flex lg:flex-row flex-col gap-2">
            <h2 className="text-slate-300 text-xl">Release Date: </h2>
            <h2 className="text-slate-300 text-xl">{datas.release_date}</h2>
          </div>
          <div className="flex lg:flex-row flex-col gap-2">
            <h2 className="text-slate-300 text-xl">Language: </h2>
            <h2 className="text-slate-300 text-xl">
              {datas.original_language}
            </h2>
          </div>
          <div className="flex lg:flex-row flex-col gap-2">
            <h2 className="text-slate-300 text-xl">Budget: </h2>
            <h2 className="text-slate-300 text-xl">
              {datas.budget === undefined ? " " : datas.budget.toLocaleString()}
            </h2>
            <h2 className="text-slate-300 text-xl">Revenue: </h2>
            <h2 className="text-slate-300 text-xl">
              {datas.revenue === undefined
                ? " "
                : datas.revenue.toLocaleString()}
            </h2>
          </div>
          <div className="flex lg:flex-row flex-col gap-2">
            <h2 className="text-slate-300 text-xl">Achievements: </h2>
            <h2 className="text-slate-300 text-xl">
              {datas.revenue === undefined
                ? " "
                : (datas.revenue - datas.budget).toLocaleString()}
            </h2>
            <h2 className="text-slate-300 text-xl spa\">
              {datas.revenue - datas.budget <= datas.budget &&
              datas.revenue - datas.budget !== 0
                ? " Loss"
                : " Profit"}
            </h2>
          </div>
          <div className="flex lg:flex-row flex-col gap-2">
            <h2 className="text-slate-300 text-xl">Popularity: </h2>
            <h2 className="text-slate-300 text-xl">{datas.popularity}</h2>
          </div>
          <div className="grid col-span-2 grid-flow-col items-center justify-center  duration-1000 hover:scale-105">
            <div className="flex items-center justify-center bg-slate-700 p-3 rounded-xl shadow-lg">
              <ReactPlayer
                pip={true}
                light={false}
                stopOnUnmount={false}
                width={width}
                height={height}
                controls={true}
                url={`https://www.youtube.com/watch?v=${datas.trailer_yt}`}
              />
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-4xl text-slate-300 ">{datas.certification}</h1>
        </div>
      </div>
      <div className="grid grid-cols-2 mt-1 justify-center lg:justify-between items-center lg:flex lg:flex-row gap-20  lg:p-10 p-10 bg-slate-800 rounded-xl shadow-xl ">
        <div>
          <h1 className="text-3xl text-slate-300 ">Cast</h1>
          <div>
            {cast.map((data, index) => {
              return (
                <p className="lg:text-2xl text-xl text-slate-300" key={index}>
                  {data}
                </p>
              );
            })}
          </div>
        </div>
        <div>
          {datas.directors.length <= 1 ? (
            <h1 className="text-3xl text-slate-300 ">Director</h1>
          ) : (
            <h1 className="text-3xl text-slate-300 ">Directors</h1>
          )}

          <div>
            {directors.map((data, index) => {
              return (
                <p className="lg:text-2xl text-xl text-slate-300" key={index}>
                  {data}
                </p>
              );
            })}
          </div>
        </div>
        <div>
          {datas.writers.length <= 1 ? (
            <h1 className="text-3xl text-slate-300 ">Writer</h1>
          ) : (
            <h1 className="text-3xl text-slate-300 ">Writers</h1>
          )}

          <div className="overflow-auto max-h-40 overscroll-contain">
            {writers.map((data, index) => {
              return (
                <p className="lg:text-2xl text-slate-300" key={index}>
                  {data}
                </p>
              );
            })}
          </div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="container mx-auto flex flex-col gap-2 lg:p-10 p-2 bg-slate-800 rounded-3xl mt-1 shadow-xl"
      >
        <h1 className="lg:text-3xl mb-5 text-slate-300 text-center text-xl ">
          Click, see similar Movies
        </h1>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <div className="grid grid-cols-2 justify-center sm:grid-cols-4 gap-4 ">
            {similar.map((data, index) => {
              return (
                <div
                  key={index}
                  className="bg-slate-700  duration-1000 hover:scale-105 flex items-center justify-center py-4 px-10 rounded-lg "
                >
                  <p className="lg:text-2xl text-xl line-clamp-3 text-center font-semibold text-slate-300">
                    {data}
                  </p>
                </div>
              );
            })}
          </div>
        </Collapse>
      </div>
      <Other />
      <ScrollToTopButton />
    </div>
  );
}

export default HugeCard;
