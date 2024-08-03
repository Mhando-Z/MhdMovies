import React, { useContext, useState } from "react";
import { MoviePoster } from "../Components/Collection";
import MovieListContext from "../../Context/MovieListContext";
import { motion } from "framer-motion";

function TrendingMovies() {
  const { Movielists } = useContext(MovieListContext);
  const { setPage1 } = useContext(MovieListContext);
  const { Page1 } = useContext(MovieListContext);
  const [count, setCount] = useState(14);

  const handleIncrese = () => {
    if (count !== 20) {
      setCount(count + 6);
    }
  };
  //handle Decrease
  const handleDecrease = () => {
    if (count === 20 && count >= 14) {
      setCount(count - 6);
    }
  };
  //Handle Pages Logic
  const handlePages = () => {
    if (Page1 >= 1) {
      setPage1(Page1 + 1);
    }
  };
  const handlePage = () => {
    if (Page1 >= 1) {
      setPage1(Page1 - 1);
    }
  };

  console.log(Movielists);

  return (
    <div className="container flex flex-col mx-auto">
      <h1 className="mt-3 text-2xl font-bold text-gray-100 sm:text-3xl md:text-4xl mb-7 xl:text-5xl font-roboto">
        Trending Movies
      </h1>
      <div className="grid grid-cols-3 gap-2 gap-y-8 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 ">
        {Movielists?.slice(0, count).map((data, index) => {
          return (
            <div key={data.id}>
              <MoviePoster
                title={data?.title}
                image={data?.poster_path}
                id={data.id}
                rating={data?.vote_average}
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-end justify-end w-full mt-10">
        <div className="flex flex-row items-center space-x-5">
          <motion.button
            whileInView={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", ease: "easeOut" }}
            onClick={handleDecrease}
            className={`text-slate-200 text-base xl:text-lg font-semibold cursor-pointer ${
              count === 20 ? "flex" : "hidden"
            }`}
          >
            Less..
          </motion.button>
          <motion.button
            whileInView={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", ease: "easeOut" }}
            onClick={handleIncrese}
            className={`text-slate-200 bg-red-600 px-3 text-base xl:text-lg font-semibold cursor-pointer ${
              count === 20 ? "hidden" : "flex"
            }`}
          >
            More..
          </motion.button>
          <motion.button
            whileInView={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", ease: "easeOut" }}
            onClick={handlePage}
            className="px-3 text-base font-semibold bg-red-600 cursor-pointer xl:text-lg text-slate-200"
          >
            Prev
          </motion.button>
          <motion.button
            whileInView={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", ease: "easeOut" }}
            onClick={handlePages}
            className="px-3 text-base font-semibold bg-red-600 cursor-pointer xl:text-lg text-slate-200"
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default TrendingMovies;
