import React from "react";
import TvHeroSection from "../TvSeriesScreens/TvHeroSection";
import TopRatedSeries from "../TvSeriesScreens/TopRatedSeries";

function TvSeriesPage() {
  return (
    <div className="flex flex-col gap-y-5">
      {/* TvHerosection */}
      <TvHeroSection />
      {/* top rated series */}
      <TopRatedSeries />
    </div>
  );
}

export default TvSeriesPage;
