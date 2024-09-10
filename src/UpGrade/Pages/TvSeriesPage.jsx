import React, { useContext } from "react";
import TvHeroSection from "../TvSeriesScreens/TvHeroSection";
import TopRatedSeries from "../TvSeriesScreens/TopRatedSeries";
import TodaySeies from "../TvSeriesScreens/TodaySeries";
import TvSeriesList from "../TvSeriesScreens/TvSeriesList";
import TvSeriesContex from "../../Context/TvSeriesContext";
import AiringToday from "../TvSeriesScreens/AiringToday";
import { Dots } from "react-activity";

function TvSeriesPage() {
  const { Todaylist } = useContext(TvSeriesContex);

  if (!Todaylist || Todaylist?.length === 0) {
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
