import React, { useEffect, useState } from "react";
import movies from "../MData/MoviesData.json";
import { Link } from "react-router-dom";
import ScrollToTopButton from "./pageScroll";
import ReactPaginate from "react-paginate";

function Moviedisplay() {
  const { data } = movies;
  const [itemOffset, setItemOffset] = useState(0);
  const [Bigdatas, setDatas] = useState([]);
  let itemsPerPage = 12;

  //scroll top logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset; // Change the threshold as per your requirement
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
                    onClick={scrollToTop}
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
            activeClassName="bg-slate-900 shadow-md shadow-white animate-bounce duration-700"
            previousClassName="bg-gray-200 text-black font-semibold px-2"
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

export default Moviedisplay;
