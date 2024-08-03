import React, { useContext, useEffect, useState } from "react";
import TvSeriesList from "../TvSeries/TvSeriesList";
import TodaySeies from "../TvSeries/TodaySeies";
import TvSeriesContex from "../Context/TvSeriesContext";
import TopRatedSeries from "./TopRated";
import { useNavigate } from "react-router-dom";
import { Dots } from "react-activity";
import "react-activity/dist/library.css";

function TvSeriesPage() {
  const { TopRated } = useContext(TvSeriesContex);
  const [Poster, setPoster] = useState([]);
  const [value, setValue] = useState(Math.floor(Math.random() * 20) + 1);
  const navigate = useNavigate();

  //User navigation to poster
  const HandleNavigate = () => {
    navigate(`/TvDetails/${TopRated[value].id}`);
  };

  useEffect(() => {
    const Data = TopRated.map((data, index) => {
      return data.backdrop_path;
    });
    setPoster(Data);
  }, [value, TopRated]);

  if (!TopRated || TopRated.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <Dots size={50} className="hidden xl:flex" color="gray" speed={0.5} />
        <Dots
          size={40}
          className="hidden lg:flex xl:hidden"
          color="gray"
          speed={0.5}
        />
        <Dots size={30} className="flex sm:hidden" color="gray" speed={0.5} />
      </div>
    );
  }
  return (
    <div>
      <div
        style={{
          backgroundImage: `url("${`https://image.tmdb.org/t/p/w500/${Poster[value]}`}")`,
        }}
        className="w-full h-[700px] bg-no-repeat bg-cover bg-center xl:bg-top relative"
      >
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-l via-transparent from-transparent to-slate-800"></div>
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-slate-800"></div>
        <div className="absolute bottom-0 px-4 lg:px-10">
          <h1 className="mb-3 text-4xl font-extrabold lg:text-6xl md:text-5xl text-slate-200">
            {TopRated[value].name || ""}
          </h1>

          <p className="max-w-6xl tracking-tighter lg:text-2xl md:text-xl line-clamp-5 text-slate-300 ">
            {TopRated[value].overview}
          </p>
        </div>
        {/* <div className="absolute block px-4 top-10 lg:px-10">
          <div className="flex flex-row space-x-2">
            <h2 className="text-lg md:text-2xl text-slate-200">Date:</h2>
            <h2 className="text-lg md:text-2xl text-slate-200">
              {TopRated[value].first_air_date}
            </h2>
          </div>
        </div> */}
      </div>
      <div className="absolute hidden right-14 xl:top-48 lg:top-20 top-20 md:flex "></div>
      <div className="flex flex-col items-center justify-between px-4 mt-5 gap-y-5 sm:flex-row lg:max-w-lg lg:px-10">
        <button
          onClick={HandleNavigate}
          className="w-full px-8 py-2 mt-3 text-sm sm:w-auto ring-1 ring-slate-200 lg:text-xl text-slate-200"
        >
          MORE INFO
        </button>
      </div>
      <div className="flex flex-col mt-28 md:mt-12 ">
        {/* insert here */}
        <div className="flex flex-col md:mt-[-5px] mt-[-70px] gap-y-10 items-center justify-between">
          <div className="flex flex-col">
            <TopRatedSeries />
            <TodaySeies />
            <TvSeriesList />
          </div>
        </div>
      </div>
    </div>

    // <div>
    //   <div
    //     style={{
    //       backgroundImage: `url("${`https://image.tmdb.org/t/p/w500/${Poster[value]}`}")`,
    //     }}
    //     className="w-full bg-fixed lg:h-[600px] h-[400px] bg-no-repeat bg-cover bg-center xl:bg-top relative"
    //   >
    //     <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-l via-transparent from-transparent to-slate-800"></div>
    //     <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-slate-800"></div>
    //     <div className="absolute bottom-0 px-4 lg:px-10">
    //       <h1 className="mb-3 text-4xl font-semibold text-slate-200 ">
    //         {TopRated[value].name}
    //       </h1>

    //       <p className="max-w-6xl tracking-tighter text-justify text md:text-2xl line-clamp-3 text-md text-slate-300 ">
    //         {TopRated[value].overview}
    //       </p>
    //       <button
    //         onClick={HandleNavigate}
    //         className="w-full px-8 py-2 mt-3 text-sm sm:w-auto ring-1 ring-slate-200 lg:text-xl text-slate-200"
    //       >
    //         MORE INFO
    //       </button>
    //     </div>
    //     <div className="absolute block px-4 top-3 lg:px-10">
    //       <div className="flex flex-row space-x-2">
    //         <h2 className="text-lg md:text-2xl text-slate-200">Date:</h2>
    //         <h2 className="text-lg md:text-2xl text-slate-200">
    //           {TopRated[value].release_date}
    //         </h2>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="flex flex-col md:mt-[-5px] mt-[-70px] gap-y-10 items-center justify-between">
    //     <div className="flex flex-col">
    //       <TopRatedSeries />
    //       <TodaySeies />
    //       <TvSeriesList />
    //     </div>
    //     <div className="flex flex-col"></div>
    //     <ScrollToTopButton />
    //   </div>
    // </div>
  );
}

export default TvSeriesPage;
