import React, { useContext } from "react";
import HeroSection from "./HeroSection";
import TrendingMovies from "../MovieScreens/TrendingMovies";
import TrendingSeries from "../TvSeriesScreens/TrendingSeries";
import UpComingMovies from "../MovieScreens/UpComingMovies";
import { Sentry } from "react-activity";
import MovieListContext from "../../Context/MovieListContext";

function MainPage() {
  const { Trending } = useContext(MovieListContext);

  if (!Trending || Trending?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Sentry color="#727981" size={32} speed={1} animating={true} />
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
