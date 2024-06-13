import React, { useContext, useEffect, useState } from "react";
import UpcomingMovies from "../Movie/UpcomingMovies";
import MovieList from "../Movie/MovieList";
import TvSeriesList from "../TvSeries/TvSeriesList";
import MovieListContext from "../Context/MovieListContext";
import TopRatedMovies from "../Movie/TopRatedMovies";
import { useNavigate } from "react-router-dom";
import { Dots } from "react-activity";
import "react-activity/dist/library.css";
import TrendinG from "../Movie/Trending";
import Swipper3 from "../Components/Swipper/Swipper3";
import NavBar1 from "../Components/NavBar1";

//
function HomePage() {
  const { Trending } = useContext(MovieListContext);
  const [Poster, setPoster] = useState([]);
  const [value, setValue] = useState(Math.floor(Math.random() * 20) + 1);
  const navigate = useNavigate();

  //User navigation to poster
  const HandleNavigate = () => {
    navigate(`/Details/${Trending[value].id}`);
  };

  useEffect(() => {
    const Data = Trending.map((data, index) => {
      return data.backdrop_path;
    });
    setPoster(Data);
  }, [value, Trending]);

  if (!Trending || Trending.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <Dots size={50} className="hidden xl:flex" color="gray" speed={0.5} />
        <Dots
          size={40}
          className="lg:flex hidden xl:hidden"
          color="gray"
          speed={0.5}
        />
        <Dots size={30} className="sm:hidden flex" color="gray" speed={0.5} />
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
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-l via-transparent from-transparent to-slate-800"></div>
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-b from-transparent to-slate-800"></div>
        <div className="absolute bottom-0 lg:px-10 px-4">
          <h1 className="mb-3 lg:text-6xl md:text-5xl text-4xl font-extrabold text-slate-200">
            {Trending[value].title || ""}
          </h1>

          <p className="lg:text-2xl md:text-xl  tracking-tighter line-clamp-5  max-w-6xl text-slate-300 ">
            {Trending[value].overview}
          </p>
        </div>
        {/* <div className="absolute top-10 lg:px-10 px-4 block">
          <div className="flex flex-row space-x-2">
            <h2 className="md:text-2xl text-lg text-slate-200">Date:</h2>
            <h2 className="md:text-2xl text-lg text-slate-200">
              {Trending[value].release_date}
            </h2>
          </div>
        </div> */}
        <div>
          <NavBar1 />
        </div>
        <div className="absolute right-14 xl:top-48 lg:top-20 top-20 md:flex hidden ">
          <Swipper3 data={Trending} setValue={setValue} value={value} />
        </div>
      </div>
      <div className="flex gap-y-5 sm:flex-row flex-col justify-between lg:max-w-lg items-center lg:px-10 px-4 mt-5">
        <button
          onClick={HandleNavigate}
          className="py-2 w-full mt-3 sm:w-auto px-8 ring-1 ring-slate-200 lg:text-xl text-sm text-slate-200"
        >
          MORE INFO
        </button>
      </div>
      <div className="flex flex-col mt-28 md:mt-12 ">
        {/* insert here */}
        <div className="flex flex-col md:mt-[-5px] mt-[-70px] gap-y-10 items-center justify-between">
          <div className="flex flex-col">
            <MovieList />
            <TopRatedMovies />
            {/* series section */}
            <TrendinG />
            <TvSeriesList />
            {/*  */}
            <UpcomingMovies />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
