import axios from "axios";
import Rating from "../Components/Rating";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaRegCirclePlay } from "react-icons/fa6";
import MoviePoster from "../Components/MoviePoster";
import ReactPlayer from "react-player";
import { Dots } from "react-activity";
import CastProfile from "../Components/Cast";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Globe,
  Film,
  Heart,
  Award,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  MinusCircle,
  PlusCircle,
  Sparkles,
  Star,
  ThumbsUp,
} from "lucide-react";
import PosterExpands from "../Components/PosterExpands";
import CastPoster from "../Components/CastPoster";

function MovieDetails() {
  const [Details, setDetails] = useState([]);
  const [Reviews, setReview] = useState([]);
  const [Images, setImage] = useState([]);
  const [Videos, setVideo] = useState([]);
  const [Selected, setSelect] = useState();
  // cast
  const [Cast, setCast] = useState([]);
  const [CastId, setCastId] = useState("");
  const [CastDetails, setCastDetails] = useState([]);
  const [CastMovies, setCastMovies] = useState([]);
  const [CastTvSeries, setCastTvSeries] = useState([]);
  const [CastImages, setCastImage] = useState([]);
  const [ShowCastDetails, setShowCastDetails] = useState(false);
  //
  const [Similar, setSimilar] = useState([]);
  const [count, setCount] = useState(14);
  const [Trailer, setTrailer] = useState(false);
  const [Watch, setWatch] = useState(false);
  const [Page, setPage] = useState(1);
  const { id } = useParams();
  // torrents
  const [mediaInfo, setMediaInfo] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

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
  async function getVideo() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
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
  async function getCasts() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
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

  // torrent Logics
  const fetchMediaInfo = async () => {
    try {
      if (Details?.imdb_id) {
        const movie = await fetchMovieData();
        setMediaInfo(movie);
      }
    } catch (error) {}
  };

  const fetchMovieData = async () => {
    try {
      const movieResponse = await axios.get(
        "https://yts.mx/api/v2/list_movies.json",
        {
          params: { query_term: Details?.imdb_id },
        }
      );
      return movieResponse.data.data.movies?.[0] || null;
    } catch {}
  };

  // cast Logic
  async function getCastsDetails() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/person/${CastId}?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setCastDetails(data);
    } catch (error) {}
  }

  async function getCastsMovies() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/person/${CastId}/movie_credits?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setCastMovies(data);
    } catch (error) {}
  }

  async function getCastsTvSeries() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/person/${CastId}/tv_credits?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setCastTvSeries(data);
    } catch (error) {}
  }

  async function getCastsImages() {
    try {
      const { data } = await axios.get(
        ` https://api.themoviedb.org/3/person/${CastId}/images`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setCastImage(data);
    } catch (error) {}
  }

  useEffect(() => {
    if (CastId) {
      getCastsImages();
      getCastsMovies();
      getCastsTvSeries();
      getCastsDetails();
    }
  }, [CastId]);

  useEffect(() => {
    fetchMediaInfo();
    getCasts();
    getVideo();
    getImages();
    getReview();
    getDetails();
    getSimilar();
  }, [Page, id, Details?.imdb_id]);

  const handleTrailer = () => {
    setWatch(false);
    setTrailer(!Trailer);
  };
  const handleWatch = () => {
    setTrailer(false);
    setWatch(!Watch);
  };

  const handleSelect = (key) => {
    setSelect(key);
  };

  const handleIncrese = () => {
    if (count !== 20) {
      setCount(count + 6);
    }
  };

  const handleDecrease = () => {
    if (count === 20 && count >= 14) {
      setCount(count - 6);
    }
  };

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
      <div className="flex items-center justify-center min-h-screen">
        <Dots color="white" size={32} speed={1} animating={true} />
      </div>
    );
  }

  const handleCast = (id) => {
    setCastId(id);
    setShowCastDetails(true);
  };

  const Similars = Similar?.filter((dt) => dt.poster_path !== null);
  const Casts = Cast?.filter((dt) => dt.profile_path !== null);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.2, duration: 0.5 },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  };

  const iconStyle = "w-5 h-5 text-blue-400";

  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section with Backdrop */}
      <div className="relative">
        <div className="relative h-[80vh] w-full">
          <img
            src={`https://image.tmdb.org/t/p/original/${Details?.backdrop_path}`}
            alt={Details?.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-20% to-transparent" />
        </div>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container hidden gap-8 mx-auto md:flex">
            <div className="hidden w-64 translate-y-16 md:block">
              <img
                src={`https://image.tmdb.org/t/p/w500/${Details?.poster_path}`}
                alt={Details?.title}
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="flex-1">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white md:text-6xl">
                  {Details?.title}
                </h1>
                <p className="text-xl font-light font-Raleway text-cyan-400">
                  {Details?.tagline}
                </p>
                <div className="flex flex-wrap gap-2">
                  {Details?.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 text-sm text-gray-200 rounded-full bg-gray-800/80"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Rating value={Details?.vote_average} />
                    <span className="text-gray-300">
                      {Details?.vote_average?.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">
                    {Math.floor(Details?.runtime / 60)}h {Details?.runtime % 60}
                    m
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">{Details?.release_date}</span>
                </div>
                <p className="max-w-3xl text-lg text-gray-300">
                  {Details?.overview}
                </p>
                <div className="flex gap-4 pt-4">
                  <Link
                    onClick={handleWatch}
                    // to={`https://vidsrc.xyz/embed/movie?imdb=${Details.imdb_id}`}
                    className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    <FaRegCirclePlay className="text-xl" />
                    Watch Now
                  </Link>
                  <button
                    onClick={handleTrailer}
                    className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    <FaRegCirclePlay className="text-xl" />
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* movie mobile overlay view */}
      <div className="container flex gap-8 px-5 mx-auto md:hidden">
        <div className="flex-1">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white md:text-6xl">
              {Details?.title}
            </h1>
            <p className="text-xl font-light font-Raleway text-cyan-400">
              {Details?.tagline}
            </p>
            <div className="flex flex-wrap gap-2">
              {Details?.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 text-sm text-gray-200 rounded-full bg-gray-800/80"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Rating value={Details?.vote_average} />
                <span className="text-gray-300">
                  {Details?.vote_average?.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-400">••••••</span>
              <span className="text-gray-300">
                {Math.floor(Details?.runtime / 60)}h {Details?.runtime % 60}m
              </span>
              <span className="text-sm text-gray-300">
                {Details?.release_date}
              </span>
            </div>
            <p className="max-w-3xl text-lg text-gray-300">
              {Details?.overview}
            </p>
            <div className="flex flex-row items-center justify-between pt-4">
              <Link
                onClick={handleWatch}
                // to={`https://vidsrc.xyz/embed/movie?imdb=${Details.imdb_id}`}
                className="flex items-center gap-2 px-4 py-1.5 font-medium text-white transition-colors bg-red-600 rounded-lg"
              >
                <FaRegCirclePlay className="text-xl" />
                Watch Now
              </Link>
              <Link
                onClick={handleTrailer}
                className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors bg-gray-800 rounded-lg"
              >
                <FaRegCirclePlay className="text-xl" />
                Watch Trailer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      {Trailer && (
        <div className="container px-4 py-16 mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <ReactPlayer
                width="100%"
                height="500px"
                controls={true}
                url={`https://www.youtube.com/watch?v=${Selected}`}
                className="overflow-hidden rounded-lg"
              />
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {Videos?.map((video, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(video.key)}
                  className="w-full p-4 text-left transition-colors bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-500">{video.type}</span>
                      <span className="text-gray-400">{video.site}</span>
                    </div>
                    <p className="text-sm text-blue-400">
                      {video.published_at}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Watch Section */}
      {Watch && (
        <div className="container py-16 mx-auto">
          <div className="movie-player">
            {/* Iframe with improved styling */}
            <iframe
              src={`https://vidsrc.xyz/embed/movie?imdb=${Details.imdb_id}`}
              width="100%"
              height="500px"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="z-0 w-full transition-all duration-300 ease-in-out transform rounded-lg "
              title="Movie Player"
            />
          </div>

          {/* Optional: Movie Information Overlay */}
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-gray-700">
              {Details.title || "Movie Player"}
            </h2>
            <p className="text-sm text-gray-600">IMDB ID: {Details.imdb_id}</p>
          </div>
        </div>
      )}

      {/* table stats */}
      <div className="container flex flex-col gap-5 px-5 mx-auto mt-16 md:flex-row md:px-0">
        {/* table one */}
        <table className="w-full text-xs bg-gray-800 rounded-lg md:text-sm bg-opacity-20 md:w-1/2">
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 text-slate-200">Status:</td>
              <td className="px-4 py-2 text-yellow-500">{Details?.status}</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 text-slate-200">Release Date:</td>
              <td className="px-4 py-2 text-yellow-500">
                {Details?.release_date}
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 text-slate-200">Budget:</td>
              <td className="px-4 py-2 text-slate-200">
                $ {(Details?.budget).toLocaleString()}
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 text-slate-200">Revenue </td>
              <td className="px-4 py-2 text-slate-200">
                $ {Details?.revenue.toLocaleString()}
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 text-slate-200">Companises </td>
              <td className="px-4 py-2 text-slate-200">
                <div className="flex flex-wrap gap-y-2 gap-x-3">
                  {Details?.production_companies?.map((comp) => {
                    return (
                      <div
                        className="px-2 bg-gray-700 rounded-xl"
                        key={comp?.id}
                      >
                        <p>{comp?.name}</p>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* table two Download torrents thingly */}
        <table className="w-full bg-gray-800 rounded-lg bg-opacity-20 md:w-1/2">
          <tbody>
            {mediaInfo?.torrents?.map((info, index) => {
              return (
                <tr key={index} className="border-b border-gray-700">
                  <td className="px-4 py-2 text-xs md:text-sm text-slate-200">
                    {info?.type}
                  </td>
                  <td className="px-4 py-2 text-xs md:text-sm text-slate-200">
                    <p className="text-white">
                      {info?.quality} - {info?.size}
                    </p>
                  </td>
                  <td className="px-4 py-2 text-xs text-yellow-500 md:text-sm ">
                    <a
                      href={`magnet:?xt=urn:btih:${
                        info?.hash
                      }&dn=${encodeURIComponent(
                        mediaInfo.title
                      )}&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=udp://tracker.leechers-paradise.org:6969/announce`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 mt-2 text-yellow-500 hover:text-yellow-400"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cast Section */}
      <div className="container px-4 py-16 mx-auto">
        <h2 className="relative py-2 mb-8 overflow-hidden text-2xl font-bold text-white font-scifi group">
          <span className="relative z-10 inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-cyan-400 after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100">
            Cast
          </span>
          <div className="absolute inset-0 transform -skew-x-12 bg-gradient-to-r from-cyan-900/10 to-transparent"></div>
          <div className="absolute w-1 -translate-y-1/2 opacity-75 -left-2 top-1/2 h-1/2 bg-cyan-400"></div>
        </h2>
        <div className="flex gap-6 pb-6 overflow-x-auto">
          {Casts?.map((person, index) => (
            <div
              onClick={() => handleCast(person.id)}
              key={person.file_path + index}
              className="flex-shrink-0 w-48"
            >
              <CastProfile
                image={person?.profile_path}
                name={person?.name}
                role={person?.character}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Cast Details */}
      {ShowCastDetails && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container p-6 mx-auto shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl"
        >
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left side - Poster Image */}
            <motion.div variants={imageVariants} className="w-full lg:w-1/3">
              <div className="relative overflow-hidden rounded-xl group">
                <motion.img
                  src={`https://image.tmdb.org/t/p/w500${CastDetails?.profile_path}`}
                  alt={CastDetails?.name}
                  className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                />
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100" />
              </div>
            </motion.div>

            {/* Right side - Cast Details */}
            <div className="w-full lg:w-2/3">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text"
              >
                {CastDetails?.name}
              </motion.h1>

              <div className="space-y-4">
                {[
                  {
                    icon: <Award className={iconStyle} />,
                    label: "Known For",
                    value: CastDetails?.known_for_department,
                  },
                  {
                    icon: <Users className={iconStyle} />,
                    label: "Also Known As",
                    value: CastDetails?.also_known_as?.join(", "),
                  },
                  {
                    icon: <Calendar className={iconStyle} />,
                    label: "Birthday",
                    value: CastDetails?.birthday,
                  },
                  {
                    icon: <MapPin className={iconStyle} />,
                    label: "Place of Birth",
                    value: CastDetails?.place_of_birth,
                  },
                  {
                    icon: <User className={iconStyle} />,
                    label: "Gender",
                    value: CastDetails?.gender === 2 ? "Male" : "Female",
                  },
                  {
                    icon: <TrendingUp className={iconStyle} />,
                    label: "Popularity",
                    value: CastDetails?.popularity,
                  },
                  {
                    icon: <Globe className={iconStyle} />,
                    label: "Homepage",
                    value: (
                      <a
                        href={CastDetails?.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 transition-colors duration-200 hover:text-blue-300"
                      >
                        {CastDetails?.homepage}
                      </a>
                    ),
                  },
                  {
                    icon: <Film className={iconStyle} />,
                    label: "IMDB",
                    value: (
                      <a
                        href={`https://www.imdb.com/name/${CastDetails?.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 transition-colors duration-200 hover:text-blue-300"
                      >
                        {CastDetails?.imdb_id}
                      </a>
                    ),
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    variants={tableRowVariants}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    className="p-4 transition-colors duration-200 border-b rounded-lg border-gray-700/50 hover:bg-gray-800/30"
                  >
                    <div className="flex items-center gap-4">
                      {item.icon}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-400">
                          {item.label}
                        </h3>
                        <div className="mt-1 text-white">{item.value}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  variants={tableRowVariants}
                  custom={8}
                  initial="hidden"
                  animate="visible"
                  className="p-4 transition-colors duration-200 border-b rounded-lg border-gray-700/50 hover:bg-gray-800/30"
                >
                  <div className="flex items-center gap-4">
                    <Heart className={iconStyle} />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-400">
                        Biography
                      </h3>
                      <div className="mt-1 leading-relaxed text-white">
                        {CastDetails?.biography}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Cast movies  */}
          <div className="mt-2">
            <h1 className="text-2xl text-gray-200 font-Raleway">
              {CastMovies?.cast?.length} Movies
            </h1>
          </div>
          <div className="grid grid-flow-col gap-4 py-4 overflow-x-auto">
            {CastMovies?.cast?.map((cmov, index) => {
              return (
                <PosterExpands
                  key={cmov.id + index}
                  movie={cmov}
                  isHovered={hoveredId === cmov.id}
                  onHover={() => setHoveredId(cmov.id)}
                  onLeave={() => setHoveredId(null)}
                />
              );
            })}
          </div>

          {/* Cast TvSeries  */}
          <div className="mt-2">
            <h1 className="text-2xl text-gray-200 font-Raleway">
              {CastTvSeries?.cast?.length} TvSeries
            </h1>
          </div>
          <div className="grid grid-flow-col gap-4 py-4 overflow-x-auto">
            {CastTvSeries?.cast?.map((cmov, index) => {
              return (
                <PosterExpands
                  key={cmov.id + index}
                  movie={cmov}
                  isHovered={hoveredId === cmov.id}
                  onHover={() => setHoveredId(cmov.id)}
                  onLeave={() => setHoveredId(null)}
                />
              );
            })}
          </div>

          {/* Cast Images */}
          <div className="mt-2">
            <h1 className="text-2xl text-gray-200 font-Raleway">
              {CastImages?.profiles?.length} Images
            </h1>
          </div>
          <div className="grid grid-flow-col gap-4 py-4 overflow-x-auto">
            {CastImages?.profiles?.map((cimg, index) => {
              return <CastPoster key={cimg.width + index} actor={cimg} />;
            })}
          </div>
        </motion.div>
      )}

      {/* Movie Stills */}
      <section className="container px-4 py-12 mx-auto">
        <h2 className="mb-6 text-2xl font-bold text-white">Movie Stills</h2>
        <div className="grid grid-flow-col gap-4 pb-4 overflow-x-auto">
          {Images?.map((image, index) => (
            <div key={index} className="w-[400px]">
              <img
                src={`https://image.tmdb.org/t/p/w780/${image?.file_path}`}
                alt={`Movie still ${index + 1}`}
                className="rounded-lg shadow-lg"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Similar Movies */}
      {Similar.length > 0 && (
        <section className="container px-4 py-12 mx-auto">
          <div className="relative py-4 mb-6">
            {/* Animated background effect */}
            <div className="absolute inset-0 transition-transform duration-300 transform rounded-lg bg-gradient-to-r from-red-950/30 via-red-900/20 to-transparent hover:scale-105" />

            <div className="relative">
              {/* Main content container */}
              <div className="flex items-center gap-5 ">
                {/* Icon with animation wrapper */}
                <div className="relative hidden sm:block">
                  <ThumbsUp className="w-6 h-6 text-red-500" />
                  <Sparkles className="absolute w-4 h-4 text-yellow-400 -top-2 -right-2 animate-pulse" />
                </div>

                {/* Heading text */}
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold">
                    <span className="relative">
                      {/* Gradient text effect */}
                      <span className="text-transparent bg-gradient-to-r from-white via-gray-100 to-red-100 bg-clip-text">
                        You Might Also Like
                      </span>

                      {/* Animated underline */}
                      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 via-red-400 to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </span>
                  </h2>

                  {/* Optional subtitle */}
                  <p className="mt-1 text-sm text-gray-400">
                    Personalized picks for you
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="items-center flex-grow hidden gap-3 md:flex">
                  <div className="flex-grow h-[1px] bg-gradient-to-r from-red-500/40 to-transparent" />

                  {/* Animated recommendation indicators */}
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center w-6 h-6"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-red-500/60 animate-ping"
                          style={{
                            animationDuration: "1.5s",
                            animationDelay: `${i * 200}ms`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom decoration */}
              <div className="absolute bottom-0 left-0 right-0">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute hidden transform -translate-y-1/2 top-1/2 right-4 lg:block">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    top: `${i * -10}px`,
                    right: `${i * 10}px`,
                    transform: `rotate(${i * 15}deg)`,
                  }}
                >
                  <Sparkles
                    className="w-3 h-3 text-red-400/40 animate-pulse"
                    style={{ animationDelay: `${i * 300}ms` }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Similars?.slice(0, count).map((movie, index) => (
              <MoviePoster
                key={movie.id + index}
                title={movie?.title}
                image={movie?.poster_path}
                image2={movie?.backdrop_path}
                id={movie.id}
                rating={movie?.vote_average}
              />
            ))}
          </div>
          <div className="w-full mt-10">
            <div className="flex items-center justify-end gap-3">
              {/* Less/More Button */}
              {count === 20 ? (
                <button
                  onClick={handleDecrease}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-slate-700 text-slate-200"
                >
                  <MinusCircle className="w-4 h-4" />
                  <span>Show Less</span>
                </button>
              ) : (
                <button
                  onClick={handleIncrese}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Show More</span>
                </button>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePages}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handlePage}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reviews section */}
      {Reviews?.length > 0 && (
        <section className="container py-12 mx-auto">
          <div className="relative py-5 mb-6 group">
            {/* Animated background glow */}
            <div className="absolute inset-0 transition-opacity duration-300 rounded-lg opacity-75 bg-gradient-to-r from-red-950/30 via-red-900/20 to-transparent group-hover:opacity-100" />

            <div className="relative">
              {/* Main content container */}
              <div className="flex items-center gap-5 ">
                {/* Icon cluster */}
                <div className="relative hidden sm:block">
                  <MessageSquare className="text-red-500 w-7 h-7" />
                  <Users className="absolute w-4 h-4 text-red-400 -top-2 -right-2" />
                  <div className="absolute -bottom-1 -right-1">
                    {/* Animated star rating */}
                    <div className="flex gap-px">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-2 h-2 text-yellow-400 fill-yellow-400 animate-pulse"
                          style={{ animationDelay: `${i * 200}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Heading content */}
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold tracking-tight">
                    <span className="relative inline-block">
                      {/* Gradient text */}
                      <span className="text-transparent bg-gradient-to-r from-white via-gray-100 to-red-100 bg-clip-text">
                        Reviews
                      </span>

                      {/* Animated underline */}
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-red-400 to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </span>
                  </h2>

                  {/* Subtitle with stats */}
                  <p className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                    <span>User Feedback & Ratings</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400">4.8</span>
                    </span>
                  </p>
                </div>

                {/* Decorative right section */}
                <div className="items-center flex-grow hidden gap-3 md:flex">
                  {/* Gradient line */}
                  <div className="flex-grow h-[1px] bg-gradient-to-r from-red-500/40 to-transparent" />

                  {/* Review count indicators */}
                  <div className="flex items-end h-6 gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-red-500/60 animate-pulse"
                        style={{
                          height: `${(i + 1) * 6}px`,
                          animationDelay: `${i * 200}ms`,
                          animationDuration: "1.5s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
              </div>
            </div>

            {/* Floating review bubbles */}
            <div className="absolute top-0 right-0 hidden lg:block">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-red-400/30 animate-ping"
                  style={{
                    top: `${i * 10}px`,
                    right: `${i * 15}px`,
                    animationDelay: `${i * 300}ms`,
                    animationDuration: "2s",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
            {Reviews?.map((review, index) => (
              <div key={index} className="p-6 rounded-lg bg-gray-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <IoPersonCircleOutline className="text-3xl text-gray-400" />
                  <h3 className="text-xl font-semibold text-white">
                    {review.author}
                  </h3>
                </div>
                <p className="leading-relaxed text-gray-300 font-Raleway">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MovieDetails;
