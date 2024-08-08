import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchPoster from "../Components/SearchPoster";
import { motion } from "framer-motion";

function SearchResults() {
  const [Dataquery, setData] = useState();
  const { id } = useParams();
  const [count, setCount] = useState(14);
  const [Page, setPage] = useState(1);

  const handleIncrese = () => {
    if (count !== 20) {
      setCount(count + 6);
    } else {
      setPage(Page + 1);
    }
  };
  //handle Decrease
  const handleDecrease = () => {
    if (count === 20 && count >= 14) {
      setCount(count - 6);
    }
  };

  async function getDetails() {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/multi?query=${id}&include_adult=false&language=en-US&page=${Page}`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4N2NmOWU3ZTA3ZGVkODBmNTA2MDk5NjRmMWQwNjI4NCIsInN1YiI6IjY1ZmQ3MjkyMGMxMjU1MDE3ZTBjZWEwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r6zxCCnlxPnW6Ba5JCN7rcheNfpl5upzLUmFZ07fZpI",
          },
        }
      );
      setData(data.results);
    } catch (error) {}
  }

  useEffect(() => {
    getDetails();
  }, [id]);
  return (
    <div className="container flex flex-col min-h-screen mx-auto mt-20">
      <h1 className="mt-3 text-2xl font-bold text-gray-100 sm:text-3xl md:text-4xl mb-7 font-roboto">
        Search Results for... "{id}"
      </h1>
      <div className="grid grid-cols-3 gap-2 gap-y-8 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 ">
        {Dataquery?.slice(0, count).map((data, index) => {
          return (
            <div key={data.id + index}>
              <SearchPoster
                title={data?.title}
                name={data?.name}
                type={data?.media_type}
                image={data?.poster_path}
                id={data?.id}
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
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
