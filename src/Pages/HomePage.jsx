import React, { useContext, useEffect, useState } from "react";
import UpcomingMovies from "../Movie/UpcomingMovies";
import MovieList from "../Movie/MovieList";
import TvSeriesList from "../TvSeries/TvSeriesList";
import TodaySeies from "../TvSeries/TodaySeies";
import ScrollToTopButton from "../Components/pageScroll";
import MovieListContext from "../Context/MovieListContext";
import TopRatedMovies from "../Movie/TopRatedMovies";

function HomePage() {
  const { Movielists } = useContext(MovieListContext);
  const [Poster, setPoster] = useState([]);
  const [value] = useState(Math.floor(Math.random() * 20));

  useEffect(() => {
    const Data = Movielists.map((data, index) => {
      return data.backdrop_path;
    });
    setPoster(Data);
  }, [value, Movielists]);

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
      </div>
      <div className="flex flex-col md:mt-[-220px] mt-[-370px] gap-y-10 items-center justify-between">
        <div className="flex flex-col">
          <MovieList />
          <TopRatedMovies />
        </div>
        <div className="flex flex-col">
          <TodaySeies />
          <TvSeriesList />
        </div>
        <div className="flex flex-col">
          <UpcomingMovies />
        </div>
        <ScrollToTopButton />
      </div>
    </div>
  );
}

export default HomePage;
