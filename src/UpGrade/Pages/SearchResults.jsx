import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchPoster from "../Components/SearchPoster";
import { motion } from "framer-motion";
import { Dots } from "react-activity";
import { MinusCircle, PlusCircle } from "lucide-react";

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

  if (!Dataquery) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div>
          <Dots color="gray" size={25} speed={1} animating={true} />
        </div>
      </div>
    );
  }

  const Dataque = Dataquery?.filter((dt) => dt.poster_path !== null);

  // Conditional rendering for no results found
  if (Dataque.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-100">
        <h1 className="mb-4 text-2xl font-semibold">No results found</h1>
        <p className="text-lg">
          Your search for "<span className="font-medium">{id}</span>" did not
          return any matches.
        </p>
      </div>
    );
  }

  return (
    <div className="container flex flex-col min-h-screen mx-auto mt-20">
      <h1 className="mt-3 text-lg font-medium text-gray-100 mb-7 font-roboto">
        Search Results for... "{id}"
      </h1>
      <div className="grid grid-cols-3 gap-2 gap-y-8 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 ">
        {Dataque?.slice(0, count).map((data, index) => {
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
      <div className="w-full mt-10">
        <div className="flex items-center justify-end gap-3">
          {/* Less/More Button */}
          {count === 20 ? (
            <button
              onClick={handleDecrease}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-slate-700 text-slate-200"
            >
              <MinusCircle className="w-4 h-4" />
              <span>Show Less</span>
            </button>
          ) : (
            <button
              onClick={handleIncrese}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Show More</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
