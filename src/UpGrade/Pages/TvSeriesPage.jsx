import React, { useContext } from "react";
import TvHeroSection from "../TvSeriesScreens/TvHeroSection";
import TopRatedSeries from "../TvSeriesScreens/TopRatedSeries";
import TodaySeies from "../TvSeriesScreens/TodaySeries";
import TvSeriesList from "../TvSeriesScreens/TvSeriesList";
import { ImLoop2 } from "react-icons/im";
import TvSeriesContex from "../../Context/TvSeriesContext";
import AiringToday from "../TvSeriesScreens/AiringToday";

function TvSeriesPage() {
  const { Todaylist } = useContext(TvSeriesContex);

  if (!Todaylist || Todaylist?.length === 0) {
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
      {/* TvHerosection */}
      <TvHeroSection />
      {/* top rated series */}
      <TopRatedSeries />
      {/* Airing today */}
      <AiringToday />
      {/* Trending this week */}
      <TodaySeies />
      {/* Popular TvSeries */}
      <TvSeriesList />
    </div>
  );
}

export default TvSeriesPage;
