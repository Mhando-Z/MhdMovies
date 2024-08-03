import React from "react";
import HeroSection from "./HeroSection";
import TrendingMovies from "../MovieScreens/TrendingMovies";
import TrendingSeries from "../TvSeriesScreens/TrendingSeries";

function MainPage() {
  return (
    <div className="flex flex-col gap-y-5">
      {/* Home Page */}
      <HeroSection />
      {/* Trending Movies */}
      <TrendingMovies />
      {/* Trending Series */}
      <TrendingSeries />
    </div>
  );
}

export default MainPage;
