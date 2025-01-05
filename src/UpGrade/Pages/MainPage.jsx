"use server";

import React, { useContext } from "react";
import HeroSection from "./HeroSection";
import TrendingMovies from "../MovieScreens/TrendingMovies";
import TrendingSeries from "../TvSeriesScreens/TrendingSeries";
import UpComingMovies from "../MovieScreens/UpComingMovies";
import MovieListContext from "../../Context/MovieListContext";
import { Spinner } from "react-activity";

function MainPage() {
  const { Trending } = useContext(MovieListContext);

  if (!Trending || Trending?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div>
          <Spinner color="gray" size={50} speed={3} animating={true} />
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
