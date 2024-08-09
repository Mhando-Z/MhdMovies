import React, { useContext } from "react";
import HeroSection from "./HeroSection";
import TrendingMovies from "../MovieScreens/TrendingMovies";
import TrendingSeries from "../TvSeriesScreens/TrendingSeries";
import UpComingMovies from "../MovieScreens/UpComingMovies";
import MovieListContext from "../../Context/MovieListContext";
import { ImLoop2 } from "react-icons/im";

function MainPage() {
  const { Trending } = useContext(MovieListContext);

  if (!Trending || Trending?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div>
          <ImLoop2 className="text-3xl text-gray-100 transition-all duration-700 opacity-70 md:text-4xl animate-spin" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-y-5">
      {/* Home Page */}
      <HeroSection />
      {/* Trending Movies */}
      <TrendingMovies />
      {/* Trending Series */}
      <TrendingSeries />
      {/* Upcoming Movies */}
      <UpComingMovies />
    </div>
  );
}

export default MainPage;
