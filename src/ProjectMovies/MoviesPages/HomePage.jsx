import React, { useEffect, useState } from "react";
import movies from "../MData/MoviesData.json";
import { Link } from "react-router-dom";
import ScrollToTopButton from "./pageScroll";
import ReactPlayer from "react-player";
import ReactPaginate from "react-paginate";

function HomePage() {
  const { data } = movies;
  const [play, setPlay] = useState(false);
  const [val, setValue] = useState(Math.floor(Math.random() * 2000));
  const [itemOffset, setItemOffset] = useState(0);
  const [Bigdatas, setDatas] = useState([]);
  let itemsPerPage = 30;

  const handleplay = () => {
    setPlay(true);
  };

  const BigDatax = data.map((data) => {
    return data;
  });
  const handleValue = () => {
    return setValue(Math.floor(Math.random() * 2000));
  };

  // Pages pagination Logic
  const endOffset = itemOffset + itemsPerPage;
  const BigData = Bigdatas.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(Bigdatas.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % Bigdatas.length;
    setItemOffset(newOffset);
  };

  //datashuffle logic
  const shuffle = (array: string[]) => {
    return array
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  };

  useEffect(() => {
    const info = shuffle(data);
    setDatas(info);
  }, []);

  return (
    <div className="shadow-2xl">
      <div className="mb-14 lg:flex hidden p-52 px-0 mx-0 items-center justify-center py-96 relative">
        <div className="lg:flex hidden md:flex absolute top-0 bottom-0 right-0 left-0 items-center justify-center bg-slate-700 p-3 rounded-xl shadow-lg">
          <ReactPlayer
            playing={play}
            width={"100vw"}
            height={"100vh"}
            style={{
              position: "absolute",
              objectFit: "cover",
              backgroundSize: "cover",
            }}
            url={`https://www.youtube.com/watch?v=${BigDatax[val].trailer_yt}`}
          />
        </div>
        <div
          onClick={handleplay}
          className="absolute hidden lg:flex top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent via-transparent to-black"
        ></div>
        <div className="absolute hidden bottom-10 lg:flex items-center justify-between gap-10">
          <div className="flex-col gap-5 justify-center items-center">
            <h1 className="text-4xl md:px-5 px-2 mb-5  md:text-5xl xl:text-6xl md:max-w-5xl font-medium font-sans max-w-sm text-slate-200 left-0">
              {BigDatax[val].title}
            </h1>
            <p className="md:px-5 leading-4 lg:line-clamp-3 xl:text-3xl  left-0 px-2 md:max-w-6xl md:text-2xl md:text-left text-justify max-w-sm text-slate-200">
              {BigDatax[val].overview}
            </p>
          </div>
          <div className="lg:flex items-center justify-center hidden ">
            <Link
              onClick={handleValue}
              className="py-2 px-10 lg:text-2xl text-white xl:text-3xl border-2 border-white"
            >
              Next
            </Link>
            <div className="flex flex-row">
              <Link
                onClick={handleValue}
                to={`https://vidsrc.xyz/embed/movie?imdb=${BigDatax[val].external_ids.imdb_id}`}
                className="py-2 px-10 border border-white xl:text-3xl text-white lg:text-2xl "
              >
                Watch
              </Link>
              <Link
                onClick={handleValue}
                to={`/movie/${String(BigDatax[val].id)}`}
                className="py-2 px-10 xl:text-3xl text-white lg:text-2xl "
              >
                Download
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* For small screens */}
      <div className="mb-5 flex lg:hidden px-0 mx-0 items-center justify-center py-56 relative">
        <div className="flex lg:hidden md:flex absolute top-0 bottom-0 right-0 left-0 items-center justify-center bg-slate-700 p-3 rounded-xl shadow-lg">
          <ReactPlayer
            playing={play}
            width={"100%"}
            height={"100%"}
            style={{
              position: "absolute",
              objectFit: "cover",
              backgroundSize: "cover",
            }}
            url={`https://www.youtube.com/watch?v=${BigDatax[val].trailer_yt}`}
          />
        </div>
        <div
          onClick={handleplay}
          className="absolute lg:hidden flex top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent via-transparent to-black"
        ></div>
        <div className="absolute lg:hidden bottom-10 flex items-end justify-between gap-10">
          <div className="flex-col gap-5 justify-center items-center">
            <h1 className="md:px-5 px-2 sm:mb-5 mb-2  sm:text-4xl text-2xl md:max-w-5xl font-medium font-sans max-w-sm text-slate-200 left-0">
              {BigDatax[val].title}
            </h1>
            <p className="md:px-5 leading-6 line-clamp-4 left-0 px-2 text-md text-left text-slate-200">
              {BigDatax[val].overview}
            </p>
          </div>
          <div className="flex flex-col items-start justify-start lg:hidden ">
            <button
              onClick={handleValue}
              className="py-2 px-10 text-xl text-white"
            >
              Next
            </button>
            <div className="flex flex-col items-start">
              <Link
                to={`https://vidsrc.xyz/embed/movie?imdb=${BigDatax[val].external_ids.imdb_id}`}
                className="py-2 px-10 text-white text-xl "
              >
                Watch
              </Link>
              <Link
                to={`/movie/${String(BigDatax[val].id)}`}
                className="py-2 px-10 text-white text-xl "
              >
                Download
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Small screens */}
      <div className="flex flex-col items-center justify-center">
        <div className="p-1 lg:mt-5 bg-gray-800 lg:p-3 grid grid-cols-3 lg:grid-cols-6 md:grid-cols-5 gap-y-10 gap-x-2 shadow-2xl justify-evenly">
          {BigData.map((data) => {
            return (
              <div
                className="border border-b-2 border-b-slate-50"
                key={data.id}
              >
                <div className="flex duration-1000 shadow-xl hover:scale-105 items-center flex-col gap-2 justify-center mt-2">
                  <Link
                    to={`/movie/${data.id}`}
                    onClick={handleValue}
                    className="text-slate-400 lg:text-2xl line-clamp-2 md:text-xl text-lg text-center font-medium "
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                      alt="posterimage"
                      className=" max-w-screen shadow-l h-auto"
                    />
                    {data.title}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10 md:text-xl bg-slate-800 p-2 shadow-xl flex items-center justify-center ">
          <ReactPaginate
            className="md:text-xl text-md text-sm flex items-center justify-evenly gap-x-3"
            pageClassName=" bg-slate-700 text-white md:px-2 px-1"
            activeClassName="bg-slate-500 text-white animate-bounce duration-700"
            previousClassName=" bg-gray-200 text-black font-semibold px-2"
            nextClassName="bg-gray-200 text-black font-semibold px-2"
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="Prev"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default HomePage;
