import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Link, NavLink, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import TvSeriesPoster from "./../Components/TvSeriesPoster";
import { FaRegCirclePlay } from "react-icons/fa6";
import ReactPlayer from "react-player";
import Rating from "../Components/Rating";
import { Dots } from "react-activity";

function TvSeriesDetails() {
  const [Details, setDetails] = useState([]);
  const [Reviews, setReview] = useState([]);
  const [Similar, setSimilar] = useState([]);
  const [Page, setPage] = useState(1);
  const [ID, setIds] = useState([]);
  const { id } = useParams();
  const [Cast, setCast] = useState();
  const [Images, setImage] = useState([]);
  const [Videos, setVideo] = useState([]);
  const [Selected, setSelect] = useState();
  const [count, setCount] = useState(14);
  const [Trailer, setTrailer] = useState(false);

  //Logics
  async function getDetails() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
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
  async function getIds() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/external_ids`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setIds(data);
    } catch (error) {}
  }
  async function getReview() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/reviews?language=en-US`,
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
        `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=${Page}`,
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
  async function getVideo() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setVideo(data.results);
      setSelect(data.results[0].key);
    } catch (error) {}
  }
  async function getImages() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/images`,
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
  async function getCasts() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setCast(data.cast);
    } catch (error) {}
  }
  useEffect(() => {
    getCasts();
    getVideo();
    getImages();
    getIds();
    getReview();
    getDetails();
    getSimilar();
  }, [Page, id]);

  // buttons logics
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleTrailer = () => {
    scrollToTop();
    setTrailer(!Trailer);
  };
  const handleSelect = (key) => {
    setSelect(key);
  };

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

  if (!Details || Details?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div>
          <Dots color="gray" size={25} speed={1} animating={true} />
        </div>
      </div>
    );
  }

  // trim the unwanted
  const Similars = Similar?.filter((dt) => dt.poster_path !== null);
  const Seasons = Details?.seasons?.filter((dt) => dt.poster_path !== null);
  const Casts = Cast?.filter((dt) => dt.profile_path !== null);

  return (
    <div className="flex flex-col min-h-screen font-roboto">
      <div className="flex flex-col">
        {/* backdrop poster */}
        <div className="relative flex flex-col">
          <Link to={"/"}>
            <img
              src={`https://image.tmdb.org/t/p/w1280/${Details?.backdrop_path}`}
              alt={Details?.title}
              className="object-cover object-top w-screen xl:h-[550px] h-[500px]"
            />
          </Link>
          <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col bg-gradient-to-t from-black via-transparent to-transparent"></div>
          {/* Trallers section be here*/}
          {Trailer ? (
            <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col min-h-screen">
              <div className="flex-1 w-auto h-auto">
                <div className="hidden shadow-lg lg:flex">
                  <ReactPlayer
                    width={"100%"}
                    height={"580px"}
                    controls={true}
                    url={`https://www.youtube.com/watch?v=${Selected}`}
                  />
                </div>
                <div className="flex flex-col shadow-lg lg:hidden">
                  <ReactPlayer
                    width={"100%"}
                    height={"400px"}
                    controls={true}
                    url={`https://www.youtube.com/watch?v=${Selected}`}
                  />
                  <div className="flex flex-col mt-10 ">
                    {/* Play movie button */}
                    {Trailer ? (
                      <div className="flex flex-col px-3 md:hidden">
                        <Link
                          to={`https://vidsrc.xyz/embed/tv?imdb=${ID.imdb_id}`}
                          className="flex flex-row items-center px-2 py-2 bg-red-600"
                        >
                          <FaRegCirclePlay className="text-3xl text-gray-100 transition-all duration-700 animate-pulse" />{" "}
                          <p className="ml-2 text-lg text-gray-100">
                            WatchSeries
                          </p>
                        </Link>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="absolute bottom-[-100px] md:flex hidden left-0 right-0  flex-col top-80 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        <div className="flex flex-col-reverse gap-3 md:flex-row xl:container xl:mx-auto">
          {/* frontal image */}
          <div className="md:h-[260px] h-[200px] hidden  z-40 justify-center md:flex rounded-lg mt-[-100px] ml-5">
            <img
              src={`https://image.tmdb.org/t/p/w500/${Details?.poster_path}`}
              alt={Details?.name}
              className="object-cover h-full rounded "
            />
          </div>
          {/* title and prompt actions */}
          <div className="relative z-40 flex flex-col flex-grow px-2">
            {/* movie title */}
            <h1 className="max-w-lg mb-2 text-3xl font-bold text-gray-100 md:max-w-2xl md:text-5xl">
              {Details?.name}{" "}
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
                  {Details?.first_air_date}
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
            <p className="max-w-lg text-gray-100 xl:max-w-xl">
              {Details?.overview}
            </p>
            {/* Details on number of episodes and seasons */}
            <div className="mt-5">
              <div className="flex flex-row space-x-2">
                <h2 className="text-base xl:text-lg text-slate-200">
                  Number of Episodes:
                </h2>
                <h2 className="text-base xl:text-lg text-slate-200">
                  {Details?.number_of_episodes}
                </h2>
              </div>
              <div className="flex flex-row space-x-2 ">
                <h2 className="text-base xl:text-lg text-slate-200">
                  Number Of Seasons:
                </h2>
                <h2 className="text-base xl:text-lg text-slate-200">
                  {Details?.number_of_seasons}
                </h2>
              </div>
              {Details.next_episode_to_air !== null ? (
                <div className="flex flex-row space-x-2 ">
                  <h2 className="text-sm md:text-base xl:text-lg text-slate-200">
                    Next Episode Release:
                  </h2>
                  <h2 className="text-sm md:text-base xl:text-lg text-slate-200">
                    {Details?.next_episode_to_air.air_date}
                  </h2>
                </div>
              ) : (
                ""
              )}
            </div>
            {/* Play movie button */}
            {Trailer ? (
              <div className="absolute right-0 flex-col hidden size-20 md:flex ">
                <Link to={`https://vidsrc.xyz/embed/tvf?imdb=${ID.imdb_id}`}>
                  <FaRegCirclePlay className="text-5xl text-gray-100 transition-all duration-700 animate-pulse" />
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>
          {/* Action Buttons and video link selection */}
          {Trailer ? (
            <div className="h-[400px] overflow-y-auto z-40 bg-black">
              {Videos?.map((data, index) => {
                return (
                  <NavLink
                    key={data.key + index}
                    onClick={() => handleSelect(data.key)}
                  >
                    <div
                      className={`flex flex-col p-3 mb-5 focus:ring-2 focus:bg-white overflow-y-auto rounded-lg bg-slate-950 shadow-xl`}
                    >
                      <div className="flex flex-row items-center gap-x-5">
                        <h1 className="text-lg text-slate-200">Video-Type</h1>
                        <h1 className="text-lg text-yellow-500">{data.type}</h1>
                      </div>
                      <div className="flex flex-row items-center gap-x-5">
                        <h1 className="text-lg text-slate-200">Site</h1>
                        <h2 className="text-lg text-yellow-500">{data.site}</h2>
                      </div>
                      <div className="flex flex-row items-center gap-x-5">
                        <h1 className="text-sm text-slate-200">Date</h1>
                        <h1 className="text-sm text-blue-400">
                          {data.published_at}
                        </h1>
                      </div>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          ) : (
            <div className="z-40 flex flex-col items-end px-4 mt-2 gap-y-4">
              {/* selections */}
              <Link
                to={`https://vidsrc.xyz/embed/tv?imdb=${ID.imdb_id}`}
                className="flex flex-row items-center px-4 py-2 text-gray-100 bg-red-600 bg-opacity-65 gap-x-2"
              >
                <FaRegCirclePlay />
                Watch
              </Link>
              <button
                onClick={handleTrailer}
                className="flex flex-row items-center px-4 py-2 text-gray-100 bg-green-600 bg-opacity-65 gap-x-1"
              >
                <FaRegCirclePlay />
                Trailler
              </button>
            </div>
          )}
        </div>
        <div className="container flex flex-col mx-auto mt-4 border-b-2 border-b-gray-700"></div>
        {/* Seasons list */}
        {/* Number of seasons print */}
        <div
          className={`grid xl:grid-cols-7 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2  ${
            Details?.seasons?.length <= 1 ? "justify-start" : "justify-center"
          } md:justify-start gap-5 lg:px-10  mt-4 h-[320px] overflow-auto `}
        >
          {Seasons?.map((data, index) => {
            return (
              <div key={data.id + index} className="">
                <img
                  src={`https://image.tmdb.org/t/p/w780/${data?.poster_path}`}
                  alt={Details?.title}
                  className="object- object-top w-screen h-[300px]"
                />
                {/* Season and number of episodes */}
                <div className="flex flex-row items-center justify-between w-full mt-1 ">
                  <h1 className="text-xs md:text-sm text-slate-200 ">
                    {data.name}
                  </h1>
                  <h1 className="text-xs md:text-sm text-slate-200 ">
                    Ep: {data.episode_count}
                  </h1>
                </div>
              </div>
            );
          })}
        </div>
        {/* Related TvSeries images */}
        <div className="grid grid-flow-col mt-2 overflow-x-auto overflow-y-hidden">
          {Images?.map((dt, index) => {
            return (
              <div key={dt.file_path + index} className="w-[500px]">
                <img
                  src={`https://image.tmdb.org/t/p/w780/${dt?.file_path}`}
                  alt={dt?.title}
                  className="object-cover w-screen h-[400px]"
                />
              </div>
            );
          })}
        </div>
        <div className="container flex flex-col mx-auto mt-3 border-b-2 border-b-gray-700"></div>
        {/* Casts of movie */}
        <h1 className="px-2 mt-2 mb-4 text-xl font-semibold text-gray-100 border-l-4 border-l-red-700 font-fantasy">
          Cast
        </h1>
        <div className="grid grid-flow-col overflow-x-auto overflow-y-hidden">
          {Casts?.map((dt, index) => {
            return (
              <div key={dt.file_path + index} className="w-[220px]">
                <img
                  src={`https://image.tmdb.org/t/p/w780/${dt?.profile_path}`}
                  alt={dt?.name}
                  className=" w-screen h-[300px]"
                />
                <h2 className="px-1 text-xs text-gray-100 md:text-sm">
                  {dt?.name}
                </h2>
                <h2 className="px-1 text-xs text-gray-100 md:text-sm">
                  {dt?.character}
                </h2>
              </div>
            );
          })}
        </div>
        {/* Other movies which are similar */}
        <div className="container flex flex-col mx-auto mt-5 md:mt-20">
          {Similars.length !== 0 ? (
            <h1 className="mb-2 text-xl font-medium text-gray-100 md:mb-10 md:text-2xl font-roboto">
              Series you might like
            </h1>
          ) : (
            ""
          )}
          <div className="grid grid-cols-3 gap-2 gap-y-8 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 ">
            {Similars?.slice(0, count).map((data, index) => {
              return (
                <div key={data.id}>
                  <TvSeriesPoster
                    name={data?.name}
                    image={data?.poster_path}
                    id={data.id}
                    rating={data?.vote_average}
                  />
                </div>
              );
            })}
          </div>
          {Similar?.length !== 0 ? (
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
          ) : (
            ""
          )}
        </div>

        {/* Reviews */}
        <div className="flex flex-col px-2 md:container md:mx-auto">
          {Reviews?.length === 0 ? (
            ""
          ) : (
            <div className="mt-5 h-[400px] overflow-auto bg-slate-900 bg-opacity-50">
              <div className="sticky top-0 flex border-b-2 bg-gray-950 border-slate-700">
                <h1 className="mt-5 mb-5 text-xl font-semibold text-yellow-500 md:text-2xl ">
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
                    <p className="mb-6 text-xs tracking-tighter text-justify md:text-sm text-slate-200">
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

export default TvSeriesDetails;
