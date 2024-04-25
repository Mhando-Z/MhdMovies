import React, { useContext, useEffect, useState } from "react";
import UpcomingMovies from "../Movie/UpcomingMovies";
import MovieList from "../Movie/MovieList";
import TvSeriesList from "../TvSeries/TvSeriesList";
import TodaySeies from "../TvSeries/TodaySeies";
import ScrollToTopButton from "../Components/pageScroll";
import MovieListContext from "../Context/MovieListContext";
import TopRatedMovies from "../Movie/TopRatedMovies";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { Movielists } = useContext(MovieListContext);
  const [Poster, setPoster] = useState([]);
  const [value] = useState(Math.floor(Math.random() * 20));
  const navigate = useNavigate();

  //User navigation to poster
  const HandleNavigate = () => {
    navigate(`/Details/${Movielists[value].id}`);
  };

  useEffect(() => {
    const Data = Movielists.map((data, index) => {
      return data.backdrop_path;
    });
    setPoster(Data);
  }, [value, Movielists]);

  if (!Movielists || Movielists.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <h1 className="text-slate-200">Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          backgroundImage: `url("${`https://image.tmdb.org/t/p/w500/${Poster[value]}`}")`,
        }}
        className="w-full bg-fixed lg:h-[600px] h-[400px] bg-no-repeat bg-cover bg-center xl:bg-top relative"
      >
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-l via-transparent from-transparent to-slate-800"></div>
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-b  from-transparent to-slate-800"></div>
        <div className="absolute bottom-0 lg:px-10 px-4">
          <h1 className="mb-3 text-4xl font-semibold text-slate-200 ">
            {Movielists[value].title}
          </h1>

          <p className=" md:text-2xl line-clamp-3 text-md text-justify tracking-tighter max-w-6xl text-slate-300 ">
            {Movielists[value].overview}
          </p>
          <button
            onClick={HandleNavigate}
            className="py-2 w-full mt-3 sm:w-auto px-8 ring-1 ring-slate-200 lg:text-xl text-sm text-slate-200"
          >
            MORE INFO
          </button>
        </div>
        <div className="absolute top-3 lg:px-10 px-4 block">
          <div className="flex flex-row space-x-2">
            <h2 className="md:text-2xl text-lg text-slate-200">Date:</h2>
            <h2 className="md:text-2xl text-lg text-slate-200">
              {Movielists[value].release_date}
            </h2>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:mt-[-5px] mt-[-70px] gap-y-10 items-center justify-between">
        <div className="flex flex-col">
          <MovieList />
          <TopRatedMovies />
          {/* series section */}
          <TodaySeies />
          <TvSeriesList />
          {/*  */}
          <UpcomingMovies />
        </div>
        <ScrollToTopButton />
      </div>
    </div>
  );
}

export default HomePage;
