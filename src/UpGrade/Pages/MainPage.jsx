import React, { useContext } from "react";
import HeroSection from "./HeroSection";
import TrendingMovies from "../MovieScreens/TrendingMovies";
import TrendingSeries from "../TvSeriesScreens/TrendingSeries";
import UpComingMovies from "../MovieScreens/UpComingMovies";
import MovieListContext from "../../Context/MovieListContext";
import { Dots } from "react-activity";

function MainPage() {
  const { Trending } = useContext(MovieListContext);

  if (!Trending || Trending?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div>
          <Dots color="gray" size={25} speed={1} animating={true} />
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
      {/*  */}
    </div>
  );
}

export default MainPage;
