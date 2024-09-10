import React, { useContext, useState } from "react";
import MovieListContext from "../../Context/MovieListContext";
import MovieGenre from "../../Data/MovieGenre";
import TvGenre from "../../Data/TvSeriesGenre";
import TvSeriesContex from "../../Context/TvSeriesContext";
import MoviePoster from "../Components/MoviePoster";
import TvSeriesPoster from "../Components/TvSeriesPoster";
import { motion } from "framer-motion";
import logo from "../../Assets/Logo/mhd.png";

function Genres() {
  const { Collected } = useContext(MovieListContext);
  const { Page1 } = useContext(MovieListContext);
  const { HandlePages } = useContext(MovieListContext);
  const { TvCollected } = useContext(TvSeriesContex);
  const { TvHandlePages } = useContext(TvSeriesContex);
  const [ShowContent1, setContent] = useState(true);
  const [ShowContent2, setContent2] = useState(false);
  const [Selected, setSelect] = useState(28);
  const [TvSelected, setSelectTv] = useState(18);
  const [Gname, setName] = useState("");
  const [Gnames, setNames] = useState("");
  const [Unselect, setUnselect] = useState("bg-black");
  const [Unselect1, setUnselect1] = useState("bg-black");
  const { genres } = MovieGenre;
  const { genre } = TvGenre;
  const [count, setCount] = useState(14);
  const [counts, setCounts] = useState(14);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  //handle page incement
  const handleIncrese = () => {
    if (count <= dataFilterd.length) {
      setCount(count + 6);
    } else {
      HandlePages();
    }
  };
  const handleIncreses = () => {
    if (counts <= TvdataFilter.length) {
      setCounts(counts + 6);
    } else {
      TvHandlePages();
    }
  };

  //selecting genres Logic
  const HandleSelect = (value, Name) => {
    setSelect(value);
    setName(Name);
    setUnselect("bg-slate-800 p-1");
    setUnselect1("bg-nome");
    if (ShowContent2 === true) {
      setContent(true);
      setContent2(false);
      setCounts(14);
    }
  };
  const HandleTvSelect = (value, Name) => {
    setSelectTv(value);
    setNames(Name);
    setUnselect("bg-none");
    setUnselect1("bg-slate-800 p-1");
    if (ShowContent1 === true) {
      setContent(false);
      setContent2(true);
      setCount(14);
    }
  };
  //filtering movies and series logic
  const dataFilterd = Collected.filter((dt) => {
    return dt.genre_ids.includes(Selected);
  });
  const TvdataFilter = TvCollected.filter((dt) => {
    return dt.genre_ids.includes(TvSelected);
  });

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 bg-black h-full transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex flex-col justify-between min-h-screen p-6">
          <div>
            <img src={logo} alt="herveg logo" className="h-10 " />
            <nav className="mt-10">
              <div className="flex flex-col w-full">
                <div className="flex flex-col justify-between gap-y-4 ">
                  {/* side panel */}
                  <div className="flex flex-col justify-between md:flex-col">
                    <div className="flex flex-col">
                      <div className="">
                        <div className="px-5 py-5">
                          <h1 className="text-lg font-bold md:text-xl text-slate-200">
                            Movie Genres
                          </h1>
                        </div>
                      </div>
                      <div className="h-[340px] overflow-auto py-3 px-5">
                        {genres?.map((data, index) => {
                          return (
                            <motion.div
                              key={index + data.id}
                              className={`${
                                data.name === Gname ? Unselect : ""
                              }`}
                            >
                              <h1
                                onClick={() => HandleSelect(data.id, data.name)}
                                className="px-4 text-lg font-semibold rounded cursor-pointer text-slate-200"
                              >
                                {data.name}
                              </h1>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="">
                        <div className="px-5 py-5 ">
                          <h1 className="text-lg font-bold md:text-xl text-slate-200">
                            Tv-Series Genres
                          </h1>
                        </div>
                      </div>
                      <div className="h-[300px] overflow-auto py-3 px-5">
                        {genre?.map((data, index) => {
                          return (
                            <div
                              key={index + data.id}
                              className={`${
                                data.name === Gnames ? Unselect1 : " "
                              }`}
                            >
                              <h1
                                onClick={() =>
                                  HandleTvSelect(data.id, data.name)
                                }
                                className="px-4 text-lg font-semibold rounded cursor-pointer text-slate-200"
                              >
                                {data.name}
                              </h1>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </aside>

      {/* Overlay for Sidebar on small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 ml-0 overflow-y-auto md:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between py-4 shadow md:py-6">
          {/* Button to toggle sidebar on mobile */}
          <button
            className="px-4 text-black focus:outline-none"
            onClick={toggleSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <div className="relative flex flex-col items-center gap-x-2 "></div>
        </header>

        <main className="p-4 md:p-6">
          {ShowContent1 && (
            <div className="flex flex-col min-h-screen">
              <div className="sticky top-0 z-40 flex flex-row justify-between w-full px-2 py-4 mb-2 bg-black xl:mb-10">
                <h1 className="px-4 text-xl font-medium border-l-4 border-yellow-400 text-slate-200">
                  {Gname}
                </h1>
                <button
                  className="text-gray-300 md:hidden focus:outline-none"
                  onClick={toggleSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-1">
                  {dataFilterd?.slice(0, count).map((data, index) => {
                    return (
                      <div key={data.id + index}>
                        <MoviePoster
                          title={data.title}
                          image={data.poster_path}
                          id={data.id}
                          rating={data?.vote_average}
                        />
                        <p className="line-clamp-1">{data.title}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-end justify-end px-10 py-4 text-base xl:text-lg gap-x-5">
                  <h1 className="font-semibold text-slate-200">Page {1}</h1>
                  <h1
                    onClick={handleIncrese}
                    className="font-semibold cursor-pointer text-slate-200"
                  >
                    More..
                  </h1>
                </div>
              </div>
            </div>
          )}
          {ShowContent2 && (
            <div className="flex flex-col min-h-screen">
              <div className="sticky top-0 z-40 flex flex-row justify-between w-full px-2 py-4 mb-2 bg-black xl:mb-10 ">
                <h1 className="px-4 text-2xl font-bold border-l-4 border-yellow-400 text-slate-200 ">
                  {Gnames}
                </h1>
                <button
                  className="text-gray-300 md:hidden focus:outline-none"
                  onClick={toggleSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col ">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-1">
                  {TvdataFilter?.slice(0, counts).map((data, index) => {
                    return (
                      <div key={data?.id + index}>
                        <TvSeriesPoster
                          name={data?.name}
                          image={data?.poster_path}
                          id={data?.id}
                          rating={data?.vote_average}
                        />
                        <p>{data.name}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-end justify-end px-2 py-4 gap-x-5">
                  <h1 className="text-xl font-semibold text-slate-200 ">
                    Page {Page1}
                  </h1>
                  <h1
                    onClick={handleIncreses}
                    className="text-xl font-semibold cursor-pointer text-slate-200"
                  >
                    More..
                  </h1>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
export default Genres;
