import movie from "../MData/Mdata.json";
import { Link, useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import ScrollToTopButton from "./pageScroll";
import Other from "./Other";

function Details() {
  const { movies } = movie;
  const { id } = useParams();
  const datas = movies.find((mov) => mov.id === parseInt(id));

  // Duration Logic
  const hours = Math.trunc(datas.runtime / 60);
  const min = datas.runtime % 60;

  return (
    <div id="movies" className="container mx-auto shadow-2xl rounded-xl">
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
            src={datas.posterUrl}
            alt="posterimage"
            className="max-w-screen h-auto rounded-xl shadow-md  duration-1000 hover:scale-105 "
          />
          <div className="flex flex-col items-center justify-center mt-4 gap-3">
            <h1 className="text-4xl text-slate-300 ">{datas.title}</h1>
            <p className="text-xl max-w-md text-justify text-slate-500">
              {datas.plot}
            </p>
          </div>
          <div className="flex items-center justify-center flex-row lg:gap-2 gap-1">
            <h2 className="text-slate-300 text-xl">Genres:</h2>
            {datas.genres.map((data, index) => {
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
              defaultValue={7.6}
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
            <h2 className="text-slate-300 text-xl">{datas.year}</h2>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 mt-1 justify-center lg:justify-between items-center lg:flex lg:flex-row gap-20  lg:p-10 p-10 bg-slate-800 rounded-xl shadow-xl ">
        <div>
          {datas.director.length <= 1 ? (
            <h1 className="text-3xl text-slate-300 ">Director</h1>
          ) : (
            <h1 className="text-3xl text-slate-300 ">Directors</h1>
          )}

          <div>
            <p className="lg:text-2xl text-xl text-slate-300">
              {datas.director}
            </p>
          </div>
        </div>
      </div>
      <Other />
      <ScrollToTopButton />
    </div>
  );
}

export default Details;
