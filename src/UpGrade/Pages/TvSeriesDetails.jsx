import axios from "axios";
import Rating from "../Components/Rating";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
import TvSeriesPoster from "./../Components/TvSeriesPoster";
import ReactPlayer from "react-player";
// import { Slider } from "../Components/slider";
import CastProfile from "../Components/Cast";
import { AnimatePresence, motion } from "framer-motion";
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
  Play,
  ChevronDown,
} from "lucide-react";
import TvPosterExpands from "../Components/TvPosterExpands";
import PosterExpands from "../Components/PosterExpands";
import { RxCrossCircled } from "react-icons/rx";
import CastPoster from "../Components/CastPoster";
import TvSeriesContex from "../../Context/TvSeriesContext";
import { CheckCircle, Clock } from "lucide-react";
import { LuLoader } from "react-icons/lu";

export function EpisodeStatus({ episode }) {
  // Determine if the episode is released
  const isReleased = new Date() >= new Date(episode.airdate);

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isReleased ? (
        <>
          <CheckCircle className="text-green-500" />
          <span className="font-semibold text-gray-700 ">Released</span>
        </>
      ) : (
        <>
          <Clock className="text-yellow-500 " />
          <span className="font-semibold text-gray-700 ">Pending</span>
        </>
      )}
    </motion.div>
  );
}

// function
const getYouTubeThumbnail = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

function MovieDetails() {
  const [Details, setDetails] = useState([]);
  const [Reviews, setReview] = useState([]);
  const [Similar, setSimilar] = useState([]);
  const [Page, setPage] = useState(1);
  const [ID, setIds] = useState([]);
  const { id } = useParams();
  // cast
  const [Cast, setCast] = useState();
  const [CastId, setCastId] = useState("");
  const [CastDetails, setCastDetails] = useState([]);
  const [CastMovies, setCastMovies] = useState([]);
  const [CastTvSeries, setCastTvSeries] = useState([]);
  const [CastImages, setCastImage] = useState([]);
  const [ShowCastDetails, setShowCastDetails] = useState(false);
  //
  const [Images, setImage] = useState([]);
  const [Videos, setVideo] = useState([]);
  const [Selected, setSelect] = useState();
  const [count, setCount] = useState(14);
  const [Trailer, setTrailer] = useState(false);
  const [Watch, setWatch] = useState(false);
  const [Watch2, setWatch2] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [show, setShow] = useState(false);
  const [num, setNum] = useState(4);
  const [Enum, setENum] = useState(5);
  const [Episodes, setEpisodes] = useState();
  const [Loading, setLoading] = useState(false);
  const [showWatchOptions, setShowWatchOptions] = useState(false);
  const [showData, setShowData] = useState([]);
  const [EpiList, setEpList] = useState([]);
  //
  const { isMobile } = useContext(TvSeriesContex);
  const [hoveredId, setHoveredId] = useState(null);

  const toggleExpand = (index, item) => {
    setExpandedItem(expandedItem === index ? null : index);
    // setEpdata({
    //   season_id: item?.id,
    //   season_number: item?.season_number,
    // });
  };

  const handleShowEpisode = () => {
    setShow(!show);
  };

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
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
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

  // The TvMaize API Calls Logic
  async function getShow() {
    try {
      const { data } = await axios.get(
        `https://api.tvmaze.com/lookup/shows?thetvdb=${ID.tvdb_id}`
      );
      setShowData(data.id);
    } catch (error) {}
  }

  async function getEpisodes() {
    try {
      const { data } = await axios.get(
        `https://api.tvmaze.com/shows/${showData}/episodes`
      );
      setEpList(data);
    } catch (error) {}
  }

  const [selectedSeason, setSelectedSeason] = useState(1);

  // Get unique seasons
  const seasons = [...new Set(EpiList?.map((episode) => episode.season))];

  // Filter episodes based on the selected season
  const filteredEpisodes = EpiList?.filter(
    (episode) => episode.season === selectedSeason
  );

  useEffect(() => {
    getShow();
    getEpisodes();
  }, [ID.tvdb_id, showData]);

  useEffect(() => {
    if (CastId) {
      getCastsImages();
      getCastsMovies();
      getCastsTvSeries();
      getCastsDetails();
    }
  }, [CastId]);

  useEffect(() => {
    getCasts();
    getVideo();
    getImages();
    getIds();
    getReview();
    getDetails();
    getSimilar();
    getYouTubeThumbnail();

    if (ShowCastDetails === true) {
      setShowCastDetails(false);
    }
  }, [Page, id, Details?.imdb_id]);

  const handleTrailer = () => {
    setWatch(false);
    setWatch2(false);
    setTrailer(!Trailer);
  };

  const handleWatch = () => {
    setShowWatchOptions(false);
    setTrailer(false);
    setWatch2(false);
    setWatch(true);
  };

  const handleWatch2 = () => {
    setShowWatchOptions(false);
    setTrailer(false);
    setWatch(false);
    setWatch2(true);
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

  const handleCast = (id) => {
    setCastId(id);
    setShowCastDetails(true);
    setLoading(true);
  };

  if (!Details || Details?.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LuLoader className="animate-spin text-3xl md:text-5xl text-white [animation-duration:0.6s]" />
      </div>
    );
  }

  const Similars = Similar?.filter((dt) => dt.poster_path !== null);
  const Casts = Cast?.filter((dt) => dt.profile_path !== null);
  const Seasons = Details?.seasons?.filter((dt) => dt.poster_path !== null);

  // animations
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

  const handleWatchClick = () => {
    setShowWatchOptions(!showWatchOptions);
    if (Watch === true) {
      setWatch(false);
    }
    if (Watch2 === true) {
      setWatch2(false);
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section with Backdrop */}
      <div className="relative">
        <div className="relative h-[80vh] w-full">
          <img
            src={
              isMobile === true
                ? `https://image.tmdb.org/t/p/w500/${Details?.poster_path}`
                : `https://image.tmdb.org/t/p/original/${Details?.backdrop_path}`
            }
            alt={Details?.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-20% to-transparent" />
        </div>

        {/* TvSeries Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="hidden gap-8 px-4 md:container md:px-0 md:mx-auto md:flex">
            <div className="hidden w-64 translate-y-16 md:block">
              <img
                src={`https://image.tmdb.org/t/p/w500/${Details?.poster_path}`}
                alt={Details?.name}
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="flex-1">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white md:text-6xl">
                  {Details?.name}
                </h1>
                <p className="text-xl font-light font-Raleway text-cyan-400">
                  {Details?.tagline}
                </p>
                <div className="flex flex-wrap gap-2">
                  {Details?.genres?.map((genre, index) => (
                    <span
                      key={genre.id + index}
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
                </div>
                <p className="max-w-3xl text-gray-300 md:text-lg">
                  {Details?.overview}
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative">
                    <button
                      onClick={handleWatchClick}
                      className="flex items-center justify-center w-full gap-2 px-6 py-3 font-medium text-white transition-all bg-red-600 rounded-lg hover:bg-red-700 group"
                    >
                      <Play className="w-5 h-5" />
                      <span>Watch Now</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          showWatchOptions ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showWatchOptions && (
                      <div className="absolute z-10 w-full mt-2 overflow-hidden bg-white rounded-lg shadow-lg">
                        <div className="flex flex-col divide-y divide-gray-100">
                          <Link
                            className="px-4 py-3 text-left transition-colors hover:bg-gray-50"
                            onClick={handleWatch}
                          >
                            Watch Link 1 (Ads)
                          </Link>
                          <Link
                            className="px-4 py-3 text-left transition-colors hover:bg-gray-50"
                            onClick={handleWatch2}
                          >
                            Watch Link 2
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleTrailer}
                    className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-white transition-colors bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    <Play className="w-5 h-5" />
                    <span>Watch Trailer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tvseries mobile overlay view */}
      <div className="flex gap-8 px-4 md:container md:mx-auto md:hidden">
        <div className="flex-1">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white md:text-6xl">
              {Details?.name}
            </h1>
            <p className="text-sm font-light font-Raleway text-cyan-400">
              {Details?.tagline}
            </p>
            <div className="flex flex-wrap gap-2">
              {Details?.genres?.map((genre, index) => (
                <>
                  <span
                    key={genre.id + index}
                    className="px-3 py-1 text-xs text-gray-200 rounded-full bg-gray-800/80"
                  >
                    {genre.name}
                  </span>
                </>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-xs">
                <Rating value={Details?.vote_average} />
                <span className="text-gray-300">
                  {Details?.vote_average?.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-400">••••••</span>
            </div>
            <p className="max-w-3xl text-sm text-gray-300">
              {Details?.overview}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative">
                <button
                  onClick={handleWatchClick}
                  className="flex items-center justify-center w-full gap-2 px-6 py-1 text-xs font-medium text-white transition-all bg-red-600 rounded hover:bg-red-700 group"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Now</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showWatchOptions ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showWatchOptions && (
                  <div className="absolute z-10 w-full mt-2 overflow-hidden bg-white rounded-lg shadow-lg">
                    <div className="flex flex-col divide-y divide-gray-100">
                      <Link
                        className="px-4 py-3 text-xs text-left transition-colors hover:bg-gray-50"
                        onClick={handleWatch}
                      >
                        Watch Link 1 (Ads)
                      </Link>
                      <Link
                        className="px-4 py-3 text-xs text-left transition-colors hover:bg-gray-50"
                        onClick={handleWatch2}
                      >
                        Watch Link 2
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleTrailer}
                className="flex items-center justify-center gap-2 px-6 py-1 text-xs font-medium text-white transition-colors bg-gray-800 rounded hover:bg-gray-700"
              >
                <Play className="w-5 h-5" />
                <span>Watch Trailer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Watch Section */}
      {Watch2 && (
        <div className="py-16 md:container md:mx-auto">
          <div className="movie-player">
            {/* Iframe with improved styling */}
            <iframe
              src={`https://www.2embed.cc/embedtv/${ID.imdb_id}`}
              width="100%"
              height="500px"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="z-0 w-full transition-all duration-300 ease-in-out transform rounded-lg "
              title="TV Player"
            />
          </div>

          {/* Optional: Movie Information Overlay */}
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-gray-700">
              {Details.name || "TvSeries Player"}
            </h2>
            <p className="text-sm text-gray-600">IMDB ID: {ID.imdb_id}</p>
          </div>
        </div>
      )}
      {Watch && (
        <div className="container py-16 mx-auto">
          <div className="movie-player">
            {/* Iframe with improved styling */}
            <iframe
              src={`https://vidsrc.xyz/embed/tv?imdb=${ID.imdb_id}`}
              width="100%"
              height="500px"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="z-0 w-full transition-all duration-300 ease-in-out transform rounded-lg "
              title="TV Player"
            />
          </div>

          {/* Optional: Movie Information Overlay */}
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-gray-700">
              {Details.name || "TvSeries Player"}
            </h2>
            <p className="text-sm text-gray-600">IMDB ID: {ID.imdb_id}</p>
          </div>
        </div>
      )}
      {/* Trailer Section */}
      {Trailer && (
        <div className="container px-4 py-16 mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Main Video Player */}
            <div className="md:col-span-2">
              <ReactPlayer
                width="100%"
                height="500px"
                controls={true}
                url={`https://www.youtube.com/watch?v=${Selected}`}
                className="overflow-hidden rounded-lg"
              />
            </div>

            {/* Thumbnails Sidebar */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {Videos?.map((video, index) => (
                <button
                  key={index + video.key}
                  onClick={() => handleSelect(video.key)}
                  className={`w-full transition-transform duration-200 ${
                    Selected === video.key ? "ring-2 ring-yellow-500" : ""
                  }`}
                >
                  <div className="overflow-hidden bg-black border-b-2 border-gray-500 rounded-lg">
                    {/* Thumbnail Container */}
                    <div className="relative aspect-video">
                      <img
                        src={getYouTubeThumbnail(video.key)}
                        alt={`${video.type} thumbnail`}
                        className="object-cover w-full h-full"
                      />
                      {/* Overlay with video type badge */}
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 text-xs font-semibold text-white rounded-full bg-black/60">
                          {video.type}
                        </span>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{video.type}</span>
                        <span className="px-2 py-1 text-xs font-bold text-white capitalize bg-red-700 rounded-md">
                          {video.site}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* list of seasosons  */}
      <div className="flex flex-col gap-10 px-4 mt-16 md:container md:px-0 md:mx-auto md:flex-row">
        <table className="w-full text-xs bg-gray-800 rounded-lg md:text-sm bg-opacity-20 md:w-1/2">
          <tbody className="">
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 text-slate-200">Status:</td>
              <td className="px-4 py-2 text-xs text-yellow-500 md:text-sm lg:text-lg">
                {Details?.status}
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 text-slate-200">Release Date:</td>
              <td className="px-4 py-2 text-xs text-yellow-500 md:text-sm lg:text-lg">
                {Details?.first_air_date}
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 text-slate-200">Number of Episodes:</td>
              <td className="px-4 py-2 text-slate-200">
                {Details?.number_of_episodes}
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 text-slate-200">Number of Seasons:</td>
              <td className="px-4 py-2 text-slate-200">
                {Details?.number_of_seasons}
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 text-slate-200">Companises </td>
              <td className="px-4 py-2 text-slate-200">
                <div className="flex flex-wrap gap-y-2 gap-x-3">
                  {Details?.production_companies?.map((comp, index) => {
                    return (
                      <div
                        className="px-4 bg-gray-700 rounded-xl"
                        key={comp?.id + index}
                      >
                        <p className="text-xs md:text-sm">{comp?.name}</p>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
            {Details.episode_run_time.length !== 0 && (
              <tr className="border-b border-gray-700">
                <td className="px-4 py-2 text-slate-200">Episode Runtime:</td>
                <td className="px-4 py-2 text-slate-200">
                  {Math.floor(Details?.episode_run_time[0] / 60)}h{" "}
                  {Details?.episode_run_time[0] % 60}m
                </td>
              </tr>
            )}
            {Details.next_episode_to_air !== null && (
              <tr className="border-b border-gray-700">
                <td className="px-4 py-2 text-slate-200">
                  Next Episode Release:
                </td>
                <td className="px-4 py-2 text-slate-200">
                  {Details?.next_episode_to_air.air_date}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* list of all episodes of the season */}
        <div className="w-full overflow-hidden rounded-lg md:w-1/2 bg-slate-800/20">
          <div className="flex items-center gap-4 mb-2">
            <label
              htmlFor="seasonSelect"
              className="text-sm font-medium text-gray-500"
            >
              Select Season:
            </label>
            <select
              id="seasonSelect"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="block w-40 px-3 py-1 text-sm text-gray-300 border border-gray-600 rounded outline-none bg-inherit"
            >
              {seasons.map((season) => (
                <option className="text-gray-900 " key={season} value={season}>
                  Season {season}
                </option>
              ))}
            </select>
          </div>
          {/* Header */}
          <div className="sticky top-0 border-b backdrop-blur-sm border-slate-700">
            <div className="grid grid-cols-4 px-2 py-3 md:px-0">
              <h3 className="text-xs font-semibold tracking-wider uppercase md:text-sm text-slate-300">
                Date
              </h3>
              <h3 className="text-xs font-semibold tracking-wider text-center uppercase md:text-sm text-slate-300">
                Season
              </h3>
              <h3 className="text-xs font-semibold tracking-wider text-center uppercase md:text-sm text-slate-300">
                Episode
              </h3>
              <h3 className="w-full text-xs font-semibold tracking-wider text-right uppercase md:text-sm md:text-left text-slate-300">
                Status
              </h3>
            </div>
          </div>

          {/* Table Body */}
          <div className="h-[460px]  overflow-x-hidden overflow-y-auto">
            <motion.div
              className="divide-y divide-slate-700"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.1,
                  },
                },
              }}
            >
              {filteredEpisodes?.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 20,
                      scale: 0.95,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 12,
                      },
                    },
                  }}
                  whileHover={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    transition: { duration: 0.2 },
                  }}
                  className="grid grid-cols-4 px-2 py-4 transition-colors md:px-0 hover:bg-slate-700/30"
                >
                  <span className="text-xs md:text-sm text-slate-300">
                    {item?.airdate}
                  </span>
                  <span className="text-xs text-center md:text-sm text-slate-300">
                    {item.season}
                  </span>
                  <span className="text-xs text-center md:text-sm text-slate-300">
                    {item.number}
                  </span>
                  <span className="text-xs md:text-sm">
                    <EpisodeStatus episode={item} />
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative flex-grow space-y-6">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
        {Seasons?.slice(0, num)?.map((item, index) => (
          <motion.div
            key={index + item?.name}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex items-center ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div
              className={`w-1/2 ${
                index % 2 === 0 ? "text-right pr-4" : "text-left pl-4"
              }`}
            >
              (
              <>
                <div
                  className={`flex items-center ${
                    index % 2 === 0 ? "justify-end" : "justify-start"
                  } space-x-2`}
                >
                  {index % 2 !== 0 && (
                    <div className="text-5xl text-gray-500 " />
                  )}
                  <div className={` ${index % 2 === 0 ? "pr-1" : " pl-5"}`}>
                    <div>
                      <h2
                        className="text-base font-semibold text-white transition-colors cursor-pointer hover:text-blue-400 md:text-2xl"
                        onClick={() => toggleExpand(index, item)}
                      >
                        {item.name}
                      </h2>
                      <p className="text-sm text-gray-100 md:text-md">
                        Season {item.season_number}
                      </p>
                      <p className="text-sm text-gray-100">
                        Episodes {item.episode_count}
                      </p>
                      {item.air_date && (
                        <p className="text-xs text-gray-100 md:text-sm">
                          Released {item.air_date}
                        </p>
                      )}
                    </div>
                  </div>
                  {index % 2 === 0 && (
                    <div className="text-5xl text-gray-500 " />
                  )}
                </div>
                <AnimatePresence>
                  {expandedItem === index && (
                    <>
                      <div className="w-full mt-2">
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`text-xs md:text-sm ${
                            index % 2 === 0
                              ? "text-gray-200 pr-3 md:pl-10 md:text-justify"
                              : "max-w-3xl pl-7 mt-2 text-gray-200"
                          }`}
                        >
                          {item?.overview}
                        </motion.p>
                      </div>
                      {/* image */}
                      <div
                        className={` ${
                          index % 2 === 0
                            ? "flex items-end justify-end w-full"
                            : "flex  items-start w-full justify-start"
                        }`}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500/${item?.poster_path}`}
                          alt={item?.name}
                          className={`mt-3 rounded-lg  ${
                            index % 2 === 0 ? "pr-3" : "pl-7"
                          }`}
                        />
                      </div>
                      {/* Episodes lists */}
                      <div
                        className={`mt-3 hidden rounded-lg  ${
                          index % 2 === 0
                            ? "pr-3 w-full items-end justify-end flex"
                            : "pl-7 w-full"
                        }`}
                      >
                        <button
                          className={`mt-3 rounded-lg  ${
                            index % 2 === 0
                              ? "md:flex hidden  py-1.5 px-4 bg-slate-700 text-white mt-4"
                              : "md:flex hidden  py-1.5 px-4 bg-slate-700 text-white mt-4"
                          }`}
                          onClick={handleShowEpisode}
                        >
                          Episodes
                        </button>
                      </div>
                      {show ? (
                        <div
                          className={` ${
                            index % 2 === 0
                              ? "md:flex flex-col  mt-2 hidden  justify-end w-full"
                              : "md:flex flex-col mt-2 hidden  w-full justify-start"
                          }`}
                        >
                          {Episodes?.slice(0, Enum)?.map((Ep, index) => {
                            return (
                              <div
                                key={index + Ep.id}
                                className="grid grid-cols-1 px-5 gap-x-3"
                              >
                                {/* Episod banner */}
                                <div className="flex flex-row p-2 text-white bg-gray-800 gap-x-4">
                                  <p>Episode</p>
                                  {Ep?.episode_number}
                                  <h1>{Ep?.name}</h1>
                                </div>
                                {/* name and description */}
                                <div className="py-3 text-white">
                                  <p className="line-clamp-3">{Ep?.overview}</p>
                                </div>
                              </div>
                            );
                          })}
                          {Enum >= Episodes?.length ? (
                            <div
                              className={`mt-3 rounded-lg  ${
                                index % 2 === 0
                                  ? "pr-3 w-full items-end justify-end flex"
                                  : "pl-7 w-full"
                              }`}
                            >
                              <button
                                onClick={() => setENum(Enum - 4)}
                                className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-slate-700 text-slate-200"
                              >
                                <MinusCircle className="w-4 h-4" />
                                <span>Show Less</span>
                              </button>
                            </div>
                          ) : (
                            <div
                              className={`mt-3 rounded-lg  ${
                                index % 2 === 0
                                  ? "pr-3 w-full flex-row gap-x-5 items-end justify-end flex"
                                  : "pl-6 w-full flex-row gap-x-5"
                              }`}
                            >
                              <button
                                onClick={() => setENum(Enum - 4)}
                                className={`${
                                  Enum >= 6
                                    ? "inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-slate-700 text-slate-200"
                                    : "hidden"
                                }`}
                              >
                                <MinusCircle className="w-4 h-4" />
                                <span>Show Less</span>
                              </button>
                              <button
                                onClick={() => setENum(Enum + 4)}
                                className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white transition-colors bg-slate-600 rounded-lg hover:bg-red-700"
                              >
                                <PlusCircle className="w-4 h-4" />
                                <span>Show More</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </AnimatePresence>
              </>
              )}
            </div>
            <div className="relative">
              <div
                className={`mt-3 rounded-lg  ${
                  index % 2 === 0
                    ? "absolute z-10 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full top-1/2 "
                    : "absolute z-10 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full top-1/2 left-1/2"
                }`}
              ></div>
              <div
                className={`mt-3 rounded-lg  ${
                  index % 2 === 0
                    ? "w-8 h-0.5 bg-gray-200 absolute top-1/2 right-1/2 transform -translate-y-1/2"
                    : "w-8 h-0.5 bg-gray-200 absolute top-1/2 left-1/2 transform -translate-y-1/2"
                }`}
              ></div>
            </div>
            <div className="w-1/2"></div>
          </motion.div>
        ))}
      </div>
      <div
        className={`${
          Seasons?.length <= 4
            ? "hidden"
            : "container flex items-end justify-end w-full mx-auto mt-16"
        }`}
      >
        {num >= Seasons?.length ? (
          <button
            onClick={() => setNum(num - 4)}
            className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-slate-700 text-slate-200"
          >
            <MinusCircle className="w-4 h-4" />
            <span>Show Less</span>
          </button>
        ) : (
          <div className="flex flex-row gap-x-5">
            <button
              onClick={() => setNum(num - 4)}
              className={`${
                num >= 5
                  ? "inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-slate-700 text-slate-200"
                  : "hidden"
              }`}
            >
              <MinusCircle className="w-4 h-4" />
              <span>Show Less</span>
            </button>
            <button
              onClick={() => setNum(num + 4)}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Show More</span>
            </button>
          </div>
        )}
      </div>

      {/* Cast Section */}
      <div className="px-4 py-16 md:container md:px-0 md:mx-auto">
        <h2 className="relative py-2 mb-8 overflow-hidden text-base font-bold text-white md:text-2xl font-scifi group">
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
              key={person.name + index}
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
          className="px-4 md:container md:px-0 md:mx-auto rounded-xl"
        >
          {Loading ? (
            <div className="flex items-center justify-center">
              <LuLoader className="animate-spin text-3xl md:text-5xl text-white [animation-duration:0.6s]" />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-8 lg:flex-row">
                {/* Left side - Poster Image */}
                <motion.div
                  variants={imageVariants}
                  className="w-full lg:w-1/3"
                >
                  <div className="container relative flex flex-col mx-auto overflow-hidden rounded-xl group">
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
                    className="flex flex-row items-center justify-between mb-6 text-2xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text"
                  >
                    {CastDetails?.name}
                    <Link onClick={() => setShowCastDetails(false)}>
                      <RxCrossCircled className="text-2xl text-gray-100 md:text-3xl" />
                    </Link>
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
                        key={item.label + index}
                        variants={tableRowVariants}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        className="py-3 transition-colors duration-200 border-b rounded-lg md:p-4 border-gray-700/50 hover:bg-gray-800/30"
                      >
                        <div className="flex items-center gap-4">
                          {item.icon}
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-400">
                              {item.label}
                            </h3>
                            <div className="mt-1 text-xs text-white md:text-sm">
                              {item.value}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <motion.div
                      variants={tableRowVariants}
                      custom={8}
                      initial="hidden"
                      animate="visible"
                      className="py-3 transition-colors duration-200 border-b rounded-lg md:p-4 border-gray-700/50 hover:bg-gray-800/30"
                    >
                      <div className="flex items-center gap-4">
                        <Heart className={iconStyle} />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-400">
                            Biography
                          </h3>
                          <div className="mt-1 text-xs leading-relaxed text-white md:text-sm">
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
                <h1 className="text-base text-gray-200 md:text-2xl font-Raleway">
                  {CastMovies?.cast?.length} {CastDetails?.name} Movies
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
                <h1 className="text-base text-gray-200 md:text-2xl font-Raleway">
                  {CastTvSeries?.cast?.length} {CastDetails?.name} TvSeries
                </h1>
              </div>
              <div className="grid grid-flow-col gap-4 py-4 overflow-x-auto">
                {CastTvSeries?.cast?.map((cmov, index) => {
                  return (
                    <TvPosterExpands
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
                <h1 className="text-base text-gray-200 md:text-2xl font-Raleway">
                  {CastImages?.profiles?.length} Images of {CastDetails?.name}
                </h1>
              </div>
              <div className="grid grid-flow-col gap-4 py-4 overflow-x-auto">
                {CastImages?.profiles?.map((cimg, index) => {
                  return <CastPoster key={cimg.width + index} actor={cimg} />;
                })}
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Tvseries Stills */}
      <section className="px-4 py-12 md:container md:px-0 md:mx-auto">
        <h2 className="mb-6 text-base font-bold text-white md:text-2xl">
          TvSeries Stills
        </h2>
        <div className="grid grid-flow-col gap-4 pb-4 overflow-x-auto">
          {Images?.map((image, index) => (
            <div key={index + image?.file_path} className="w-[400px]">
              <img
                src={`https://image.tmdb.org/t/p/w780/${image?.file_path}`}
                alt={`Movie still ${index + 1}`}
                className="rounded-lg shadow-lg"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Similar TVseries */}
      {Similar.length > 0 && (
        <section className="px-4 py-12 md:container md:px-0 md:mx-auto">
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
                  <h2 className="text-base font-bold md:text-2xl">
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
                  <p className="mt-1 text-xs text-gray-400 md:text-sm">
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
                        key={i + "Azcds"}
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
                  key={i + "ACDS"}
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
              <TvSeriesPoster
                key={movie.id + index}
                name={movie?.name}
                image={movie?.poster_path}
                image2={movie?.backdrop_path}
                id={movie.id}
                rating={movie?.vote_average}
              />
            ))}
          </div>
          <div className="w-full mt-10">
            <div className="flex items-center justify-between gap-3 md:justify-end">
              {/* Less/More Button */}
              {count === 20 ? (
                <button
                  onClick={handleDecrease}
                  className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium transition-colors rounded-lg md:text-sm hover:bg-slate-700 text-slate-200"
                >
                  <MinusCircle className="w-4 h-4" />
                  <span>Show Less</span>
                </button>
              ) : (
                <button
                  onClick={handleIncrese}
                  className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-white transition-colors bg-red-600 rounded-lg md:text-sm hover:bg-red-700"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Show More</span>
                </button>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePage}
                  className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-white transition-colors bg-red-600 rounded-lg md:text-sm hover:bg-red-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handlePages}
                  className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-white transition-colors bg-red-600 rounded-lg md:text-sm hover:bg-red-700"
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
        <section className="px-4 py-12 md:container md:px-0 md:mx-auto">
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
                          key={i + "erdf"}
                          className="w-2 h-2 text-yellow-400 fill-yellow-400 animate-pulse"
                          style={{ animationDelay: `${i * 200}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Heading content */}
                <div className="flex flex-col">
                  <h2 className="text-base font-bold tracking-tight md:text-2xl">
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
                  <p className="flex items-center gap-2 mt-1 text-xs text-gray-400 md:text-sm">
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
                        key={i + "tufy"}
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
                  key={i + "jfhjdh"}
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
              <div
                key={index + review?.author}
                className="p-3 rounded-lg md:p-6 bg-gray-800/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <IoPersonCircleOutline className="text-2xl text-gray-400 md:text-3xl" />
                  <h3 className="text-base font-semibold text-white md:text-xl">
                    {review.author}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed text-gray-300 md:text-sm font-Raleway">
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
