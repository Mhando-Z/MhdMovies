import "./../../App";
import movies from "../MData/MoviesData.json";
import { Link, useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import ReactPlayer from "react-player";
import ScrollToTopButton from "../../Components/pageScroll";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PeopleIcon from "@mui/icons-material/People";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import DownloadIcon from "@mui/icons-material/Download";
import Moviedisplay from "./MovieDisplay";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import SearchResults from "./SearchResults";

function HugeCard() {
  const [open, setOpen] = useState(true);
  const [show, setShow] = useState(false);
  const { data } = movies;
  const { id } = useParams();
  const datas = data.find((mov) => mov.id === parseInt(id));
  const BigDatax = data.map((data) => {
    return data;
  });

  const handleClick = () => {
    setOpen(!open);
  };
  const handleClicks = () => {
    setShow(!show);
  };

  //Genres Logic
  const genres = [];
  if (typeof datas.genres === "object") {
    datas.genres.map((dt) => {
      return genres.push(dt);
    });
  } else {
    console.log(datas.genres);
  }

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

  // Duration Logic
  const hours = Math.trunc(datas.runtime / 60);
  const min = datas.runtime % 60;
  //Profit Loss Logic

  return (
    <div className="container mx-auto shadow-2xl rounded-xl">
      <section>
        {/* Button section */}
        <div className="mb-20 mt-5 flex flex-col lg:flex-row items-center justify-between ">
          <div>
            <Link
              to="/"
              className="text-white hidden lg:flex items-center justify-center lg:text-2xl text-xl bg-gray-700 py-2 px-6"
            >
              <ArrowBackIosIcon fontSize="medium" />
              Back
            </Link>
          </div>
          <SearchResults dataz={BigDatax} />
        </div>
      </section>
      <section>
        <div className="flex lg:flex-row flex-col items-center lg:items-start justify-evenly">
          <div className="flex flex-col gap-2">
            <img
              src={`https://image.tmdb.org/t/p/w500${datas.poster_path}`}
              alt="posterimage"
              className="max-w-screen h-auto rounded-xl shadow-md  duration-1000 lg:hover:scale-105 "
            />
            <div className="flex flex-col items-center justify-center mt-4 gap-3">
              <h1 className="sm:text-4xl text-center sm:mx-0 text-3xl mx-5 text-slate-300 ">
                {datas.title}
              </h1>
              <h2 className="text-slate-300 text-center text-xl max-w-md">
                {datas.tagline}
              </h2>
              <p className="text-xl mx-5 sm:mx-0 max-w-md text-justify text-slate-500">
                {datas.overview}
              </p>
            </div>
            <div className="flex flex-col items-center mb-10 justify-center lg:flex-row lg:gap-2 gap-1">
              <h2 className="text-slate-300 text-xl">Genres:</h2>
              {genres.map((data, index) => {
                return (
                  <h2 className="text-slate-300 text-xl" key={index}>
                    {`${data} `}
                  </h2>
                );
              })}
              <p className="text-slate-300 text-xl">
                {genres.length === 0 ? datas.genres : " "}
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse lg:flex-col gap-10  ">
            <div className="flex mx-5 sm:mx-0 bg-slate-700 p-10 rounded-xl xl:flex-row flex-col gap-y-10 items-start justify-between">
              <div>
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
                {/* Ratings duration */}
                <div className="flex lg:flex-row flex-col gap-2">
                  <h2 className="text-slate-300 text-xl"> Duration:</h2>
                  <h2 className="text-yellow-400 text-xl">
                    {hours}h:{min}m
                  </h2>
                </div>
                <div className="flex lg:flex-row flex-col gap-2">
                  <h2 className="text-slate-300 text-xl">Release Date: </h2>
                  <h2 className="text-slate-300 text-xl">
                    {datas.release_date}
                  </h2>
                </div>
              </div>
              {/* Another div second one */}
              <div>
                <div>
                  <div className="flex lg:flex-row flex-col gap-2">
                    <h2 className="text-slate-300 text-xl">Language: </h2>
                    <h2 className="text-slate-300 text-xl">
                      {datas.original_language}
                    </h2>
                  </div>
                </div>
                <div className="flex lg:flex-row flex-col gap-2">
                  <h2 className="text-slate-300 text-xl">Budget: </h2>
                  <h2 className="text-slate-300 text-xl">
                    {datas.budget === undefined
                      ? " "
                      : datas.budget.toLocaleString()}
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
              </div>
              {/* third div */}
              <div>
                <div className="flex lg:flex-row flex-col gap-2">
                  <h2 className="text-slate-300 text-xl">Popularity: </h2>
                  <h2 className="text-slate-300 text-xl">{datas.popularity}</h2>
                </div>
                <div>
                  <h1 className="text-4xl mt-8 mb-5 text-slate-300 ">
                    {datas.certification}
                  </h1>
                </div>
              </div>
            </div>
            {/* BigGuy two creation */}
            <div className="">
              <div className="flex items-center justify-center">
                <div className="xl:flex hidden items-center justify-center bg-slate-700 p-3 rounded-xl shadow-lg">
                  <ReactPlayer
                    pip={true}
                    light={false}
                    stopOnUnmount={false}
                    width={"900px"}
                    height={"450px"}
                    controls={true}
                    url={`https://www.youtube.com/watch?v=${datas.trailer_yt}`}
                  />
                </div>
              </div>
              <div className="flex items-centerjustify-center">
                <div className="sm:flex  hidden md:hidden lg:hidden items-center justify-center bg-slate-700 p-3 rounded-xl shadow-lg">
                  <ReactPlayer
                    pip={true}
                    light={false}
                    stopOnUnmount={false}
                    width={"400px"}
                    height={"250px"}
                    controls={true}
                    url={`https://www.youtube.com/watch?v=${datas.trailer_yt}`}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="md:flex  hidden xl:hidden items-center justify-center bg-slate-700 p-3 rounded-xl shadow-lg">
                  <ReactPlayer
                    pip={true}
                    light={false}
                    stopOnUnmount={false}
                    width={"700px"}
                    height={"450px"}
                    controls={true}
                    url={`https://www.youtube.com/watch?v=${datas.trailer_yt}`}
                  />
                </div>
              </div>
              <div className=" grid col-span-2 sm:hidden grid-flow-col items-center justify-center">
                <div className=" sm:hidden flex items-center justify-center bg-slate-700 p-3 rounded-xl shadow-lg">
                  <ReactPlayer
                    pip={true}
                    light={false}
                    stopOnUnmount={false}
                    width={"360px"}
                    height={"200px"}
                    controls={true}
                    url={`https://www.youtube.com/watch?v=${datas.trailer_yt}`}
                  />
                </div>
              </div>
              <div className="mt-10 flex items-center justify-center">
                <Link
                  className="py-2 px-10 lg:text-2xl text-xl shadow-xl rounded-lg  text-slate-200 font-semibold bg-slate-700"
                  to={`https://vidsrc.xyz/embed/movie?imdb=${datas.external_ids.imdb_id}`}
                >
                  <SmartDisplayIcon
                    sx={{ fontSize: "2rem", mr: "4px", mb: "5px" }}
                  />
                  Watch
                </Link>
              </div>
            </div>
            {/* Download sites*/}
            <div>
              <div className="flex flex-col gap-2 lg:p-5 p-2 bg-slate-800 rounded-3xl mt-1 shadow-xl">
                <h1
                  onClick={handleClicks}
                  className="lg:text-3xl mb-5  text-slate-300 text-center text-xl "
                >
                  <DownloadIcon
                    className="hover:animate-bounce"
                    sx={{ fontSize: "2.1rem", color: "white" }}
                  />
                  Download Links
                </h1>
                <Collapse in={show} timeout="auto" unmountOnExit>
                  <div className="bg-slate-700 p-5 flex flex-col rounded-xl items-center justify-between">
                    <p className="text-lg md:text-xl text-yellow-500 text-center">
                      Currently download links aren't available due to server
                      problems
                    </p>
                  </div>
                </Collapse>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-2 mt-1 justify-center lg:justify-between  lg:flex lg:flex-row gap-20  lg:p-10 p-10 bg-slate-800 rounded-xl shadow-xl ">
        <div>
          <PeopleIcon
            sx={{
              color: "white",
              fontSize: "2.1rem",
            }}
          />
          <h1 className="text-3xl text-slate-300 ">Cast</h1>
          <div>
            {cast.map((data, index) => {
              return (
                <p className="lg:text-2xl text-lg text-slate-300" key={index}>
                  {data}
                </p>
              );
            })}
          </div>
        </div>
        <div>
          <PhotoCameraIcon
            sx={{
              color: "white",
              fontSize: "2.1rem",
            }}
          />
          {datas.directors.length <= 1 ? (
            <div>
              <h1 className="text-2xl text-slate-300 ">Director</h1>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl text-slate-300 ">Directors</h1>
            </div>
          )}

          <div>
            {directors.map((data, index) => {
              return (
                <p className="lg:text-2xl text-lg text-slate-300" key={index}>
                  {data}
                </p>
              );
            })}
          </div>
        </div>
        <div>
          <ImportContactsIcon
            sx={{
              color: "white",
              fontSize: "2.1rem",
            }}
          />

          {datas.writers.length <= 1 ? (
            <h1 className="text-3xl text-slate-300 ">Writer</h1>
          ) : (
            <h1 className="text-3xl text-slate-300 ">Writers</h1>
          )}

          <div className="overflow-auto max-h-40 overscroll-contain">
            {writers.map((data, index) => {
              return (
                <p className="lg:text-2xl text-lg text-slate-300" key={index}>
                  {data}
                </p>
              );
            })}
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col gap-2 lg:p-5 p-2 bg-slate-800 rounded-3xl mt-1 shadow-xl">
        <h1
          onClick={handleClick}
          className="lg:text-3xl cursor-pointer mb-5 text-slate-300 text-center text-xl "
        >
          Movies you might like
        </h1>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <div className="">
            <Moviedisplay />
          </div>
        </Collapse>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default HugeCard;
