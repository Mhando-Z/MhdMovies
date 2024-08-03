import React from "react";
import TvHeroSection from "../TvSeriesScreens/TvHeroSection";
import TopRatedSeries from "../TvSeriesScreens/TopRatedSeries";
import TodaySeies from "../TvSeriesScreens/TodaySeries";
import TvSeriesList from "../TvSeriesScreens/TvSeriesList";

function TvSeriesPage() {
  return (
    <div className="flex flex-col gap-y-5">
      {/* TvHerosection */}
      <TvHeroSection />
      {/* top rated series */}
      <TopRatedSeries />
      {/* Trending this week */}
      <TodaySeies />
      {/* Popular TvSeries */}
      <TvSeriesList />
    </div>
  );
}

export default TvSeriesPage;
