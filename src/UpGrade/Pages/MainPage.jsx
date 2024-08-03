import React from "react";
import HeroSection from "./HeroSection";
import TrendingMovies from "../MovieScreens/TrendingMovies";

function MainPage() {
  return (
    <div className="flex flex-col">
      {/* Home Page */}
      <HeroSection />
      {/* Trending Movies */}
      <TrendingMovies />
      {/* Trending Series */}
    </div>
  );
}

export default MainPage;
