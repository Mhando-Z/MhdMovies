"use server";

import React, { useContext } from "react";
import TvHeroSection from "../TvSeriesScreens/TvHeroSection";
import TopRatedSeries from "../TvSeriesScreens/TopRatedSeries";
import TodaySeies from "../TvSeriesScreens/TodaySeries";
import TvSeriesList from "../TvSeriesScreens/TvSeriesList";
import TvSeriesContex from "../../Context/TvSeriesContext";
import AiringToday from "../TvSeriesScreens/AiringToday";
import { LuLoader } from "react-icons/lu";

function TvSeriesPage() {
  const { Todaylist } = useContext(TvSeriesContex);

  if (!Todaylist || Todaylist?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div>
          <LuLoader className="animate-spin text-3xl md:text-5xl text-white [animation-duration:0.6s]" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-y-5">
      {/* TvHerosection */}
      <TvHeroSection />
      {/* Trending this week */}
      <TodaySeies />
      {/* Airing today */}
      <AiringToday />
      {/* top rated series */}
      <TopRatedSeries />
      {/* Popular TvSeries */}
      <TvSeriesList />
    </div>
  );
}

export default TvSeriesPage;
