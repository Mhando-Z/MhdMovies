import axios from "axios";
import Rating from "../Components/Rating";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaRegCirclePlay } from "react-icons/fa6";
import { motion } from "framer-motion";
import MoviePoster from "../Components/MoviePoster";

function MovieDetails() {
  const [Details, setDetails] = useState([]);
  const [Reviews, setReview] = useState([]);
  const [Images, setImage] = useState([]);

  const [count, setCount] = useState(14);
  const [Similar, setSimilar] = useState([]);
  const [Page, setPage] = useState(1);
  const { id } = useParams();

  //Page Logic
  const HandlePage = () => {
    setPage(Page + 1);
  };

  //Logics
  async function getDetails() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setDetails(data);
    } catch (error) {}
  }
  async function getReview() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setReview(data.results);
    } catch (error) {}
  }
  async function getSimilar() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=${Page}`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setSimilar(data.results);
    } catch (error) {}
  }
  async function getImages() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/images`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );

      setImage(data.backdrops);
    } catch (error) {}
  }

  useEffect(() => {
    getImages();
    getReview();
    getDetails();
    getSimilar();
  }, [Page, id]);

  // buttons logics
  const handleIncrese = () => {
    if (count !== 20) {
      setCount(count + 6);
    }
  };
  //handle Decrease
  const handleDecrease = () => {
    if (count === 20 && count >= 14) {
      setCount(count - 6);
    }
  };
  //Handle Pages Logic
  const handlePages = () => {
    if (Page >= 1) {
      setPage(Page + 1);
    }
  };
  const handlePage = () => {
    if (Page >= 1) {
      setPage(Page - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-roboto">
      <div className="flex flex-col">
        {/* backdrop poster */}
        <div className="relative">
          <img
            src={`https://image.tmdb.org/t/p/w500/${Details?.backdrop_path}`}
            alt={Details?.title}
            className="object-cover object-top w-screen xl:h-[550px] h-[500px]"
          />
          {/* Trallers section be here*/}
          <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        <div className="flex flex-col gap-3 md:flex-row xl:container xl:mx-auto">
          {/* frontal image */}
          <div className="md:h-[260px] h-[200px] hidden  z-40 justify-center md:flex rounded-lg mt-[-100px] ml-5">
            <img
              src={`https://image.tmdb.org/t/p/w500/${Details?.poster_path}`}
              alt={Details?.title}
              className="object-cover h-full rounded "
            />
          </div>
          {/* title and prompt actions */}
          <div className="flex flex-col flex-grow px-2">
            {/* movie title */}
            <h1 className="max-w-lg mb-2 text-3xl font-bold text-gray-100 md:max-w-2xl md:text-5xl font-action">
              {Details?.title}
            </h1>
            {/* Tagline */}
            <h2 className="mb-2 text-base font-medium text-gray-100 xl:text-lg ">
              TagLine:
              <span className="max-w-2xl ml-1 font-romance text-cyan-400">
                {Details?.tagline}
              </span>
            </h2>
            {/* movie genres */}
            <div className="flex flex-wrap items-center mb-2 md:flex-row gap-x-5">
              <h1 className="text-base font-medium text-gray-100 xl:text-lg">
                Genres:
              </h1>
              {Details?.genres?.map((data, index) => {
                return (
                  <div key={index + data.id} className="">
                    <h1 className="text-base font-semibold text-yellow-500 xl:text-lg">
                      {data.name}
                    </h1>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-row items-center gap-x-3">
              <div>
                <h3 className="text-base text-gray-100 xl:text-lg">
                  {Details?.vote_average}
                </h3>
              </div>
              <Rating value={Details?.vote_average} />
            </div>
            <div className="flex flex-row items-center mt-2 font-mono text-base text-gray-100 xl:text-lg">
              <h1>{Math.trunc(Details?.runtime / 60)}h:</h1>
              <h1>{Details?.runtime % 60}min</h1>
            </div>
            {/* status and releasedate ingo */}
            <div className="flex flex-row items-center gap-x-5">
              <div className="flex flex-row items-center space-x-2">
                <h2 className="text-base lg:text-lg text-slate-200">Status:</h2>
                <h2 className="text-base text-yellow-500 xl:text-lg">
                  {Details?.status}
                </h2>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <h2 className="text-base lg:text-lg text-slate-200">Date:</h2>
                <h2 className="text-base text-yellow-500 xl:text-lg">
                  {Details?.release_date}
                </h2>
              </div>
            </div>
            {/* budget details */}
            <div className="flex flex-row justify-between bg-slate-800 bg-opacity-10 md:justify-normal gap-x-5">
              <h1 className="flex flex-row items-center text-base xl:text-lg text-slate-200">
                Budget: {Details?.budget?.toLocaleString()}
              </h1>
              <h1 className="flex flex-row items-center text-base xl:text-lg text-slate-200">
                Revenue: {Details?.revenue?.toLocaleString()}
              </h1>
            </div>
            {/* movie description */}
            <p className="mt-2 mb-1 text-base font-medium text-cyan-400 xl:text-lg">
              Overview
            </p>
            <p className="max-w-lg text-gray-100 xl:max-w-xl font-romance">
              {Details?.overview}
            </p>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col items-end px-4 mt-2 gap-y-4">
            <button className="flex flex-row items-center px-4 py-2 text-gray-100 bg-red-600 bg-opacity-65 gap-x-2">
              <FaRegCirclePlay />
              Watch
            </button>
            <button className="flex flex-row items-center px-4 py-2 text-gray-100 bg-green-600 bg-opacity-65 gap-x-1">
              <FaRegCirclePlay />
              Trailler
            </button>
          </div>
        </div>
        <div className="container flex flex-col mx-auto mt-4 border-b-2 border-b-gray-700"></div>
        {/* Other movie images */}
        <div className="grid grid-cols-3 gap-1 mt-2 ">
          {Images?.slice(1, 4).map((dt, index) => {
            return (
              <div key={dt.file_path + index}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${dt?.file_path}`}
                  alt={dt?.title}
                  className="object-cover w-screen h-[300px]"
                />
              </div>
            );
          })}
        </div>
        <div className="container flex flex-col mx-auto mt-3 border-b-2 border-b-gray-700"></div>
        {/* Other movies which are similar */}
        <div className="container flex flex-col mx-auto mt-5 md:mt-20">
          <h1 className="mb-2 text-2xl font-bold text-gray-100 md:mb-10 sm:text-3xl md:text-4xl font-roboto">
            Similar Movies
          </h1>
          <div className="grid grid-cols-3 gap-2 gap-y-8 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 ">
            {Similar?.slice(0, count).map((data, index) => {
              return (
                <div key={data.id}>
                  <MoviePoster
                    title={data?.title}
                    image={data?.poster_path}
                    id={data.id}
                    rating={data?.vote_average}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex flex-col items-end justify-end w-full mt-10">
            <div className="flex flex-row items-center space-x-5">
              <motion.button
                whileInView={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", ease: "easeOut" }}
                onClick={handleDecrease}
                className={`text-slate-200 text-base xl:text-lg font-semibold cursor-pointer ${
                  count === 20 ? "flex" : "hidden"
                }`}
              >
                Less..
              </motion.button>
              <motion.button
                whileInView={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", ease: "easeOut" }}
                onClick={handleIncrese}
                className={`text-slate-200 bg-red-600 px-3 text-base xl:text-lg font-semibold cursor-pointer ${
                  count === 20 ? "hidden" : "flex"
                }`}
              >
                More..
              </motion.button>
              <motion.button
                whileInView={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", ease: "easeOut" }}
                onClick={handlePage}
                className="px-3 text-base font-semibold bg-red-600 cursor-pointer xl:text-lg text-slate-200"
              >
                Prev
              </motion.button>
              <motion.button
                whileInView={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", ease: "easeOut" }}
                onClick={handlePages}
                className="px-3 text-base font-semibold bg-red-600 cursor-pointer xl:text-lg text-slate-200"
              >
                Next
              </motion.button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="flex flex-col px-2 xl:container xl:mx-auto">
          {Reviews?.length === 0 ? (
            ""
          ) : (
            <div className="mt-5 h-[400px] overflow-auto bg-slate-900 bg-opacity-50">
              <div className="sticky top-0 flex border-b-2 bg-gray-950 border-slate-700">
                <h1 className="mt-5 mb-5 text-2xl font-semibold text-yellow-500 md:text-3xl ">
                  Reviews
                </h1>
              </div>
              {Reviews?.map((data, index) => {
                return (
                  <div key={index + data.author} className="flex flex-col mt-5">
                    <h1 className="flex flex-row items-center w-full text-xl font-semibold gap-x-3 md:text-2xl text-slate-200">
                      <IoPersonCircleOutline className="text-3xl" />
                      {data.author}
                    </h1>
                    <p className="mb-6 text-base tracking-tighter text-justify xl:text-lg text-slate-200">
                      {data.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
