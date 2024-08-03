import React from "react";
import TvHeroSection from "../TvSeriesScreens/TvHeroSection";
import TopRatedSeries from "../TvSeriesScreens/TopRatedSeries";
import TodaySeies from "../TvSeriesScreens/TodaySeries";

function TvSeriesPage() {
  return (
    <div className="flex flex-col gap-y-5">
      {/* TvHerosection */}
      <TvHeroSection />
      {/* top rated series */}
      <TopRatedSeries />
      {/* Trending this week */}
      <TodaySeies />
    </div>
  );
}

export default TvSeriesPage;
