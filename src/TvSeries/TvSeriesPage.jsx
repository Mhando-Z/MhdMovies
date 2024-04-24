import React, { useContext, useEffect, useState } from "react";
import TvSeriesList from "../TvSeries/TvSeriesList";
import TodaySeies from "../TvSeries/TodaySeies";
import ScrollToTopButton from "../Components/pageScroll";
import TvSeriesContex from "../Context/TvSeriesContext";
import TopRated from "./TopRated";

function TvSeriesPage() {
  const { Todaylist } = useContext(TvSeriesContex);
  const [Poster, setPoster] = useState([]);
  const [value] = useState(Math.floor(Math.random() * 20));

  useEffect(() => {
    const Data = Todaylist.map((data, index) => {
      return data.backdrop_path;
    });
    setPoster(Data);
  }, [value, Todaylist]);

  return (
    <div>
      <div
        style={{
          backgroundImage: `url("${`https://image.tmdb.org/t/p/w500/${Poster[value]}`}")`,
        }}
        className="w-full bg-fixed lg:h-[600px] h-[400px] bg-no-repeat bg-cover bg-center xl:bg-top relative"
      >
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-l via-transparent from-transparent to-slate-800"></div>
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-b  from-transparent to-slate-800"></div>
      </div>
      <div className="flex flex-col md:mt-[-220px] mt-[-370px] gap-y-10 items-center justify-between">
        <div className="flex flex-col">
          <TodaySeies />
          <TvSeriesList />
          <TopRated />
        </div>
        <div className="flex flex-col"></div>
        <ScrollToTopButton />
      </div>
    </div>
  );
}

export default TvSeriesPage;
